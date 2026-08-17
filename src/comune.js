import { COMUNI } from './lista-comuni'
import { normalizeString } from './utils'
const comuniByCC = new Map()
const comuniByName = new Map()

for (const item of COMUNI) {
  const [cc, prov, nome, activeFlag] = item
  const active = activeFlag === 1
  const mapped = { cc, prov, nome, active }

  // Per CC, diamo priorità a quello attivo
  if (active || !comuniByCC.has(cc)) {
    comuniByCC.set(cc, mapped)
  }

  let list = comuniByName.get(nome)
  if (!list) {
    list = []
    comuniByName.set(nome, list)
  }
  list.push(mapped)
}

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
    const mapped = comuniByCC.get(cc)
    if (mapped !== undefined) {
      return new Comune(mapped.nome, mapped.prov, mapped.cc, false)
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

  searchByName (nome) {
    this.searchByNameAndProvince(nome)
  }

  searchByNameAndProvince (nome, prov) {
    const qNome = normalizeString(nome)
    const qProv = prov && normalizeString(prov)

    let results = comuniByName.get(qNome) || []
    if (qProv) {
      results = results.filter(c => c.prov === qProv)
    }

    // One results: no problem!
    if (results.length === 1) {
      return results[0]
    }

    // if many results look for the active one
    results = results.filter(c => c.active)

    if (results.length === 1) {
      return results[0]
    } else if (prov) {
      throw new Error(`Comune with name of ${nome} and prov ${prov} doesn't exists`)
    } else if (nome.length === 4 && nome.toUpperCase() === nome) {
      return Comune.GetByCC(nome)
    } else {
      throw new Error(`Comune with name of ${nome} is found in more than one province. Please specify the province code`)
    }
  }

  toJSON () {
    return {
      cc: this.cc,
      nome: this.nome,
      prov: this.prov
    }
  }
}
