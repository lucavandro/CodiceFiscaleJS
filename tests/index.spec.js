import CodiceFiscale from '../src/codice-fiscale.js';

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

  test('controlla se un codice fiscale lowercase è valido', () => {
    expect(CodiceFiscale.check('MRNLCU00A01H501J'.toLowerCase())).toBe(true)
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

describe("Il metodo toString()", ()=>{
  test("funziona correttamente anche con le omocodie", ()=>{
    let cf = new CodiceFiscale({
      name: "Mario",
      surname: "Rossi",
      gender: "M",
      birthday: "1987-02-01",
      birthplace: "H501"
  });

    expect(cf.toString()).toBe("RSSMRA87B01H501A");
    cf.omocodie();
    expect(cf.toString()).toBe("RSSMRA87B01H501A");

  })
})

describe('CodiceFiscale.utils.COMUNI', () => {
  test('è definito', () => {
    expect(CodiceFiscale.utils.COMUNI).toBeDefined()
  })

  test('è un array con almeno un elemento', () => {
    expect(CodiceFiscale.utils.COMUNI.length).toBeGreaterThan(1)
  })
})
