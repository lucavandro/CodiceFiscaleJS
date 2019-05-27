import { COMUNI_DATA } from './comuni-data'
import { PROVINCE_DATA } from './province-data'

const instance = {
  COMUNI: COMUNI_DATA,
  PROVINCE: PROVINCE_DATA,
}

export const GEO_DATA = {
  getComuni: () => {
    return instance.COMUNI
  },
  setComuni: (comuni) => {
    instance.COMUNI = comuni
  },
  getProvince: () => {
    return instance.PROVINCE
  },
  setProvince: (province) => {
    instance.PROVINCE = province
  },
  resetToDefaults: () => {
    instance.COMUNI = COMUNI_DATA;
    instance.PROVINCE = PROVINCE_DATA;
  }
}

export const COMUNI = instance.COMUNI

export const PROVINCE = instance.PROVINCE
