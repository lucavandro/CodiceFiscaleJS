import CodiceFiscale from '../src/codice-fiscale.js';

describe('CodiceFiscale.getOmocodie', () => {
    test('è definito', () => {
      expect(CodiceFiscale.getOmocodie).toBeDefined()
    })
  
    test('calcola le omocodie dato un codice fiscale', () => {
      expect(CodiceFiscale.getOmocodie('BNZVCN32S10E573Z'))
       .toEqual(expect.arrayContaining(['BNZVCN32S10E57PV', 'BNZVCNPNSMLERTPX']))
    })
    test('le omocodie generate sono tutte differenti', () => {
      const omocodie = CodiceFiscale.getOmocodie('BNZVCN32S10E573Z');
      const omocodieSenzaDuplicati = [...new Set(omocodie)]
      expect(omocodie.length)
       .toEqual(omocodieSenzaDuplicati.length)
    })
    test('calcola 127 omocodie per ogni codice fiscale codice fiscale', () => {
      expect(CodiceFiscale.getOmocodie('BNZVCN32S10E573Z').length)
       .toEqual(127)
    })

    test('tutte le omocodie vengono riconosciute come codici fiscali validi', () => {
      const omocodie = CodiceFiscale.getOmocodie('BNZVCN32S10E573Z');
      for(let omocodia of omocodie)
        expect(CodiceFiscale.check(omocodia)).toEqual(true)
    })

    test('tutte le omocodie generate dal metodo vengono riconosciute come omocodie', () => {
      const omocodie = CodiceFiscale.getOmocodie('BNZVCN32S10E573Z');
      for(let omocodia of omocodie)
        expect(CodiceFiscale.isOmocodia(omocodia)).toEqual(true)
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



describe('CodiceFiscale.fromOmocodiaToOriginal', () => {
  test('è definito', () => {
    expect(CodiceFiscale.fromOmocodiaToOriginal).toBeDefined()
  })

  test('calcola la versione non omocodica di un omocodia', () => {
    expect(CodiceFiscale.fromOmocodiaToOriginal('BNZVCN32S10E57PV'))
     .toEqual('BNZVCN32S10E573Z')
  })


  test('tutte le omocodie vengono riconosciute come codici fiscali validi', () => {
    const omocodie = CodiceFiscale.getOmocodie('BNZVCN32S10E573Z');
    for(let omocodia of omocodie)
      expect(CodiceFiscale.fromOmocodiaToOriginal(omocodia)).toEqual('BNZVCN32S10E573Z')
  })


  
})
