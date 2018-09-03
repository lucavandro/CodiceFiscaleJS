import { CodiceFiscale } from '../src/main';

describe('Codice Fiscale', () => {
    it('esiste un oggetto chiamato CodiceFiscale', () => {
      expect(CodiceFiscale).not.toBe(undefined);
    });
  });

describe('CodiceFiscale.getCheckCode', () => {
    it('è  definito', () => {
      expect(CodiceFiscale.getCheckCode).not.toBe(undefined);
    });

    it('restituisce il corretto risultato', () => {
      expect(CodiceFiscale.getCheckCode('MRNLCU00A01H501')).toBe('J');
    });
  });

describe('CodiceFiscale.compute', () => {
    it('è  definito', () => {
      expect(CodiceFiscale.compute).not.toBe(undefined);
    });

    it('calcola il codice fiscale', () => {
      expect(CodiceFiscale.compute({
        name: 'Luca',
        surname: 'Moreno',
        gender: 'M',
        day: 1,
        month: 1,
        year: 2000,
        birthplace: 'Roma',
        birthplaceProvincia: 'RM',
      }))
        .toBe('MRNLCU00A01H501J');
    });

    it('calcola il codice fiscale di persone nate all\'estero', () => {
      expect(CodiceFiscale.compute({
        name: 'Luca',
        surname: 'Moreno',
        gender: 'M',
        day: 1,
        month: 1,
        year: 2000,
        birthplace: 'Albania',
        birthplaceProvincia: 'EE',
      }))
        .toBe('MRNLCU00A01Z100P');
    });

    it('se il comune non esiste lancia un eccezione', () => {
      const comuneInventato = () => {
        CodiceFiscale.compute({
          name: 'Luca',
          surname: 'Moreno',
          gender: 'M',
          day: 1,
          month: 1,
          year: 2000,
          birthplace: 'Foo',
          birthplaceProvincia: 'EE',
        });
      };
      expect(comuneInventato).toThrow();
    });
  });

describe('CodiceFiscale.findLocationCode', () => {
    it('è  definito', () => {
      expect(CodiceFiscale.findLocationCode).not.toBe(undefined);
    });

    it('trova il codice del comune', () => {
      expect(CodiceFiscale.findLocationCode('Roma', 'RM')).toBe('H501');
    });

  });

describe('CodiceFiscale.check', () => {
    it('è definito', () => {
      expect(CodiceFiscale.check).not.toBe(undefined);
    });

    it('controlla se il codice fiscale è valido', () => {
      expect(CodiceFiscale.check('MRNLCU00A01H501J')).toBe(true);
    });

    it('controlla che sia composto dal non più 16 valori alfanumerici', () => {
      expect(CodiceFiscale.check('MRNLCU00A01H501JK')).toBe(false);
    });

    it('controlla che sia composto dal almeno 16 valori alfanumerici', () => {
      expect(CodiceFiscale.check('MRNLCU00A01H501J3')).toBe(false);
    });

    it('controlla che il carattere di controllo sia esatto', () => {
      expect(CodiceFiscale.check('VNDLDL87D07B963G')).toBe(false);
    });

    it('funziona anche in caso di omocodie', () => {
      expect(CodiceFiscale.check('BNZVCN32S10E57PV')).toBe(true);
      expect(CodiceFiscale.check('BNZVCNPNSMLERTPX')).toBe(true);
    });
  });

describe('CodiceFiscale.getOmocodie', () => {
    it('è definito', () => {
      expect(CodiceFiscale.getOmocodie).not.toBe(undefined);
    });

    it('calcola le omocodie dato un codice fiscale', () => {
        const omocodie = CodiceFiscale.getOmocodie('BNZVCN32S10E573Z');
        expect(omocodie).toContain('BNZVCN32S10E57PV');
        expect(omocodie).toContain('BNZVCNPNSMLERTPX');
    });
  });

describe('Calcolo codice fiscale inverso -> metodo .computeInverse', () => {
    it('è definito', () => {
      expect(CodiceFiscale.computeInverse).not.toBe(undefined);
    });

    it('restituisce falso se l\'input è stringa formattata male', () => {
      const notValid = () => {
        CodiceFiscale.computeInverse('BNZVCN32SC0E573Z');
      };
      expect(notValid).toThrowError('Provided input is not a valid Codice Fiscale');
    });

    it('restituisce il genere corretto', () => {
      expect(CodiceFiscale.computeInverse('MRNLCU00A01H501J').gender).toEqual('M');
    });

    it('restituisce la città natale corretta', () => {
      expect(CodiceFiscale.computeInverse('MRNLCU00A01H501J').birthplace).toEqual('ROMA');
    });

    it('restituisce la provincia della città natale corretta', () => {
      expect(CodiceFiscale.computeInverse('MRNLCU00A01H501J').birthplaceProvincia).toEqual('RM');
    });

    it('restituisce il giorno di nascita come numero compreso tra 1 e 31', () => {
      expect(
          CodiceFiscale.computeInverse('MRNLCU00A01H501J').day >= 1 &&
          CodiceFiscale.computeInverse('MRNLCU00A01H501J').day <= 31,
        ).toBe(true);
    });
  });
