import CodiceFiscale from '../src/codice-fiscale.js';
describe('Calcolo codice fiscale inverso ', () => {
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

  
  /*  Nome: VINCENZO
   *  Cognome: RIGHI
   *  Nato a : NAPOLI (NA)
   *  Giorno : 24
   *  Mese   : Luglio (7)
   *  Anno   : 1957
   *  Sesso  : M
   */
  let enzo_righi_cf =  "VNCRGH57L24F839U";

  test('restituisce il genere corretto', () => {
    expect(CodiceFiscale.computeInverse(enzo_righi_cf).gender).toEqual('M')
  })

  test('restituisce la città natale corretta', () => {
    expect(CodiceFiscale.computeInverse(enzo_righi_cf).birthplace).toEqual('NAPOLI')
  })

  test('restituisce la provincia della città natale corretta', () => {
    expect(CodiceFiscale.computeInverse(enzo_righi_cf).birthplaceProvincia).toEqual('NA')
  })

  test('restituisce il giorno di nascita come numero compreso tra 1 e 31', () => {
    let day = CodiceFiscale.computeInverse(enzo_righi_cf).day
    expect(day >= 1 && day <= 31).toBe(true)
  })

  test('restituisce il giorno corretto', () => {
    expect(CodiceFiscale.computeInverse(enzo_righi_cf).day).toBe(24)
  })

  test('restituisce il mese corretto', () => {
    expect(CodiceFiscale.computeInverse(enzo_righi_cf).month).toBe(7);
  })

  test('restituisce anno corretto', () => {
    expect(CodiceFiscale.computeInverse(enzo_righi_cf).year).toBe(1957);
  })

  test('la data corretta', () => {
    expect(CodiceFiscale.computeInverse(enzo_righi_cf).birthday).toBe("1957-07-24");
  })

  test('il cf segnalato da Max',()=>{
    console.log(CodiceFiscale.computeInverse('CCHGNN67R05H1S3I'))
    expect(CodiceFiscale.computeInverse('CCHGNN67R05H1S3I')).toBeDefined()
    expect(new CodiceFiscale('CCHGNN67R05H1S3I')).toBeDefined()
  })

})


describe('Calcolo codice fiscale inverso per le donne', () => {
  
  
    
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
  
  
  describe('Calcolo del codice fiscale inverso per comuni che sono diventati frazione o che hanno cambiato provincia',()=>{
  
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
     *  Nato a : VIMERCATE (MI)
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
  