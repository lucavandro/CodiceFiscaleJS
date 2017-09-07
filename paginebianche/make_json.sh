#!/usr/bin/env node

(() => {

// dependencies
const fs = require('fs')
const CodiceFiscale = require('../src/codice.fiscale.js')

// helpers
const CHARSET = 'utf8'

// create ranks
const nameObj = {}
const surnameObj = {}
const ranks = [nameObj, surnameObj]

// loop alphabet
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
  // set path
  const FILE = `./name_surname_lists/${letter}_OK.txt`
  // read file
  let STR = '';
  try {
    STR = fs.readFileSync(FILE, CHARSET)
  // check for error
  } catch (e) {
    console.log(e)
    process.exit(1)
    return
  }
  // check for size
  if (STR.length === 0) {
    console.log(`WARNING -> ${FILE} is empty! (FYI: at the time of writing 'Y' has no entry)`)
    return
  } // end: if error
  // split file into lines
  let lineArr = STR.split('\n')
  // loop lines
  for (let i = 0; i < lineArr.length; i += 1) {
    // find main line
    if (lineArr[i].includes('il nome')) {
      // temp save person data
      let freq = parseInt( lineArr[i].match(/\d+/gi)[0] )
      let name = lineArr[i + 1].replace('\t', '').toUpperCase()
      let surname = lineArr[i + 3].replace('\t', '').replace('.</p>', '').replace(`D `, `D'`).toUpperCase()
      // populate ranks
      nameObj[name] = (nameObj[name] || 0) + freq
      surnameObj[surname] = (surnameObj[surname] || 0) + freq
      // jump to next block 
      i += 3
    }
  } // end: for lineArr
}) // end: forEach alphabet

// loop ranks
ranks.forEach((obj, i) => {
  // set type
  let type = i === 0 ? 'name' : 'surname'
  // create array of objects
  let objArr = Object.keys(obj).map(name => {
    let entry = { frequency: obj[name] }
    entry[type] = name
    return entry
  })
  // sort by name/surname ASC
  let objArrSortNameASC = objArr.sort((a, b) => {
    let nameA = a[type].toUpperCase()
    let nameB = b[type].toUpperCase()
    if (nameA < nameB) { return -1 }
    if (nameA > nameB) { return  1 }
    return 0
  }).slice()
  // sort by name/surname DESC
  let objArrSortNameDESC = objArrSortNameASC.slice().reverse()
  // sort by freq ASC
  let objArrSortFreqASC = objArr.sort((a, b) => a.frequency - b.frequency).slice()
  // sort by freq DESC
  let objArrSortFreqDESC = objArrSortFreqASC.slice().reverse()
  // compute by freq DESC
  let objArrSortFreqDESC_computed = {}
  objArrSortFreqDESC.forEach(entry => {
    key = type === 'name' ? CodiceFiscale.nameCode(entry[type]) : CodiceFiscale.surnameCode(entry[type])
    objArrSortFreqDESC_computed[key] = objArrSortFreqDESC_computed[key] || []
    objArrSortFreqDESC_computed[key].push(entry)
  })
  // write sorted/computed ranks as JSON
  try {
    fs.writeFileSync(`./json/${type}_list_sort_alph_ASC.json`,           JSON.stringify( objArrSortNameASC  ),          CHARSET)
    fs.writeFileSync(`./json/${type}_list_sort_alph_DESC.json`,          JSON.stringify( objArrSortNameDESC ),          CHARSET)
    fs.writeFileSync(`./json/${type}_list_sort_freq_ASC.json`,           JSON.stringify( objArrSortFreqASC  ),          CHARSET)
    fs.writeFileSync(`./json/${type}_list_sort_freq_DESC.json`,          JSON.stringify( objArrSortFreqDESC ),          CHARSET)
    fs.writeFileSync(`./json/${type}_list_sort_freq_DESC_computed.json`, JSON.stringify( objArrSortFreqDESC_computed ), CHARSET)
  // check for error
  } catch (e) {
    console.log(e)
    process.exit(1)
    return
  }
}) // end: forEach ranks

// farewell
console.log('Farewell')
process.exit(0)

})()