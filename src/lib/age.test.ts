import { describe, expect, it } from 'vitest'
import { ageOn } from './age'

describe('ageOn', () => {
  it('não conta o ano enquanto o aniversário não chegou', () => {
    expect(ageOn('2006-03-29', new Date(2026, 2, 28))).toBe(19)
    expect(ageOn('2006-03-29', new Date(2026, 0, 1))).toBe(19)
  })

  it('soma um ano no dia do aniversário', () => {
    expect(ageOn('2006-03-29', new Date(2026, 2, 29))).toBe(20)
  })

  it('mantém a idade até o aniversário seguinte', () => {
    expect(ageOn('2006-03-29', new Date(2026, 8, 29))).toBe(20)
    expect(ageOn('2006-03-29', new Date(2026, 11, 31))).toBe(20)
    expect(ageOn('2006-03-29', new Date(2027, 2, 28))).toBe(20)
    expect(ageOn('2006-03-29', new Date(2027, 2, 29))).toBe(21)
  })

  it('recusa data que não é AAAA-MM-DD', () => {
    expect(() => ageOn('29/03/2006' as never, new Date())).toThrow()
  })
})
