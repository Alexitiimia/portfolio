import { describe, expect, it } from 'vitest'
import { quoteCatalog, type QuoteItem } from '@/content/quote'
import {
  DETAILS_MAX_LENGTH,
  buildMessage,
  cleanText,
  describePrice,
  formatBRL,
  instagramDmUrl,
  isReady,
  missingFields,
  priceLabel,
  priceSummary,
} from './quote'

const item = (id: string, price: number | null): QuoteItem => ({
  id,
  label: `Item ${id}`,
  description: 'x',
  price,
})
const plain = (text: string) => text.replaceAll(' ', ' ')

describe('preços', () => {
  it('soma os itens com preço e conta os "sob consulta"', () => {
    expect(priceSummary([item('a', 100), item('b', null), item('c', 250)])).toEqual({
      known: 350,
      pending: 1,
    })
    expect(priceSummary([])).toEqual({ known: 0, pending: 0 })
  })

  it('descreve o total sem inventar valores', () => {
    expect(describePrice({ known: 0, pending: 0 })).toBe('a combinar')
    expect(describePrice({ known: 0, pending: 3 })).toBe('a combinar')
    expect(plain(describePrice({ known: 1500, pending: 0 }))).toBe('R$ 1.500')
    expect(plain(describePrice({ known: 1500, pending: 2 }))).toBe('R$ 1.500 + itens sob consulta')
  })

  it('formata em reais e rotula item sem preço', () => {
    expect(plain(formatBRL(2500))).toBe('R$ 2.500')
    expect(priceLabel(item('a', null))).toBe('sob consulta')
    expect(plain(priceLabel(item('a', 90)))).toBe('R$ 90')
  })
})

describe('cleanText', () => {
  it('tira controles e espaços repetidos e respeita o limite', () => {
    expect(cleanText('  Ana \u0000\u0007  Silva \t ', 50)).toBe('Ana Silva')
    expect(cleanText('abcdef', 3)).toBe('abc')
  })

  it('mantém quebras de linha e acentos', () => {
    expect(cleanText('linha 1\nlinha 2 ç', 50)).toBe('linha 1\nlinha 2 ç')
  })
})

describe('prontidão', () => {
  const project = item('p', null)

  it('exige tipo de projeto e nome com 2+ caracteres', () => {
    expect(isReady({ project, name: 'Jo' })).toBe(true)
    expect(isReady({ project: null, name: 'Joana' })).toBe(false)
    expect(isReady({ project, name: ' J ' })).toBe(false)
    expect(missingFields({ project: null, name: '' })).toEqual(['o tipo de projeto', 'seu nome'])
    expect(missingFields({ project, name: 'Joana' })).toEqual([])
  })
})

describe('buildMessage', () => {
  const base = {
    project: item('loja', 1000),
    extras: [item('frete', 200), item('logo', null)],
    deadlineLabel: 'Urgente',
    name: '  Joana   Souza ',
    details: 'Preciso de uma loja de velas.',
  }

  it('monta a mensagem completa', () => {
    const message = plain(buildMessage(base))

    expect(message).toContain('*Nome:* Joana Souza')
    expect(message).toContain('*Projeto:* Item loja')
    expect(message).toContain('- Item frete (R$ 200)')
    expect(message).toContain('- Item logo (sob consulta)')
    expect(message).toContain('*Estimativa:* R$ 1.200 + itens sob consulta')
    expect(message).toContain('*Prazo:* Urgente')
    expect(message).toContain('*Sobre o projeto:*\nPreciso de uma loja de velas.')
  })

  it('omite extras e detalhes vazios', () => {
    const message = buildMessage({ ...base, extras: [], details: '   ' })

    expect(message).not.toContain('*Extras:*')
    expect(message).not.toContain('*Sobre o projeto:*')
  })

  it('não estoura o limite de detalhes', () => {
    const message = buildMessage({ ...base, details: 'a'.repeat(5000) })

    expect(message.length).toBeLessThan(DETAILS_MAX_LENGTH + 500)
  })

  it('funciona com todos os itens do catálogo real (ainda sem preço)', () => {
    const message = buildMessage({
      ...base,
      project: quoteCatalog.projects[0] ?? null,
      extras: quoteCatalog.extras,
    })

    expect(message).toContain('*Estimativa:* a combinar')
  })
})

describe('instagramDmUrl', () => {
  it('converte o perfil em link de conversa', () => {
    expect(instagramDmUrl('https://www.instagram.com/antigo.dont/')).toBe(
      'https://ig.me/m/antigo.dont',
    )
  })

  it.each([
    'http://www.instagram.com/x/',
    'https://evil.com/instagram.com/x',
    'https://instagram.com.evil.com/x',
    'https://www.instagram.com/',
    'javascript:alert(1)',
    'nao é url',
  ])('recusa %j', (value) => {
    expect(instagramDmUrl(value)).toBeNull()
  })
})
