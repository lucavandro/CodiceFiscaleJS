import { Comune } from '../src/comune.js';

describe("La classe Comune", ()=>{
    test("trova il comune di Bolzano", ()=>{
      let bz = new Comune("Bolzano", "BZ")
      expect(bz.nome).toEqual('BOLZANO')
    })
})