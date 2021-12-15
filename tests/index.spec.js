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








describe('Calcolo codice fiscale inverso -> metodo .computeInverse per le donne', () => {
  test('è definito', () => {
    expect(CodiceFiscale.computeInverse).toBeDefined()
  })

  test("se l'input non è una stringa lancia un eccezione", () => {
    var notAString = function () {
      CodiceFiscale.computeInverse(0)
    }
    expect(notAString).toThrowError("CodiceFiscale constructor accept either a valid string or a plain object. Check the documentation")
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


describe('Calcolo del codice fiscale inverso',()=>{

  /*  Nome: MARIA
   *  Cognome: ROSSI
   *  Nato a : Acquacanina (MC)
   *  Giorno : 23
   *  Mese   : Giugno (6)
   *  Anno   : 1980
   *  Sesso  : F
   */
  // Acquacanina non è più un comune ma una frazione

  let maria_rossi_cf =  "RSSMRA80T63A031E";

  test('funziona con i comuni soppressi', () => {
    expect(CodiceFiscale.reverse(maria_rossi_cf).birthplace).toEqual('ACQUACANINA');
    expect(CodiceFiscale.reverse(maria_rossi_cf).birthplaceProvincia).toEqual('MC');
  })


   /*  Nome: MARIA
   *  Cognome: ROSSI
   *  Nato a : VIMERCATO (MI)
   *  Giorno : 23
   *  Mese   : Giugno (6)
   *  Anno   : 1980
   *  Sesso  : F
   */
  // Vimercate nel 1980 era in provincia di Milano, ora appartiene alla provincia di Monza e della Brianza (MB)

  let maria_rossi_cf2 =  "RSSMRA80T63M052X";
  test('funziona con i comuni che hanno cambiato provincia, restituendo la provincia a cui è assegnato attualmente il comune', () => {
    expect(CodiceFiscale.reverse(maria_rossi_cf2).birthplace).toEqual('VIMERCATE');
    expect(CodiceFiscale.reverse(maria_rossi_cf2).birthplaceProvincia).toEqual('MB');
  });


  describe('non rileva anomalie con il comune di Calendasco',()=>{

    test('calcola il codice fiscale', () => {
      expect(CodiceFiscale.compute({
        name: 'Mario',
        surname: 'Rossi',
        gender: 'M',
        day: 25,
        month: 12,
        year: 1980,
        birthplace: 'Calendasco'
      }))
        .toBe('RSSMRA80T25B405Z')
    })

    test("e anche il codice fiscale inverso", () => {

      let reverse = CodiceFiscale.reverse('RSSMRA80T25B405Z');
        expect(reverse.name).toEqual('MRA');
        expect(reverse.surname).toEqual('RSS');
        expect(reverse.gender).toEqual('M');
        expect(reverse.day).toEqual(25);
        expect(reverse.month).toEqual(12);
        expect(reverse.year).toEqual(1980);
        expect(reverse.birthplace).toEqual('CALENDASCO');
        expect(reverse.birthplaceProvincia).toEqual('PC');
    });

  });

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
