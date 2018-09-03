import { Comune } from '../src/comune';

describe('Comune', () => {

    it('crea nuove istanze utilizzando nome, provincia e codice catastale', () => {
        // tslint:disable-next-line:no-console
        const c1 = new Comune('Caserta', 'CE', 'B963');
        expect(c1.nome).toEqual('Caserta');
        expect(c1.prov).toEqual('CE');
        expect(c1.cc).toEqual('B963');
    });

    it('esiste una classe chiamata comune', () => {
        expect(Comune).toBeDefined();
        expect(Comune.name).toEqual('Comune');
    });

    it('se nome, provincia o codice catastale sono errati genera un errore', () => {
        expect(() => new Comune('Caserta', 'CE', 'A000')).toThrow();
        expect(() => new Comune('Caserta', 'CU')).toThrow();
    });

    it('è possibile creare un\'istanza utilizzando solo il nome del comune', () => {
        const c1 = Comune.GetByName('Caserta');
        expect(c1.nome).toEqual('Caserta');
        expect(c1.prov).toEqual('CE');
        expect(c1.cc).toEqual('B963');
    });

    it('se ci sono due comuni con lo stesso nome e la provincia non viene specificata, il metodo .getByName genera un errore', () => {
        expect(() => Comune.GetByName('Castro'))
        .toThrowError('Comune with name of Castro is found in more than one province. Please specify the province code');
        expect(() => Comune.GetByName('Castro', 'LE')).not.toThrowError();
        expect(() => Comune.GetByName('Castro', 'BG')).not.toThrowError();
    });

    it('è possibile creare un\'istanza utilizzando solo il codice catastale', () => {
        const c1 = Comune.GetByCC('B963');
        expect(c1.nomeNorm).toEqual('CASERTA');
        expect(c1.nome).toEqual('CASERTA');
        expect(c1.prov).toEqual('CE');
        expect(c1.cc).toEqual('B963');
    });

    it('trova il codice di un comune che contiene lettere accentate', () => {
        const comune = new Comune('Riccò del golfo di Spezia', 'SP');
        expect(comune.nome).toBe('Riccò del golfo di Spezia');
        expect(comune.nomeNorm).toBe('RICCO\' DEL GOLFO DI SPEZIA');
        expect(comune.prov).toBe('SP');
        expect(comune.cc).toBe('H275');
    });

    it('trova il codice di un comune che contiene apostrofi', () => {
        const comune = new Comune('Sant\'Angelo Romano', 'RM');
        expect(comune.cc).toBe('I284');
    });

    it('consente di inserire stati esteri', () => {
        const stato = new Comune('Albania', 'EE');
        expect(stato.cc).toBe('Z100');
    });
});
