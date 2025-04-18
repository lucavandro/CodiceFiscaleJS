import { COMUNI } from './lista-comuni'
import { PROVINCE } from './lista-province'

export function normalizeString (str) {
  return str.trim()
    .replace(new RegExp(/[àá]/g), 'a\'')
    .replace(new RegExp(/[èé]/g), 'e\'')
    .replace(new RegExp(/[ìí]/g), 'i\'')
    .replace(new RegExp(/[òó]/g), 'o\'')
    .replace(new RegExp(/[ùú]/g), 'u\'')
    .toUpperCase()
}
export function daysInMonth (m, y) {
  switch (m) {
    case 1:
      return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0) ? 29 : 28
    case 8:
    case 3:
    case 5:
    case 10:
      return 30
    default:
      return 31
  }
}
export function isValidDate (d, m, y) {
  const month = m - 1
  return month >= 0 && month < 12 && d > 0 && d <= daysInMonth(month, y)
}
export function getValidDate(d, m, y) {
  if (typeof d === 'string' && m === undefined && y === undefined) {
    if (d.includes('-')) {
      const [year, month, day] = d.split('-').map(Number);
      const date = new Date();
      date.setFullYear(year, month - 1, day);
      date.setHours(12, 0, 0, 0); // mezzogiorno per evitare errori di fuso
      return date;
    }
    return new Date(d);
  }

  if (typeof d === 'number' && typeof m === 'number' && typeof y === 'number') {
    const date = new Date();
    date.setFullYear(y, m - 1, d);
    date.setHours(12, 0, 0, 0);
    return date;
  }

  throw new Error(`The date ${y}/${m}/${d} is not a valid date`);
}

export function extractVowels (str) {
  return str.replace(/[^AEIOU]/gi, '')
}
export function extractConsonants (str) {
  return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '')
}

export function birthplaceFields (provinceSelector, birthplaceSelector) {
  const provinceSelect = document.querySelector(provinceSelector)
  const birthplaceSelect = document.querySelector(birthplaceSelector)
  const optGroupProv = document.createElement('optgroup')
  const optGroupEE = document.createElement('optgroup')
  optGroupEE.label = '-----------'
  provinceSelect.appendChild(optGroupProv)
  provinceSelect.appendChild(optGroupEE)
  Object.keys(PROVINCE).sort(function(a,b){return PROVINCE[a]>PROVINCE[b] ? 1 : -1}).forEach((code, i) => {
    const name = PROVINCE[code]
    const option = document.createElement('option')
    option.value = code
    option.textContent = name
    if (code === 'EE') {
      optGroupEE.appendChild(option)
    } else {
      optGroupProv.appendChild(option)
    }
  })

  provinceSelect.onchange = (e) => {
    let province = provinceSelect.value
    while (birthplaceSelect.firstChild) {
      birthplaceSelect.removeChild(birthplaceSelect.firstChild)
    }
    COMUNI.forEach((comune) => {
      let cc = comune[0]
      let nome = comune[2]
      let prov = comune[1]
      if (prov === province) {
        let option = document.createElement('option')
        option.value = cc
        option.textContent = nome.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        birthplaceSelect.appendChild(option)
      }
    })
  }
  provinceSelect.selectedIndex = '0'
  provinceSelect.onchange()
}


export function  getAllSubsets(array){
  return array.reduce(
    (subsets, value) => subsets.concat(
     subsets.map(set => [value,...set])
    ),
    [[]]
  );
} 
