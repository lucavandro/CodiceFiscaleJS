import CodiceFiscale from '../src/codice-fiscale.js';

describe('Calcolo codice fiscale inverso -> metodo .computeInverse', () => {
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
  
  
    /*  Nome: GIUSEPPE
     *  Cognome: ESPOSITO
     *  Nato a : NAPOLI (NP)
     *  Giorno : 18
     *  Mese   : Febbraio (2)
     *  Anno   : 1975
     *  Sesso  : M
     *  OMOCODIA: true
     */
    let giuseppe_esposito_cf =  "SPSGPP75B18F83VM";
  
    test('restituisce la città natale corretta nonostante omocodia', () => {
      expect(CodiceFiscale.computeInverse(giuseppe_esposito_cf).birthplace).toEqual('NAPOLI')
    })
    

    test('funziona con il codice fiscale di max', () => {
      expect(CodiceFiscale.computeInverse("CCHGNN67R05H1S3I")).toBeDefined()
    })
    
  
});