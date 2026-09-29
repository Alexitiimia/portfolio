import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('junta as classes com espaço', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c')
  })

  it('ignora valores vazios', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('devolve texto vazio quando não há classes', () => {
    expect(cx(false, undefined)).toBe('')
  })
})
