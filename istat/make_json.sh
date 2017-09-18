#!/usr/bin/env node

(() => {

// dependencies
const fs = require('fs')
const CodiceFiscale = require('../src/codice.fiscale.js')

// helpers
const CHARSET = 'utf8'
const DIR = './name_lists'
const GENDER_LIST = ['M', 'F']
let nameList = []
let duplicateName = []

// create rank
const nameObj = {}
GENDER_LIST.forEach(gender => nameObj[gender] = {}) // { M:{}, F:{} }

// read dir
let fileList = []
try {
  fileList = fs.readdirSync(DIR, CHARSET)
// check for error
} catch (e) {
  console.log(e)
  process.exit(1)
  return
}
// read files
fileList.forEach(FILE_NAME => {
  if (!FILE_NAME.includes('.txt')) { return }
  // read file
  let STR = ''
  try {
    STR = fs.readFileSync(`${DIR}/${FILE_NAME}`, CHARSET)
  // check for error
  } catch (e) {
    console.log(e)
    process.exit(1)
    return
  }
  const JSON_STR = STR.substring(STR.indexOf('{'), STR.lastIndexOf('}') + 1)
  // parse JSON
  const OBJ = JSON.parse(JSON_STR)
  // iterate obj to get male/female lists
  for (let prop in OBJ) {
    if (prop === 'years') { return }
    // get list
    let nameListByGender = OBJ[prop]
    // get list gender
    let gender = nameListByGender[0].gender.toUpperCase()
    // add names to rank
    nameListByGender.forEach(entity => {
      // null or empty or one char string check
      if (entity.name === null || entity.name.length < 2) { return }
      // sanitize name
      let name = entity.name.toUpperCase()
      // trim
      .trim()
      // remove any [non-ASCII or apex or space] character
      .replace(/[^A-Z ']/g, '')
      // remove double spaces
      .replace(/\s\s/gi, '')
      // remove apex followed by double spaces
      .replace(/'(?=\w)/gi, '')
      // remove typo such as 'N I C O L A'
      name = name[1] === ' ' ? name.replace(/\s(?=\w)/gi, '') : name
      // empty or one chart check (it needs to be repeated)
      if (name.length < 2) { return }
      // freq
      let freq = parseInt(entity.count)
      // add to rank
      nameObj[gender][name] = (nameObj[gender][name] || 0) + freq
    })
  }
})

// sort name list
GENDER_LIST.forEach(GENDER => {
  // nameList.push(...Object.keys(nameObj[GENDER]))
  nameList = nameList.concat(Object.keys(nameObj[GENDER]))
})
nameList.sort()

// find duplicates (names present in both gender)
let didMatch = false
for (let i = 0; i < nameList.length - 1; i += 1) {
  let name = nameList[i]
  let nextName = nameList[i + 1]
  if (name === 'ANDREA') { continue }
  if (name === nextName) {
    if (!didMatch) {
      duplicateName.push(name)
      didMatch = true
    } 
  } else {
    didMatch = false
  }
}

// loop duplicates
duplicateName.forEach(name => {
  let freqM = nameObj.M[name]
  let freqF = nameObj.F[name]

  if (freqM === freqF) {
    // delete from both gender (it's not possible to distinguish the gender)
    delete nameObj.M[name]
    delete nameObj.F[name]

  // assign the name to the gender with the highest frequency and sum the other
  } else if (freqM > freqF) {
    nameObj.M[name] = freqM + freqF
    delete nameObj.F[name]
  
  } else if (freqF > freqM) {
    nameObj.F[name] = freqF + freqM
    delete nameObj.M[name]
  }
})

// loop rank by gender
GENDER_LIST.forEach(GENDER => {
  // create array of objects
  let objArrByGender = Object.keys(nameObj[GENDER]).map(name => {
    return {
      frequency: nameObj[GENDER][name],
      name
    }
  })
  // sort by freq DESC
  let objArrByGenderSortFreqDESC = objArrByGender.sort((a, b) => a.frequency - b.frequency).slice().reverse()
  // compute by freq DESC
  nameObj[GENDER] = {}
  objArrByGenderSortFreqDESC.forEach(entity => {
    key = CodiceFiscale.nameCode(entity.name)
    nameObj[GENDER][key] = nameObj[GENDER][key] || []
    nameObj[GENDER][key].push(entity)
  })
})

// write sorted/computed ranks as JSON
try {
  fs.writeFileSync(`./json/name_list_sort_freq_DESC_computed.json`, JSON.stringify(nameObj), CHARSET)
  // check for error
} catch (e) {
  console.log(e)
  process.exit(1)
  return
}

// farewell
console.log('Farewell')
process.exit(0)

})()