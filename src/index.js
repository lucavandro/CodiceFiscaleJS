import {
  MONTH_CODES,
  CHECK_CODE_ODD,
  CHECK_CODE_EVEN,
  OMOCODIA_TABLE,
  CHECK_CODE_CHARS,
  CODICI_CATASTALI
} from './constants'

import deburr from 'lodash.deburr'

class CodiceFiscale {
  static compute (codiceFiscaleObject) {
    let code = this.surnameCode(codiceFiscaleObject.surname)
    code += this.nameCode(codiceFiscaleObject.name)
    code += this.dateCode(codiceFiscaleObject.day, codiceFiscaleObject.month, codiceFiscaleObject.year, codiceFiscaleObject.gender)
    code += this.findComuneCode(codiceFiscaleObject.birthplace, codiceFiscaleObject.birthplaceProvincia)
    code += this.getCheckCode(code)

    return code
  }

  static check (codiceFiscale) {
    if (typeof codiceFiscale !== 'string') return false
    codiceFiscale = codiceFiscale.toUpperCase()
    if (codiceFiscale.length !== 16) return false
    var expectedCheckCode = codiceFiscale.charAt(15)
    var cf = codiceFiscale.slice(0, 15)

    return CodiceFiscale.getCheckCode(cf) === expectedCheckCode
  }

  static estraiConsonanti (str) {
    return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '')
  }

  static getCheckCode (codiceFiscale) {
    let val = 0
    for (let i = 0; i < 15; i++) {
      const c = codiceFiscale[i]
      val += i % 2 ? this.CHECK_CODE_EVEN[c] : this.CHECK_CODE_ODD[c]
    }
    val = val % 26
    return this.CHECK_CODE_CHARS.charAt(val)
  }

  static estraiVocali (str) {
    return str.replace(/[^AEIOU]/gi, '')
  }

  static surnameCode (surname) {
    let codeSurname = this.estraiConsonanti(surname) + this.estraiVocali(surname) + 'XXX'
    return codeSurname.substr(0, 3).toUpperCase()
  }

  static nameCode (name) {
    let codNome = this.estraiConsonanti(name)
    if (codNome.length >= 4) {
      codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3)
    } else {
      codNome += this.estraiVocali(name) + 'XXX'
      codNome = codNome.substr(0, 3)
    }
    return codNome.toUpperCase()
  }

  static dateCode (gg, mm, aa, gender) {
    const date = new Date()
    date.setYear(aa)
    date.setMonth(mm - 1)
    date.setDate(gg)
    // Padding year
    let year = '0' + date.getFullYear()
    year = year.substr(year.length - 2, 2)

    let month = this.MONTH_CODES[date.getMonth()]
    let day = date.getDate()
    if (gender.toUpperCase() === 'F') day += 40

    // Padding day
    day = '0' + day
    day = day.substr(day.length - 2, 2)
    return String(year + month + day)
  }

  static findComuneCode (birthplace, birthplaceProvincia) {
    if (!this.CODICI_CATASTALI[birthplaceProvincia]) {
      throw new Error('Provincia not found')
    }
    const comune = this.CODICI_CATASTALI[birthplaceProvincia]
      .find(comune => {
        return this.normalizeString(comune[0]) === this.normalizeString(birthplace)
      })
    if (comune === undefined) {
      throw new Error('Comune not found')
    }
    return comune[1]
  }

  static normalizeString (str) {
    return deburr(str)
      .trim()
      .toUpperCase()
      .replace(/('|\s)/ig, '')
  }

  static getOmocodie (code) {
    var results = []
    var lastOmocode = (code = code.slice(0, 15))
    for (var i = code.length - 1; i >= 0; i--) {
      var char = code[i]
      if (char.match(/\d/)) {
        lastOmocode =
          lastOmocode.substr(0, i) +
          this.OMOCODIA_TABLE[char] +
          lastOmocode.substr(i + 1)
        results.push(lastOmocode + this.getCheckCode(lastOmocode))
      }
    }
    return results
  }

  static computeInverse (codiceFiscale) {
    var isValid = this.check(codiceFiscale)

    if (isValid) {
      codiceFiscale = codiceFiscale.toUpperCase()
    } else {
      throw new Error(
        'Provided input is not a valid Codice Fiscale'
      )
    }

    var name = codiceFiscale.substr(3, 3)
    var surname = codiceFiscale.substr(0, 3)

    var year = codiceFiscale.substr(6, 2)
    var yearList = []
    var year19XX = parseInt('19' + year)
    var year20XX = parseInt('20' + year)
    var currentYear20XX = new Date().getFullYear()
    yearList.push(year19XX)
    if (currentYear20XX - year20XX >= 0) {
      yearList.push(year20XX)
    }

    var monthChar = codiceFiscale.substr(8, 1)
    var month = MONTH_CODES.indexOf(monthChar) + 1

    var gender = 'M'
    var day = parseInt(codiceFiscale.substr(9, 2))
    if (day > 31) {
      gender = 'F'
      day = day - 40
    }

    var birthplace = ''
    var birthplaceProvincia = ''
    for (var province in this.CODICI_CATASTALI) {
      birthplace = this.CODICI_CATASTALI[province].find(function (code) {
        return code[1] === codiceFiscale.substr(11, 4)
      })
      if (birthplace) {
        birthplace = birthplace[0]
        birthplaceProvincia = province
        break
      }
    }

    return {
      name,
      surname,
      gender,
      day,
      month,
      year,
      birthplace,
      birthplaceProvincia
    }
  }
}

CodiceFiscale.MONTH_CODES = MONTH_CODES
CodiceFiscale.CHECK_CODE_ODD = CHECK_CODE_ODD
CodiceFiscale.CHECK_CODE_EVEN = CHECK_CODE_EVEN
CodiceFiscale.OMOCODIA_TABLE = OMOCODIA_TABLE
CodiceFiscale.CHECK_CODE_CHARS = CHECK_CODE_CHARS
CodiceFiscale.CODICI_CATASTALI = CODICI_CATASTALI

module.exports = CodiceFiscale
