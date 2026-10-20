import { COMUNI } from './lista-comuni'
import { PROVINCE } from './lista-province'

let comuni, province

export function getComuni () {
  return comuni || (comuni = Object.freeze(COMUNI.map(([cc, prov, nome, active]) =>
    Object.freeze({ cc, prov, nome, active: active === 1 }))))
}

export function getProvince () {
  return province || (province = Object.freeze(Object.entries(PROVINCE).map(([prov, nome]) =>
    Object.freeze({ prov, nome }))))
}
