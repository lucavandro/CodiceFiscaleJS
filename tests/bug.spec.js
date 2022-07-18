import CodiceFiscale from '../src/codice-fiscale.js';

describe('Error in getting day of birth in reverse CF check #85', () => {
    let cf = new CodiceFiscale("RSSMRA80B01F205W")
    test('genera la data di nascita corretta', () => {
      expect(cf.day).toEqual(1)
      expect(cf.month).toEqual(2)
      expect(cf.year).toEqual(1980)
    })
  
  
})


