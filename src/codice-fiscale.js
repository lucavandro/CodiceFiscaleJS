import { Comune } from './comune'
import { CHECK_CODE_CHARS, CHECK_CODE_EVEN, CHECK_CODE_ODD, MONTH_CODES, NUMERIC_POS, OMOCODIA_TABLE, OMOCODIA_TABLE_INVERSE } from './constants'
import { extractConsonants, extractVowels, getValidDate, birthplaceFields, getAllSubsets } from './utils'
import { getComuni, getProvince } from './geo-data'

const CF_REGEX = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1}$/

class CodiceFiscale {
  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  constructor (data) {
    if (typeof data === 'string') {
      data = data.toUpperCase()
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
      throw new Error('CodiceFiscale constructor accept either a valid string or a plain object. Check the documentation')
    }
  }

  // ==========================================
  // GETTERS & SETTERS
  // ==========================================
  get day () {
    return this.birthday.getUTCDate()
  }

  set day (d) {
    this.birthday.setUTCDate(d)
  }

  get month () {
    return this.birthday.getUTCMonth() + 1
  }

  set month (m) {
    this.birthday.setUTCMonth(m - 1)
  }

  get year () {
    return this.birthday.getUTCFullYear()
  }

  set year (y) {
    this.birthday.setUTCFullYear(y)
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

  // ==========================================
  // PUBLIC INSTANCE METHODS
  // ==========================================
  compute () {
    let code = this.getSurnameCode()
    code += this.getNameCode()
    code += this.dateCode()
    code += this.birthplace.cc
    code += CodiceFiscale.getCheckCode(code)
    this.code = code
  }

  reverse () {
    const code = CodiceFiscale.isOmocodia(this.code) ? CodiceFiscale.fromOmocodiaToOriginal(this.code) : this.code
    this.name = code.substr(3, 3)
    this.surname = code.substr(0, 3)

    const yearCode = code.substr(6, 2)
    const year19XX = parseInt(`19${yearCode}`, 10)
    const year20XX = parseInt(`20${yearCode}`, 10)
    const currentYear20XX = new Date().getFullYear()
    const year = year20XX > currentYear20XX ? year19XX : year20XX
    const monthChar = code.substr(8, 1)
    const month = MONTH_CODES.indexOf(monthChar)

    this.gender = 'M'
    const dayString = code.substr(9, 2)
    let day = parseInt(dayString, 10)
    if (day > 31) {
      this.gender = 'F'
      day = day - 40
    }
    this.birthday = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
    const cc = code.substr(11, 4)
    this.birthplace = Comune.GetByCC(cc)

    return this.toJSON()
  }

  isValid () {
    return CodiceFiscale.check(this.code)
  }

  omocodie () {
    const results = []
    const code = (this.code.slice(0, 15))
    const allSubsets = getAllSubsets(NUMERIC_POS)
    for (const subset of allSubsets) {
      let omocode = code
      for (const position of subset) {
        const char = code[position]
        omocode = `${omocode.substr(0, position)}${OMOCODIA_TABLE[char]}${omocode.substr(position + 1)}`
      }
      if (subset.length > 0) {
        results.push(omocode + CodiceFiscale.getCheckCode(omocode))
      }
    }

    return results
  }

  toJSON () {
    return {
      name: this.name,
      surname: this.surname,
      gender: this.gender,
      day: this.birthday.getUTCDate(),
      year: this.birthday.getUTCFullYear(),
      month: this.birthday.getUTCMonth() + 1,
      birthday: this.birthday.toISOString().slice(0, 10),
      birthplace: this.birthplace.nome,
      birthplaceProvincia: this.birthplace.prov,
      cf: this.code
    }
  }

  toString () {
    return this.code
  }

  // ==========================================
  // PRIVATE INSTANCE METHODS (Helpers)
  // ==========================================
  checkGender (gender) {
    let resolvedGender = gender
    if (resolvedGender === undefined && this.gender !== undefined) {
      resolvedGender = this.gender
    }

    if (typeof resolvedGender !== 'string') {
      throw new Error('Gender must be a string')
    }

    resolvedGender = resolvedGender.toUpperCase()

    if (resolvedGender !== 'M' && resolvedGender !== 'F') {
      throw new Error('Gender must be either \'M\' or \'F\'')
    }

    this.gender = resolvedGender
    return resolvedGender
  }

  getSurnameCode () {
    return CodiceFiscale.surnameCode(this.surname)
  }

  getNameCode () {
    return CodiceFiscale.nameCode(this.name)
  }

  dateCode () {
    return CodiceFiscale.dateCode(this.birthday.getUTCDate(), this.birthday.getUTCMonth() + 1, this.birthday.getUTCFullYear(), this.gender)
  }

  // ==========================================
  // STATIC METHODS
  // ==========================================
  static check (codiceFiscale) {
    if (typeof codiceFiscale !== 'string') {
      return false
    }
    let cf = codiceFiscale.toUpperCase()
    if (cf.length !== 16) {
      return false
    }
    if (!CF_REGEX.test(cf)) {
      return false
    }
    const expectedCheckCode = codiceFiscale.charAt(15)
    cf = codiceFiscale.slice(0, 15)
    return CodiceFiscale.getCheckCode(cf).toUpperCase() === expectedCheckCode.toUpperCase()
  }

  static getCheckCode (codiceFiscale) {
    codiceFiscale = codiceFiscale.toUpperCase()
    let val = 0
    for (let i = 0; i < 15; i = i + 1) {
      const c = codiceFiscale[i]
      val += i % 2 !== 0 ? CHECK_CODE_EVEN[c] : CHECK_CODE_ODD[c]
    }
    val = val % 26
    return CHECK_CODE_CHARS.charAt(val)
  }

  static isOmocodia (cf) {
    for (const pos of NUMERIC_POS) {
      const char = cf[pos]
      if (char < '0' || char > '9') return true
    }
    return false
  }

  static getOmocodie (cf) {
    return new CodiceFiscale(cf).omocodie()
  }

  static compute (obj) {
    return new CodiceFiscale(obj).toString()
  }

  static computeInverse (codiceFiscale) {
    return new CodiceFiscale(codiceFiscale).toJSON()
  }

  static reverse (codiceFiscale) {
    return new CodiceFiscale(codiceFiscale).toJSON()
  }

  static findLocationCode (name, prov) {
    return new Comune(name, prov).cc
  }

  // ==========================================
  // STATIC HELPER METHODS
  // ==========================================
  static surnameCode (surname) {
    const codeSurname = `${extractConsonants(surname)}${extractVowels(surname)}XXX`
    return codeSurname.substr(0, 3).toUpperCase()
  }

  static nameCode (name) {
    let codNome = extractConsonants(name)
    if (codNome.length >= 4) {
      codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3)
    } else {
      codNome += `${extractVowels(name)}XXX`
      codNome = codNome.substr(0, 3)
    }
    return codNome.toUpperCase()
  }

  static dateCode (day, month, year, gender) {
    year = `0${year}`
    year = year.substr(year.length - 2, 2)
    month = MONTH_CODES[month - 1]
    if (gender.toUpperCase() === 'F') {
      day += 40
    }
    day = `0${day}`
    day = day.substr(day.length - 2, 2)
    return `${year}${month}${day}`
  }

  static toNumberIfOmocodia (input) {
    if (isNaN(input)) {
      let res = ''
      const tokens = input.split('')
      for (let i = 0; i < tokens.length; i++) {
        const e = tokens[i]
        res += isNaN(e) ? OMOCODIA_TABLE_INVERSE[e] : e
      }
      return res
    }
    return input
  }

  static fromOmocodiaToOriginal (code) {
    code = code.substr(0, 15)
    for (const pos of NUMERIC_POS) {
      const char = code[pos]
      if (char.match(/[A-Z]/i)) {
        code = `${code.substr(0, pos)}${OMOCODIA_TABLE_INVERSE[char]}${code.substr(pos + 1)}`
      }
    }
    code = code + CodiceFiscale.getCheckCode(code)
    return code
  }
}

CodiceFiscale.utils = {
  birthplaceFields
}
CodiceFiscale.getComuni = getComuni
CodiceFiscale.getProvince = getProvince
module.exports = CodiceFiscale
