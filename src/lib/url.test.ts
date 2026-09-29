import { describe, expect, it } from 'vitest'
import { isHttpsUrl, isMailtoUrl } from './url'

describe('isHttpsUrl', () => {
  it('aceita endereços HTTPS completos', () => {
    expect(isHttpsUrl('https://github.com/Alexitiimia')).toBe(true)
    expect(isHttpsUrl('https://wa.me/5511999999999')).toBe(true)
  })

  it.each([
    'http://github.com',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'mailto:alguem@exemplo.com',
    '//github.com',
    '/caminho/relativo',
    'github.com',
    'https://localhost',
    '',
    'não é uma url',
  ])('recusa %j', (value) => {
    expect(isHttpsUrl(value)).toBe(false)
  })
})

describe('isMailtoUrl', () => {
  it('aceita mailto: com endereço', () => {
    expect(isMailtoUrl('mailto:alguem@exemplo.com')).toBe(true)
  })

  it.each(['mailto:', 'https://exemplo.com', 'alguem@exemplo.com', ''])('recusa %j', (value) => {
    expect(isMailtoUrl(value)).toBe(false)
  })
})
