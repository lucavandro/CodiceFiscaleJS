/* eslint-env jest */
import { getComuni, getProvince } from '../src/geo-data'
import CodiceFiscale from '../src/codice-fiscale.js'
import { Comune } from '../src/comune'

const { describe, test, expect } = global

describe('getComuni', () => {
  test('returns a non-empty array', () => {
    const comuni = getComuni()
    expect(comuni).toBeInstanceOf(Array)
    expect(comuni.length).toBeGreaterThan(0)
  })

  test('each entry has the expected shape', () => {
    const entry = getComuni()[0]
    expect(typeof entry.cc).toBe('string')
    expect(typeof entry.prov).toBe('string')
    expect(typeof entry.nome).toBe('string')
    expect(typeof entry.active).toBe('boolean')
  })

  test('repeated calls return the same array reference (cached)', () => {
    expect(getComuni()).toBe(getComuni())
  })

  test('the returned array is frozen', () => {
    expect(Object.isFrozen(getComuni())).toBe(true)
  })

  test('each entry object is frozen', () => {
    expect(Object.isFrozen(getComuni()[0])).toBe(true)
  })

  test('contains EE (foreign country) entries', () => {
    const estero = getComuni().filter(c => c.prov === 'EE')
    expect(estero.length).toBeGreaterThan(0)
  })

  test('sample entry A010 matches Comune.GetByCC', () => {
    const entry = getComuni().find(c => c.cc === 'A010' && c.active)
    expect(entry).toBeDefined()
    expect(entry.nome).toBe('ABBIATEGRASSO')
    expect(entry.prov).toBe('MI')

    const comune = Comune.GetByCC('A010')
    expect(comune.nome).toBe(entry.nome)
    expect(comune.prov).toBe(entry.prov)
  })

  test('CodiceFiscale.getComuni delegates to getComuni', () => {
    expect(CodiceFiscale.getComuni()).toBe(getComuni())
  })
})

describe('getProvince', () => {
  test('returns a non-empty array', () => {
    const province = getProvince()
    expect(province).toBeInstanceOf(Array)
    expect(province.length).toBeGreaterThan(0)
  })

  test('each entry has the expected shape', () => {
    const entry = getProvince()[0]
    expect(typeof entry.prov).toBe('string')
    expect(typeof entry.nome).toBe('string')
  })

  test('repeated calls return the same array reference (cached)', () => {
    expect(getProvince()).toBe(getProvince())
  })

  test('the returned array is frozen', () => {
    expect(Object.isFrozen(getProvince())).toBe(true)
  })

  test('each entry object is frozen', () => {
    expect(Object.isFrozen(getProvince()[0])).toBe(true)
  })

  test('contains EE (Estero) entry', () => {
    const estero = getProvince().find(p => p.prov === 'EE')
    expect(estero).toBeDefined()
    expect(estero.nome).toBe('Estero')
  })

  test('contains a sample Italian province', () => {
    const mi = getProvince().find(p => p.prov === 'MI')
    expect(mi).toBeDefined()
    expect(mi.nome).toBe('Milano')
  })

  test('CodiceFiscale.getProvince delegates to getProvince', () => {
    expect(CodiceFiscale.getProvince()).toBe(getProvince())
  })
})
