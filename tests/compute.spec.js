import CodiceFiscale from '../src/codice-fiscale.js';

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
  
    test('calcola il codice fiscale anche per i nati nel comune di Bolzano 😁', () => {
      expect(CodiceFiscale.compute({
        name: 'Mario',
        surname: 'Rossi',
        gender: 'M',
        day: 1,
        month: 1,
        year: 1980,
        birthplace: 'Bolzano',
        birthplaceProvincia: 'BZ'
      }))
        .toBe('RSSMRA80A01A952F')
    })
  
  
    test('calcola il codice fiscale anche per i nati nel comune di Bolzano 😁', () => {
      expect(CodiceFiscale.compute({
        name: 'Mario',
        surname: 'Rossi',
        gender: 'M',
        day: 1,
        month: 1,
        year: 1980,
        birthplace: 'Chiaravalle',
        birthplaceProvincia: 'AN'
      }))
        .toBeDefined()
    })
  
   let invalidCfis =  "BLIPTR93MO4A674Q";
    test('controlla il codice fiscale con una regex', () => {
      expect(CodiceFiscale.check(invalidCfis)).toEqual(false);
    });
  
  
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


    test("calcola il codice fiscale di persone nate in Turkmenistan", () => {
      expect(CodiceFiscale.compute({
        name: 'Maria',
        surname: 'Rossi',
        gender: 'F',
        day: 10,
        month: 9,
        year: 1990,
        birthplace: 'Turkmenistan',
        birthplaceProvincia: 'EE'
      }))
        .toBe('RSSMRA90P50Z258M')
    })

    test("calcola il codice fiscale di persone nate in Azerbaigian", () => {
      expect(CodiceFiscale.compute({
        name: 'Maria',
        surname: 'Rossi',
        gender: 'F',
        day: 10,
        month: 9,
        year: 1990,
        birthplace: 'Azerbaigian',
        birthplaceProvincia: 'EE'
      }))
        .toBe('RSSMRA90P50Z253A')
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
  
    test('calcola il codice fiscale anche quando viene passato come birthplace il CC di un comune', ()=>{
      expect(CodiceFiscale.compute({ name: "mario", surname: "rossi", gender: "M", birthday: "2000-01-01", birthplace: "H501" })).toBeDefined()
    })
  })