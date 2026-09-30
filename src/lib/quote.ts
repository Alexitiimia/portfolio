import type { QuoteItem } from '@/content/quote'
import type { HttpsUrl } from '@/lib/url'

export const NAME_MAX_LENGTH = 60
export const NAME_MIN_LENGTH = 2
export const DETAILS_MAX_LENGTH = 600

export interface PriceSummary {
  /** Soma dos itens que têm preço. */
  readonly known: number
  /** Quantos itens escolhidos estão "sob consulta". */
  readonly pending: number
}

/** Textos que aparecem no resumo e na mensagem do orçamento (um conjunto por idioma). */
export interface QuoteText {
  readonly greeting: string
  readonly name: string
  readonly project: string
  readonly toBeDefined: string
  readonly extras: string
  readonly estimate: string
  readonly deadline: string
  readonly about: string
  /** Total quando nenhum item tem preço. */
  readonly toArrange: string
  /** Depois do valor: "R$ 1.500 + itens sob consulta". */
  readonly plusOnRequest: string
  readonly onRequest: string
  readonly missingProject: string
  readonly missingName: string
  /** Liga os campos que faltam: " e ". */
  readonly and: string
}

/** Português, o idioma original: é o usado quando nenhum outro é pedido. */
export const PT_QUOTE_TEXT: QuoteText = {
  greeting: 'Olá! Vim pelo seu portfólio e montei um orçamento.',
  name: 'Nome',
  project: 'Projeto',
  toBeDefined: 'a definir',
  extras: 'Extras',
  estimate: 'Estimativa',
  deadline: 'Prazo',
  about: 'Sobre o projeto',
  toArrange: 'a combinar',
  plusOnRequest: 'itens sob consulta',
  onRequest: 'sob consulta',
  missingProject: 'o tipo de projeto',
  missingName: 'seu nome',
  and: ' e ',
}

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/** "R$ 1.500" (o espaço é o espaço "sem quebra" do Intl). */
export function formatBRL(value: number): string {
  return brl.format(value)
}

export function priceSummary(items: readonly QuoteItem[]): PriceSummary {
  let known = 0
  let pending = 0
  for (const item of items) {
    if (item.price === null) pending += 1
    else known += item.price
  }
  return { known, pending }
}

/** Texto do total: "R$ 1.500", "R$ 1.500 + itens sob consulta" ou "a combinar". */
export function describePrice(
  { known, pending }: PriceSummary,
  text: QuoteText = PT_QUOTE_TEXT,
): string {
  if (known === 0) return text.toArrange
  return pending > 0 ? `${formatBRL(known)} + ${text.plusOnRequest}` : formatBRL(known)
}

export function priceLabel(item: QuoteItem, text: QuoteText = PT_QUOTE_TEXT): string {
  return item.price === null ? text.onRequest : formatBRL(item.price)
}

/** Tira caracteres de controle e espaços repetidos; corta no limite. */
export function cleanText(value: string, maxLength: number): string {
  // eslint-disable-next-line no-control-regex -- é justamente para remover caracteres de controle
  const withoutControl = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  return withoutControl
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export interface QuoteInput {
  readonly project: QuoteItem | null
  readonly extras: readonly QuoteItem[]
  readonly deadlineLabel: string
  readonly name: string
  readonly details: string
}

export function isReady(input: Pick<QuoteInput, 'project' | 'name'>): boolean {
  return input.project !== null && cleanText(input.name, NAME_MAX_LENGTH).length >= NAME_MIN_LENGTH
}

/** O que falta para poder enviar (vazio quando está pronto). */
export function missingFields(
  input: Pick<QuoteInput, 'project' | 'name'>,
  text: QuoteText = PT_QUOTE_TEXT,
): string[] {
  const missing: string[] = []
  if (input.project === null) missing.push(text.missingProject)
  if (cleanText(input.name, NAME_MAX_LENGTH).length < NAME_MIN_LENGTH)
    missing.push(text.missingName)
  return missing
}

/** Mensagem pronta para o WhatsApp (asteriscos = negrito no WhatsApp). */
export function buildMessage(input: QuoteInput, text: QuoteText = PT_QUOTE_TEXT): string {
  const chosen = input.project === null ? [...input.extras] : [input.project, ...input.extras]
  const total = describePrice(priceSummary(chosen), text)
  const lines = [text.greeting, '']
  lines.push(`*${text.name}:* ${cleanText(input.name, NAME_MAX_LENGTH)}`)
  lines.push(`*${text.project}:* ${input.project?.label ?? text.toBeDefined}`)
  if (input.extras.length > 0) {
    lines.push(`*${text.extras}:*`)
    for (const extra of input.extras) {
      lines.push(`- ${extra.label} (${priceLabel(extra, text)})`)
    }
  }
  lines.push(`*${text.estimate}:* ${total}`)
  lines.push(`*${text.deadline}:* ${input.deadlineLabel}`)
  const details = cleanText(input.details, DETAILS_MAX_LENGTH)
  if (details !== '') lines.push(`*${text.about}:*`, details)
  return lines.join('\n')
}

/** Link para abrir a conversa no Instagram (`ig.me`), a partir do link do perfil. */
export function instagramDmUrl(profileUrl: string): HttpsUrl | null {
  try {
    const url = new URL(profileUrl)
    if (url.protocol !== 'https:' || !/(^|\.)instagram\.com$/.test(url.hostname)) return null
    const user = url.pathname.split('/').find((part) => part !== '')
    return user !== undefined && /^[\w.]{1,30}$/.test(user) ? `https://ig.me/m/${user}` : null
  } catch {
    return null
  }
}
