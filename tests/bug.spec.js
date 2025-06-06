import CodiceFiscale from '../src/codice-fiscale.js';

describe('Error in getting day of birth in reverse CF check #85', () => {
    let cf = new CodiceFiscale("RSSMRA80B01F205W")
    test('genera la data di nascita corretta', () => {
      expect(cf.day).toEqual(1)
      expect(cf.month).toEqual(2)
      expect(cf.year).toEqual(1980)
    })
})

describe('Generazione codice fiscale per persone nate nell\'Unione Sovietica', () => {
    test('genera CF corretto per persona nata a Mosca', () => {
        const cf = new CodiceFiscale({
            name: 'Vladimir',
            surname: 'Petrov',
            gender: 'M',
            day: 15,
            month: 6,
            year: 1985,
            birthplace: 'URSS', // Codice per Mosca
            birthplaceProvincia: 'EE' // EE per stati esteri
        })
        expect(cf.cf.length).toBe(16)
        expect(cf.cf.substr(11, 1)).toBe('Z') // Verifica il codice catastale estero
    })

    test('genera CF corretto per persona nata a Kiev', () => {
        const cf = new CodiceFiscale({
            name: 'Natalia',
            surname: 'Kovacs',
            gender: 'F',
            day: 23,
            month: 3,
            year: 1979,
            birthplace: 'UNIONE SOVIETICA', // Codice per Kiev
            birthplaceProvincia: 'EE'
        })
        expect(cf.cf.length).toBe(16)
        expect(cf.cf.substr(11, 1)).toBe('Z')
    })

    test('genera CF corretto per persona nata a Leningrado', () => {
        const cf = new CodiceFiscale({
            name: 'Mikhail',
            surname: 'Ivanov',
            gender: 'M',
            day: 7,
            month: 11,
            year: 1982,
            birthplace: 'UNIONE REPUBBLICHE SOCIALISTE SOVIETICHE', // Codice per Leningrado (San Pietroburgo)
            birthplaceProvincia: 'EE'
        })
        expect(cf.cf.length).toBe(16)
        expect(cf.cf.substr(11, 1)).toBe('Z')
    })
})


