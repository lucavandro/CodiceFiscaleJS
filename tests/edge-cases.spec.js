/* eslint-env jest */
/* eslint-disable camelcase */
import CodiceFiscale from '../src/codice-fiscale'
import { daysInMonth, isValidDate, getValidDate, getAllSubsets } from '../src/utils'
import { Comune } from '../src/comune'

describe('Edge Cases & Coverage', () => {
  describe('CodiceFiscale Getters and Setters', () => {
    test('should correctly get and set properties', () => {
      const cf = new CodiceFiscale({
        name: 'Mario',
        surname: 'Rossi',
        gender: 'M',
        day: 15,
        month: 6,
        year: 1990,
        birthplace: 'Roma',
        birthplaceProvincia: 'RM'
      })

      expect(cf.day).toBe(15)
      expect(cf.month).toBe(6)
      expect(cf.year).toBe(1990)

      // Getters for code parts
      expect(cf.surnameCode).toBe('RSS')
      expect(cf.nameCode).toBe('MRA')
      expect(cf.cf).toBe(cf.code)
      expect(cf.checkCode).toBe(cf.code.substr(15, 1))

      // Setters
      cf.day = 20
      expect(cf.day).toBe(20)
      cf.month = 12
      expect(cf.month).toBe(12)
      cf.year = 2000
      expect(cf.year).toBe(2000)
    })
  })

  describe('CodiceFiscale check edge cases', () => {
    test('should return false if input is not a string', () => {
      expect(CodiceFiscale.check(1234567890123456)).toBe(false)
      expect(CodiceFiscale.check(null)).toBe(false)
      expect(CodiceFiscale.check(undefined)).toBe(false)
      expect(CodiceFiscale.check({})).toBe(false)
    })
  })

  describe('Utils functions', () => {
    test('daysInMonth', () => {
      expect(daysInMonth(1, 2024)).toBe(29) // Leap year February
      expect(daysInMonth(1, 2023)).toBe(28) // Non-leap year February
      expect(daysInMonth(3, 2023)).toBe(30) // April
      expect(daysInMonth(0, 2023)).toBe(31) // January
    })

    test('isValidDate', () => {
      expect(isValidDate(29, 2, 2024)).toBe(true)
      expect(isValidDate(29, 2, 2023)).toBe(false)
      expect(isValidDate(31, 4, 2023)).toBe(false)
      expect(isValidDate(31, 1, 2023)).toBe(true)
    })

    test('getValidDate throws on invalid type', () => {
      expect(() => getValidDate(null)).toThrow()
    })

    test('getValidDate parses correctly', () => {
      const d = getValidDate('1990-06-15')
      expect(d.getFullYear()).toBe(1990)
      expect(d.getMonth()).toBe(5) // 0-indexed
      expect(d.getDate()).toBe(15)
    })

    test('getAllSubsets', () => {
      const arr = [1, 2]
      const subsets = getAllSubsets(arr)
      expect(subsets).toEqual([[], [1], [2], [2, 1]])
    })
  })

  describe('Comune edge cases', () => {
    test('searchByCC error handling', () => {
      expect(() => Comune.GetByCC('INVALID')).toThrow()
    })
    test('searchByNameAndProvince error handling', () => {
      expect(() => new Comune('NonExistentCity', 'XX')).toThrow()
      expect(() => new Comune('ROMA', 'XX')).toThrow() // Exists but wrong province
    })
    test('toJSON', () => {
      const c = new Comune('ROMA', 'RM')
      expect(c.toJSON()).toEqual({ cc: 'H501', nome: 'ROMA', prov: 'RM' })
    })
  })
})
