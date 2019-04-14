import CodiceFiscale from '../src/codice-fiscale.js';
import { exists } from 'fs';

let { describe, test, expect } = global

describe('Codice Fiscale', () => {
  test('esiste un oggetto chiamato CodiceFiscale', () => {
    expect(CodiceFiscale).toBeDefined()
  })
})

describe('CodiceFiscale.surnameCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.surnameCode).toBeDefined()
  })

  test('restituisce il corretto risultato in caso di sufficienti consonanti', () => {
    expect(CodiceFiscale.surnameCode('Moreno')).toBe('MRN')
  })

  test('restituisce il corretto risultato in caso di insufficienti consonanti', () => {
    expect(CodiceFiscale.surnameCode('Julea')).toBe('JLU')
  })
})

describe('CodiceFiscale.nameCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.nameCode).toBeDefined()
  })

  test('restituisce il corretto risultato in caso di sufficienti consonanti', () => {
    expect(CodiceFiscale.nameCode('Marco')).toBe('MRC')
  })

  test('restituisce il corretto risultato in caso di insufficienti consonanti', () => {
    expect(CodiceFiscale.nameCode('Luca')).toBe('LCU')
  })
})

describe('CodiceFiscale.dateCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.dateCode).toBeDefined()
  })

  test('restituisce il corretto risultato', () => {
    expect(CodiceFiscale.dateCode(1, 1, 2000, 'M')).toBe('00A01')
  })
})

describe('CodiceFiscale.getCheckCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.getCheckCode).toBeDefined()
  })

  test('restituisce il corretto risultato', () => {
    expect(CodiceFiscale.getCheckCode('MRNLCU00A01H501')).toBe('J')
  })
})

describe('CodiceFiscale.compute', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.compute).toBeDefined()
  })

  test('calcola il codice fiscale', () => {
    expect(CodiceFiscale.compute({
      name: 'Luca',
      surname: 'Moreno',
      gender: 'M',
      day: 1,
      month: 1,
      year: 2000,
      birthplace: 'Roma',
      birthplaceProvincia: 'RM'
    }))
      .toBe('MRNLCU00A01H501J')
  })

  test("calcola il codice fiscale di persone nate all'estero", () => {
    expect(CodiceFiscale.compute({
      name: 'Luca',
      surname: 'Moreno',
      gender: 'M',
      day: 1,
      month: 1,
      year: 2000,
      birthplace: 'Albania',
      birthplaceProvincia: 'EE'
    }))
      .toBe('MRNLCU00A01Z100P')
  })

  test('se il comune non esiste lancia un eccezione', () => {
    var comuneInventato = function () {
      CodiceFiscale.compute({
        name: 'Luca',
        surname: 'Moreno',
        gender: 'M',
        day: 1,
        month: 1,
        year: 2000,
        birthplace: 'Foo',
        birthplaceProvincia: 'EE'
      })
    }
    expect(comuneInventato).toThrowError('Comune with name of Foo and prov EE doesn\'t exists')
  })
})

describe('CodiceFiscale.findLocationCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.findLocationCode).toBeDefined()
  })

  test('trova il codice del comune', () => {
    expect(CodiceFiscale.findLocationCode('Roma', 'RM')).toBe('H501')
  })

  test('trova il codice di un comune che contiene apostrofi', () => {
    expect(CodiceFiscale.findLocationCode("Sant'Angelo Romano", 'RM')).toBe('I284')
  })

  test('trova il codice di un comune che contiene lettere accentate', () => {
    expect(CodiceFiscale.findLocationCode('Riccò del Golfo di Spezia', 'SP')).toBe('H275')
  })

  test('se la provincia non esiste lancia un eccezione', () => {
    var comuneInventato = function () {
      CodiceFiscale.findLocationCode('Foo', 'Bar')
    }
    expect(comuneInventato).toThrowError('Comune with name of Foo and prov Bar doesn\'t exists')
  })

  test('se il comune non esiste lancia un eccezione', () => {
    var comuneInventato = function () {
      CodiceFiscale.findLocationCode('Foo', 'RM')
    }
    expect(comuneInventato).toThrowError('Comune with name of Foo and prov RM doesn\'t exists')
  })
})

describe('CodiceFiscale.check', () => {
  test('è definito', () => {
    expect(CodiceFiscale.check).toBeDefined()
  })

  test('controlla se il codice fiscale è valido', () => {
    expect(CodiceFiscale.check('MRNLCU00A01H501J')).toBe(true)
  })

  test('controlla che sia composto dal non più 16 valori alfanumerici', () => {
    expect(CodiceFiscale.check('MRNLCU00A01H501JK')).toBe(false)
  })

  test('controlla che sia composto dal almeno 16 valori alfanumerici', () => {
    expect(CodiceFiscale.check('MRNLCU00A01H501J3')).toBe(false)
  })

  test('controlla che il carattere di controllo sia esatto', () => {
    expect(CodiceFiscale.check('VNDLDL87D07B963G')).toBe(false)
  })

  test('funziona anche in caso di omocodie', () => {
    expect(CodiceFiscale.check('BNZVCN32S10E57PV')).toBe(true)
    expect(CodiceFiscale.check('BNZVCNPNSMLERTPX')).toBe(true)
  })
})

describe('CodiceFiscale.getOmocodie', () => {
  test('è definito', () => {
    expect(CodiceFiscale.getOmocodie).toBeDefined()
  })

  test('calcola le omocodie dato un codice fiscale', () => {
    expect(CodiceFiscale.getOmocodie('BNZVCN32S10E573Z'))
     .toEqual(expect.arrayContaining(['BNZVCN32S10E57PV', 'BNZVCNPNSMLERTPX']))
  })
})

describe('Calcolo codice fiscale inverso -> metodo .computeInverse', () => {
  test('è definito', () => {
    expect(CodiceFiscale.computeInverse).toBeDefined()
  })

  test("se l'input non è una stringa lancia un eccezione", () => {
    var notAString = function () {
      CodiceFiscale.computeInverse(0)
    }
    expect(notAString).toThrowError("Comune constructor accept either a valid string or a plain object. Check the documentation")
  })

  test("restituisce falso se l'input è stringa formattata male", () => {
    var notValid = function () {
      CodiceFiscale.computeInverse('BNZVCN32SC0E573Z')
    }
    expect(notValid).toThrowError("Provided input is not a valid Codice Fiscale")
  })

  
  /*  Nome: MARIO
   *  Cognome: ROSSI
   *  Nato a : ROMA (RM)
   *  Giorno : 23
   *  Mese   : Giugno (6)
   *  Anno   : 1980
   *  Sesso  : M
   */
  let mario_rossi_cf =  "RSSMRA80H23H501T";

  test('restituisce il genere corretto', () => {
    expect(CodiceFiscale.computeInverse(mario_rossi_cf).gender).toEqual('M')
  })

  test('restituisce la città natale corretta', () => {
    expect(CodiceFiscale.computeInverse(mario_rossi_cf).birthplace).toEqual('ROMA')
  })

  test('restituisce la provincia della città natale corretta', () => {
    expect(CodiceFiscale.computeInverse(mario_rossi_cf).birthplaceProvincia).toEqual('RM')
  })

  test('restituisce il giorno di nascita come numero compreso tra 1 e 31', () => {
    let day = CodiceFiscale.computeInverse(mario_rossi_cf).day
    expect(day >= 1 && day <= 31).toBe(true)
  })

  test('restituisce il giorno corretto', () => {
    expect(CodiceFiscale.computeInverse(mario_rossi_cf).day).toBe(23)
  })

  test('restituisce il mese corretto', () => {
    expect(CodiceFiscale.computeInverse(mario_rossi_cf).month).toBe(6);
  })

  test('restituisce anno corretto', () => {
    expect(CodiceFiscale.computeInverse(mario_rossi_cf).year).toBe(1980);
  })


})


describe('Calcolo codice fiscale inverso -> metodo .computeInverse per le donne', () => {
  test('è definito', () => {
    expect(CodiceFiscale.computeInverse).toBeDefined()
  })

  test("se l'input non è una stringa lancia un eccezione", () => {
    var notAString = function () {
      CodiceFiscale.computeInverse(0)
    }
    expect(notAString).toThrowError("Comune constructor accept either a valid string or a plain object. Check the documentation")
  })

  test("restituisce falso se l'input è stringa formattata male", () => {
    var notValid = function () {
      CodiceFiscale.computeInverse('BNZVCN32SC0E573Z')
    }
    expect(notValid).toThrowError("Provided input is not a valid Codice Fiscale")
  })

  
  /*  Nome: MARIA
   *  Cognome: ROSSI
   *  Nato a : ROMA (RM)
   *  Giorno : 23
   *  Mese   : Giugno (6)
   *  Anno   : 1980
   *  Sesso  : F
   */
  let maria_rossi_cf =  "RSSMRA80H63H501X";

  test('restituisce il genere corretto', () => {
    expect(CodiceFiscale.computeInverse(maria_rossi_cf).gender).toEqual('F')
  })

  test('restituisce la città natale corretta', () => {
    expect(CodiceFiscale.computeInverse(maria_rossi_cf).birthplace).toEqual('ROMA')
  })

  test('restituisce la provincia della città natale corretta', () => {
    expect(CodiceFiscale.computeInverse(maria_rossi_cf).birthplaceProvincia).toEqual('RM')
  })

  test('restituisce il giorno di nascita come numero compreso tra 1 e 31', () => {
    let day = CodiceFiscale.computeInverse(maria_rossi_cf).day
    expect(day >= 1 && day <= 31).toBe(true)
  })

  test('restituisce il giorno corretto', () => {
    expect(CodiceFiscale.computeInverse(maria_rossi_cf).day).toBe(23)
  })

  test('restituisce il mese corretto', () => {
    expect(CodiceFiscale.computeInverse(maria_rossi_cf).month).toBe(6);
  })

  test('restituisce anno corretto', () => {
    expect(CodiceFiscale.computeInverse(maria_rossi_cf).year).toBe(1980);
  })

  test('la data corretta', () => {
    expect(CodiceFiscale.computeInverse(maria_rossi_cf).birthday).toBe("1980-06-23");
  })


})
