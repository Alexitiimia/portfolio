import { describe, expect, it } from 'vitest'
import {
  DOMAIN_SUFFIX,
  NAME_MAX_LENGTH,
  fullAddress,
  isReservedName,
  normalizeName,
  parseDomainCheck,
  validateName,
} from './domainName'

describe('validateName', () => {
  it.each(['loja', 'minha-loja', 'abc', 'loja2', '2loja', 'a'.repeat(NAME_MAX_LENGTH)])(
    'aceita "%s"',
    (name) => {
      expect(validateName(name)).toEqual({ ok: true, name })
    },
  )

  it('ignora espaços nas pontas e maiúsculas', () => {
    expect(validateName('  Minha-Loja ')).toEqual({ ok: true, name: 'minha-loja' })
    expect(validateName('loja\n')).toEqual({ ok: true, name: 'loja' })
  })

  it.each([
    ['', 'empty'],
    ['   ', 'empty'],
    ['ab', 'short'],
    ['a'.repeat(NAME_MAX_LENGTH + 1), 'long'],
    ['loja.com', 'characters'],
    ['minha loja', 'characters'],
    ['loja_boa', 'characters'],
    ['lojão', 'characters'],
    ['loja/x', 'characters'],
    ['-loja', 'hyphen'],
    ['loja-', 'hyphen'],
    ['minha--loja', 'hyphen'],
  ])('recusa "%s" (%s)', (raw, problem) => {
    const result = validateName(raw)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.problem).toBe(problem)
      expect(result.message.length).toBeGreaterThan(0)
    }
  })

  it('não deixa passar caracteres perigosos para a consulta', () => {
    for (const raw of ['a/../b', 'a?b=c', 'a#b', 'a%2fb', '<script>', 'a b', "a'b", 'a;b']) {
      expect(validateName(raw).ok, raw).toBe(false)
    }
  })
})

describe('nomes reservados', () => {
  it('reconhece nomes reservados sem diferenciar maiúsculas', () => {
    expect(isReservedName('www')).toBe(true)
    expect(isReservedName('Admin')).toBe(true)
    expect(isReservedName('portfolio')).toBe(true)
    expect(isReservedName('minha-loja')).toBe(false)
  })
})

describe('endereço', () => {
  it('monta o endereço completo com o domínio da conta', () => {
    expect(DOMAIN_SUFFIX).toBe('axeldev.workers.dev')
    expect(fullAddress('loja')).toBe('loja.axeldev.workers.dev')
    expect(normalizeName(' LOJA ')).toBe('loja')
  })
})

describe('parseDomainCheck', () => {
  it('lê as respostas válidas do servidor', () => {
    expect(parseDomainCheck({ status: 'available', name: 'loja' })).toEqual({
      status: 'available',
      name: 'loja',
    })
    expect(parseDomainCheck({ status: 'taken', name: 'loja' })?.status).toBe('taken')
    expect(parseDomainCheck({ status: 'reserved', name: 'www' })?.status).toBe('reserved')
    expect(parseDomainCheck({ status: 'invalid', message: 'x' })?.status).toBe('invalid')
    expect(parseDomainCheck({ status: 'rate_limited' })?.status).toBe('rate_limited')
    expect(parseDomainCheck({ status: 'unavailable' })?.status).toBe('unavailable')
  })

  it.each([
    null,
    undefined,
    'available',
    42,
    [],
    {},
    { status: 'available' },
    { status: 'available', name: 42 },
    { status: 'available', name: 'nome inválido!' },
    { status: 'livre', name: 'loja' },
    { status: 'invalid' },
  ])('trata %j como resposta inválida, nunca como "livre"', (value) => {
    expect(parseDomainCheck(value)).toBeNull()
  })
})
