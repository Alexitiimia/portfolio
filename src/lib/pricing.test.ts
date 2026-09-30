import { describe, expect, it } from 'vitest'
import { priceFromHours } from './pricing'

describe('priceFromHours', () => {
  it('multiplica as horas pelo valor da hora e arredonda para R$ 10', () => {
    expect(priceFromHours(10, 50)).toBe(500)
    expect(priceFromHours(24, 55)).toBe(1320)
    expect(priceFromHours(7, 43)).toBe(300) // 301 -> 300
    expect(priceFromHours(7, 44)).toBe(310) // 308 -> 310
  })

  it('devolve null (sob consulta) sem valor da hora definido', () => {
    expect(priceFromHours(10, null)).toBeNull()
  })

  it.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY])(
    'devolve null para horas inválidas (%s)',
    (hours) => {
      expect(priceFromHours(hours, 50)).toBeNull()
    },
  )

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'devolve null para valor da hora inválido (%s)',
    (rate) => {
      expect(priceFromHours(10, rate)).toBeNull()
    },
  )
})
