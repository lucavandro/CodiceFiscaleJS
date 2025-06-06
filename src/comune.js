import { COMUNI } from './lista-comuni'
import { normalizeString } from './utils'
export class Comune {
  get nomeNorm () {
    return normalizeString(this.nome)
  }
  constructor (nome, prov, cc, check = true) {
    if (check || cc === undefined || prov === undefined) {
      let comune = this.searchByNameAndProvince(nome, prov) 
      
      if (comune === undefined && nome.length === 4 && /^[A-Za-z]\d{3}$/.test(nome)) {
        comune = this.searchByCC(nome)
      }

      if (comune === undefined) {
        throw new Error(`Comune with name ${nome} doesn't exist`)
      } else if (cc !== undefined && comune.cc !== cc) {
        throw new Error(`Comune with cc ${cc} doesn't exist`)
      } else {
        this.nome = comune.nome
        this.prov = comune.prov
        this.cc = comune.cc
      }
    } else {
      this.nome = nome
      this.prov = prov
      this.cc = cc
    }
  }
  static GetByName (name, prov) {
    return new Comune(name, prov)
  }
  static GetByCC (cc) {
    let result
    let count = 0
    for (const item of COMUNI) {
      if ( item[0] === cc && item[3]===1) {
        result = item
        break
      } else if(item[0] === cc){
        result = item;
      }
    }
    if (result !== undefined) {
      return new Comune(result[2], result[1], result[0], false)
    }
    throw new Error(`Comune with cc ${cc} doesn't exist`)
  }

  searchByCC (cc) {
    let result
    try {
      result = Comune.GetByCC(cc)
    } catch (e) { }
    if (result !== undefined) {
      return result.toJSON()
    }
  }
  searchByName (nome ) {
    this.searchByNameAndProvince(nome)
  }
  searchByNameAndProvince (nome, prov) {
    const qNome = normalizeString(nome)
    const qProv= prov && normalizeString(prov) 
    let results = COMUNI.filter((c)=>qProv? c[1]===qProv && c[2]===qNome: c[2]===qNome).map((c)=>{ 
      return { cc: c[0], prov: c[1], nome: c[2], active:c[3]===1 }
    })
    
    // One results: no problem!
    if (results.length === 1) {
      return results[0]
    } 
    
    // if many results look for the active one
    results = results.filter(c=> c.active)
    
    if(results.length === 1)
      return results[0]
    else if(prov)
      throw new Error(`Comune with name of ${nome} and prov ${prov} doesn't exists`)
    else if(nome.length===4 && nome.toUpperCase() === nome)
      return Comune.GetByCC(nome)
    else
      throw new Error(`Comune with name of ${nome} is found in more than one province. Please specify the province code`)
    
  }

  toJSON () {
    return {
      cc: this.cc,
      nome: this.nome,
      prov: this.prov
    }
  }
}
