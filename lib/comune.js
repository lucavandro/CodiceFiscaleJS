import { COMUNI } from './geo-data'
import { normalizeString } from './utils'
export class Comune {
  get nomeNorm () {
    return normalizeString(this.nome)
  }
  constructor (nome, prov, cc, check = true) {
    if (check || cc === undefined || prov === undefined) {
      let comune
      comune = prov !== undefined ? this.searchByNameAndProvince(nome, prov) : this.searchByName(nome)
      if (comune === undefined && nome.length === 4) {
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
    for (const item of COMUNI) {
      if (item[0] === cc) {
        result = item
        break
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
  searchByName (nome) {
    const query = normalizeString(nome)
    let left = 0
    let right = COMUNI.length - 1
    const result = []
    while (left <= right) {
      const middle = Math.floor((left + right) / 2)
      const currentItem = COMUNI[middle]
      if (query === currentItem[2]) {
        result.push(currentItem)
        if (middle > 0 && COMUNI[middle - 1][2] === query) {
          result.push(COMUNI[middle - 1])
        } else if (middle < COMUNI.length - 1 && COMUNI[middle + 1][2] === query) {
          result.push(COMUNI[middle + 1])
        }
        break
      } else if (query < currentItem[2]) {
        right = middle - 1
      } else {
        left = middle + 1
      }
    }
    if (result.length === 1) {
      return { cc: result[0][0], prov: result[0][1], nome: result[0][2] }
    } else if (result.length > 1) {
      throw new Error(`Comune with name of ${nome} is found in more than one province. Please specify the province code`)
    }
  }
  searchByNameAndProvince (nome, prov) {
    const query = normalizeString(nome)
    let left = 0
    let right = COMUNI.length - 1
    let result
    while (left <= right) {
      const middle = Math.floor((left + right) / 2)
      const currentItem = COMUNI[middle]
      if (query === currentItem[2]) {
        if (prov === currentItem[1]) {
          result = currentItem
        } else if (middle > 0 && COMUNI[middle - 1][2] === query && prov === COMUNI[middle - 1][1]) {
          result = COMUNI[middle - 1]
        } else if (middle < COMUNI.length - 1 && COMUNI[middle + 1][2] === query && prov === COMUNI[middle + 1][1]) {
          result = COMUNI[middle + 1]
        }
        break
      } else if (query < currentItem[2]) {
        right = middle - 1
      } else {
        left = middle + 1
      }
    }
    if (result !== undefined) {
      return { cc: result[0], prov: result[1], nome: result[2] }
    } else {
      throw new Error(`Comune with name of ${nome} and prov ${prov} doesn't exists`)
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
