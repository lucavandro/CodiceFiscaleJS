import CodiceFiscale from '../src/codice-fiscale.js';

describe('CodiceFiscale.getOmocodie', () => {
    test('è definito', () => {
      expect(CodiceFiscale.getOmocodie).toBeDefined()
    })
  
    test('calcola le omocodie dato un codice fiscale', () => {
      expect(CodiceFiscale.getOmocodie('BNZVCN32S10E573Z'))
       .toEqual(expect.arrayContaining(['BNZVCN32S10E57PV', 'BNZVCNPNSMLERTPX']))
    })
})


describe('CodiceFiscale.isOmocodia', () => {
    test('è definito', () => {
      expect(CodiceFiscale.isOmocodia).toBeDefined()
    })
  
    test('verifica se un codice fornito è una omocodia', () => {
    expect(CodiceFiscale.isOmocodia('BNZVCN32S10E573Z')).toEqual(false);  
      expect(CodiceFiscale.isOmocodia('BNZVCN32S10E57PV')).toEqual(true);
      expect(CodiceFiscale.isOmocodia('BNZVCNPNSMLERTPX')).toEqual(true);
      expect(CodiceFiscale.isOmocodia('CCHGNN67R05H1S3I')).toEqual(true);
    })
})