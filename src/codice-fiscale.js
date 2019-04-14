import { Comune } from './comune'
import { CHECK_CODE_CHARS, CHECK_CODE_EVEN, CHECK_CODE_ODD, MONTH_CODES, OMOCODIA_TABLE } from './constants'
import { extractConsonants, extractVowels, getValidDate, birthplaceFields } from './utils'

class CodiceFiscale {
  get day () {
    return this.birthday.getDate()
  }
  set day (d) {
    this.birthday.setDate(d)
  }
  get month () {
    return this.birthday.getMonth() + 1
  }
  set month (m) {
    this.birthday.setMonth(m - 1)
  }
  get year () {
    return this.birthday.getFullYear()
  }
  set year (y) {
    this.birthday.setFullYear(y)
  }
  get cf () {
    return this.code
  }
  get nameCode () {
    return this.code.substr(3, 3)
  }
  get surnameCode () {
    return this.code.substr(0, 3)
  }
  get checkCode () {
    return this.code.substr(15, 1)
  }
  constructor (data) {
    if (typeof data === 'string') {
      if (CodiceFiscale.check(data)) {
        this.code = data
        this.reverse()
      } else {
        throw new Error('Provided input is not a valid Codice Fiscale')
      }
    } else if (typeof data === 'object') {
      const cfData = data
      this.name = cfData.name
      this.surname = cfData.surname
      this.gender = this.checkGender(cfData.gender)
      this.birthday = cfData.birthday ? getValidDate(cfData.birthday) : getValidDate(cfData.day, cfData.month, cfData.year)
      this.birthplace = new Comune(cfData.birthplace, cfData.birthplaceProvincia)
      this.compute()
    } else {
      throw new Error('Comune constructor accept either a valid string or a plain object. Check the documentation')
    }
  }
  static getCheckCode (codiceFiscale) {
    let val = 0
    for (let i = 0; i < 15; i = i + 1) {
      const c = codiceFiscale[i]
      val += i % 2 !== 0 ? CHECK_CODE_EVEN[c] : CHECK_CODE_ODD[c]
    }
    val = val % 26
    return CHECK_CODE_CHARS.charAt(val)
  }
  static findLocationCode (name, prov) {
    return new Comune(name, prov).cc
  }
  static computeInverse (codiceFiscale) {
    return new CodiceFiscale(codiceFiscale).toJSON()
  }
  static compute (obj) {
    return new CodiceFiscale(obj).toString()
  }
  static check (codiceFiscale) {
    if (typeof codiceFiscale !== 'string') {
      return false
    }
    let cf = codiceFiscale.toUpperCase()
    if (cf.length !== 16) {
      return false
    }
    const expectedCheckCode = codiceFiscale.charAt(15)
    cf = codiceFiscale.slice(0, 15)
    return CodiceFiscale.getCheckCode(cf) === expectedCheckCode
  }
  static getOmocodie (cf) {
    return new CodiceFiscale(cf).omocodie()
  }
  static surnameCode(surname){
      const codeSurname = `${extractConsonants(surname)}${extractVowels(surname)}XXX`
      return codeSurname.substr(0, 3).toUpperCase()
  }
  static nameCode(name){
    let codNome = extractConsonants(name)
    if (codNome.length >= 4) {
      codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3)
    } else {
      codNome += `${extractVowels(name)}XXX`
      codNome = codNome.substr(0, 3)
    }
    return codNome.toUpperCase()
  }
  static dateCode(day, month, year, gender){
    year = `0${year}`
    year = year.substr(year.length - 2, 2)
    month = MONTH_CODES[month-1];
    if (gender.toUpperCase() === 'F') {
      day += 40
    }
    day = `0${day}`
    day = day.substr(day.length - 2, 2)
    return `${year}${month}${day}`
  }
  toString () {
    return this.code
  }
  toJSON () {
  
    return {
      name: this.name,
      surname: this.surname,
      gender: this.gender,
      day : this.birthday.getDate(),
      year: this.birthday.getFullYear(),
      month: this.birthday.getMonth()+1, 
      birthday: this.birthday.toISOString().slice(0,10),
      birthplace: this.birthplace.nome,
      birthplaceProvincia: this.birthplace.prov,
      cf: this.code
    }
  }
  isValid () {
    if (typeof this.code !== 'string') {
      return false
    }
    this.code = this.code.toUpperCase()
    if (this.code.length !== 16) {
      return false
    }
    const expectedCheckCode = this.code.charAt(15)
    const cf = this.code.slice(0, 15)
    return CodiceFiscale.getCheckCode(cf) === expectedCheckCode
  }
  omocodie () {
    const results = []
    let lastOmocode = (this.code = this.code.slice(0, 15))
    for (let i = this.code.length - 1; i >= 0; i = i - 1) {
      const char = this.code[i]
      if (char.match(/\d/) !== null) {
        lastOmocode = `${lastOmocode.substr(0, i)}${OMOCODIA_TABLE[char]}${lastOmocode.substr(i + 1)}`
        results.push(lastOmocode + CodiceFiscale.getCheckCode(lastOmocode))
      }
    }
    return results
  }
  compute () {
    let code = this.getSurnameCode()
    code += this.getNameCode()
    code += this.dateCode()
    code += this.birthplace.cc
    code += CodiceFiscale.getCheckCode(code)
    this.code = code
  }
  reverse () {
    this.name = this.code.substr(3, 3)
    this.surname = this.code.substr(0, 3)

    const yearCode = this.code.substr(6, 2)
    const year19XX = parseInt(`19${yearCode}`, 10)
    const year20XX = parseInt(`20${yearCode}`, 10)
    const currentYear20XX = new Date().getFullYear()
    const year = year20XX > currentYear20XX ? year19XX : year20XX
    const monthChar = this.code.substr(8, 1)
    const month = MONTH_CODES.indexOf(monthChar)
    this.gender = 'M'
    let day = parseInt(this.code.substr(9, 2), 10)
    if (day > 31) {
      this.gender = 'F'
      day = day - 40
    }
    this.birthday = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
    const cc = this.code.substr(11, 4)
    this.birthplace = Comune.GetByCC(cc)
    return this.toJSON()
  }
  checkGender (gender) {
    this.gender = gender !== undefined ? gender.toUpperCase() : this.gender.toUpperCase()
    if (typeof this.gender !== 'string') {
      throw new Error('Gender must be a string')
    }
    if (this.gender !== 'M' && this.gender !== 'F') {
      throw new Error('Gender must be either \'M\' or \'F\'')
    }
    return gender
  }
  getSurnameCode () {
    return CodiceFiscale.surnameCode(this.surname);
  }
  getNameCode () {
    return CodiceFiscale.nameCode(this.name);
  }
  dateCode () {
    return CodiceFiscale.dateCode(this.birthday.getDate(), this.birthday.getMonth() + 1, this.birthday.getFullYear(), this.gender);
  }
}

CodiceFiscale.utils = {
  birthplaceFields: birthplaceFields
}

module.exports = CodiceFiscale
