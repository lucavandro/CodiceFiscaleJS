import CodiceFiscale from '../src/index'
let { describe, test, expect } = global

describe('Codice Fiscale', () => {
  test('esiste un oggetto chiamato CodiceFiscale', () => {
    expect(CodiceFiscale).not.toBe(undefined)
  })
})

describe('CodiceFiscale.surnameCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.surnameCode).not.toBe(undefined)
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
    expect(CodiceFiscale.nameCode).not.toBe(undefined)
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
    expect(CodiceFiscale.dateCode).not.toBe(undefined)
  })

  test('restituisce il corretto risultato', () => {
    expect(CodiceFiscale.dateCode(1, 1, 2000, 'M')).toBe('00A01')
  })
})

describe('CodiceFiscale.getCheckCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.getCheckCode).not.toBe(undefined)
  })

  test('restituisce il corretto risultato', () => {
    expect(CodiceFiscale.getCheckCode('MRNLCU00A01H501')).toBe('J')
  })
})

describe('CodiceFiscale.compute', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.compute).not.toBe(undefined)
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
    expect(comuneInventato).toThrowError('Comune not found')
  })
})

describe('CodiceFiscale.findComuneCode', () => {
  test('è  definito', () => {
    expect(CodiceFiscale.findComuneCode).not.toBe(undefined)
  })

  test('trova il codice del comune', () => {
    expect(CodiceFiscale.findComuneCode('Roma', 'RM')).toBe('H501')
  })

  test('se il comune non esiste lancia un eccezione', () => {
    var comuneInventato = function () {
      CodiceFiscale.findComuneCode('Pufflandia', 'RM')
    }
    expect(comuneInventato).toThrowError('Comune not found')
  })
})

describe('CodiceFiscale.check', () => {
  test('è definito', () => {
    expect(CodiceFiscale.check).not.toBe(undefined)
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
    expect(CodiceFiscale.getOmocodie).not.toBe(undefined)
  })

  test('calcola le omocodie dato un codice fiscale', () => {
    expect(CodiceFiscale.getOmocodie('BNZVCN32S10E573Z'))
     .toEqual(expect.arrayContaining(['BNZVCN32S10E57PV', 'BNZVCNPNSMLERTPX']))
  })
})

describe('Calcolo codice fiscale inverso -> metodo .computeInverse', () => {
  test('è definito', () => {
    expect(CodiceFiscale.computeInverse).not.toBe(undefined)
  })

  test("se l'input non è una stringa lancia un eccezione", () => {
    var notAString = function () {
      CodiceFiscale.computeInverse(0)
    }
    expect(notAString).toThrowError('Provided input is not a valid Codice Fiscale')
  })

  test("restituisce falso se l'input è stringa formattata male", () => {
    var notValid = function () {
      CodiceFiscale.computeInverse('BNZVCN32SC0E573Z')
    }
    expect(notValid).toThrowError('Provided input is not a valid Codice Fiscale')
  })

  test('restituisce il genere corretto', () => {
    expect(CodiceFiscale.computeInverse('MRNLCU00A01H501J').gender).toEqual('M')
  })

  test('restituisce la città natale corretta', () => {
    expect(CodiceFiscale.computeInverse('MRNLCU00A01H501J').birthplace).toEqual('ROMA')
  })

  test('restituisce la provincia della città natale corretta', () => {
    expect(CodiceFiscale.computeInverse('MRNLCU00A01H501J').birthplaceProvincia).toEqual('RM')
  })

  test('restituisce il giorno di nascita come numero compreso tra 1 e 31', () => {
    expect(CodiceFiscale.computeInverse('MRNLCU00A01H501J').day >= 1 && CodiceFiscale.computeInverse('MRNLCU00A01H501J').day <= 31).toBe(true)
  })
})
