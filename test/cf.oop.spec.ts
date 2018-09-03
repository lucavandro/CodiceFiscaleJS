import { Comune } from '../src/comune';
import { CodiceFiscale } from '../src/main';

describe('Gli oggetti appartenenti alla classe Codice Fiscale', () => {
  const c1 : CodiceFiscale = new CodiceFiscale({
    name: 'Luca',
    surname: 'Moreno',
    gender: 'M',
    day: 1,
    month: 1,
    year: 2000,
    birthplace: 'Roma',
    birthplaceProvincia: 'RM',
  });

  it('possono essere creati utilizzando una oggetto', () => {
    const creaOggetto = () => new CodiceFiscale({
        name: 'Luca',
        surname: 'Moreno',
        gender: 'M',
        day: 1,
        month: 1,
        year: 2000,
        birthplace: 'Roma',
        birthplaceProvincia: 'RM',
      });

    expect(creaOggetto).not.toThrow();
  });

  it('una volta creati, calcaloano il codice fiscale, che può essere letto attraversi la proprietà cf o il metodo toString', () => {
    expect(c1.cf).toBe('MRNLCU00A01H501J');
    expect(c1.toString()).toBe('MRNLCU00A01H501J');
  });

  it('hanno la proprietà name', () => {
    expect(c1.name).toBe('Luca');
  });

  it('hanno la proprietà surname', () => {
    expect(c1.surname).toBe('Moreno');
  });

  it('hanno la proprietà gender', () => {
    expect(c1.gender).toBe('M');
  });

  it('hanno la proprietà day', () => {
    expect(c1.day).toBe(1);
  });

  it('hanno la proprietà month', () => {
    expect(c1.month).toBe(1);
  });

  it('hanno la proprietà year', () => {
    expect(c1.year).toBe(2000);
  });

  it('hanno la proprietà birtday', () => {
    expect(c1.birthday).toEqual(new Date(2000, 0, 1, 0, 0, 0, 0));
  });

  it('hanno la proprietà comune', () => {
    const comune = new Comune('Roma');
    expect(c1.birthplace).toEqual(comune);
  });

  it('tutte le proprietà possono essere esportate utilizando il metodo toJSON()', () => {
    expect(c1.toJSON()).toEqual({
      name: 'Luca',
      surname: 'Moreno',
      gender: 'M',
      day: 1,
      month: 1,
      year: 2000,
      birthplace: 'Roma',
      birthplaceProvincia: 'RM',
      cf: 'MRNLCU00A01H501J',
    });
  });

});

describe('Gli oggetti appartenenti alla classe Codice Fiscale creati utilizzando una stringa con un codice fiscale', () => {
  const c1  = new CodiceFiscale('MRNLCU00A01H501J');

  it('possono essere creati', () => {
    const creaOggetto1 = () => new CodiceFiscale('MRNLCU00A01H501J');
    expect(creaOggetto1).not.toThrow();
  });

  it('lanciano un eccezione se la stringa passata al costruttore non è un codice fiscale valido', () => {
    const creaOggetto2 = () =>  new CodiceFiscale('MRNLCU00A01H501K');
    expect(creaOggetto2).toThrow();
  });

  it('non hanno la proprietà name', () => {
    expect(c1.name).toBeUndefined();
  });

  it('non hanno la proprietà surname', () => {
    expect(c1.surname).toBeUndefined();
  });

  it('hanno la proprietà gender', () => {
    expect(c1.gender).toBe('M');
  });

  it('hanno la proprietà day', () => {
    expect(c1.day).toBe(1);
  });

  it('hanno la proprietà month', () => {
    expect(c1.month).toBe(1);
  });

  it('hanno la proprietà year', () => {
    expect(c1.year).toBe(2000);
  });

  it('hanno la proprietà birtday', () => {
    expect(c1.birthday).toEqual(new Date(2000, 0, 1));
  });

  it('hanno la proprietà comune', () => {
    const comune = new Comune('ROMA');
    expect(c1.birthplace).toEqual(comune);
  });

  it('hanno la proprietà year', () => {
    expect(c1.year).toBe(2000);
  });

  it('calcola le omocodie dato un codice fiscale', () => {
    const c2 = new CodiceFiscale('BNZVCN32S10E573Z');
    const omocodie = c2.omocodie();
    expect(omocodie).toContain('BNZVCN32S10E57PV');
    expect(omocodie).toContain('BNZVCNPNSMLERTPX');
  });

  it('hanno la proprietà surnameCode', () => {
    const c2 = new CodiceFiscale('BNZVCN32S10E573Z');
    expect(c2.surnameCode).toEqual('BNZ');
  });

  it('hanno la proprietà nameCode', () => {
    const c2 = new CodiceFiscale('BNZVCN32S10E573Z');
    expect(c2.nameCode).toEqual('VCN');
  });

  it('hanno la proprietà checkCode', () => {
    const c2 = new CodiceFiscale('BNZVCN32S10E573Z');
    expect(c2.checkCode).toEqual('Z');
  });

});
