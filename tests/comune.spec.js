import { Comune } from '../src/comune.js';

describe("La classe Comune", ()=>{
    test("trova il comune di Bolzano", ()=>{
      let bz = new Comune("Bolzano", "BZ")
      expect(bz.nome).toEqual('BOLZANO')
    })
    test('trova gli stati federati di micronesia come (MICRONESIA STATI FEDERATI)', () => {
      const micronesia = new Comune('MICRONESIA STATI FEDERATI', 'EE')
      expect(micronesia.nome).toEqual('MICRONESIA STATI FEDERATI')

    })
    test('trova gli stati federati di micronesia come (STATI FEDERATI DI MICRONESIA)', () => {

      const micronesia = new Comune('STATI FEDERATI DI MICRONESIA', 'EE')
      expect(micronesia.nome).toEqual('STATI FEDERATI DI MICRONESIA')
    })
})