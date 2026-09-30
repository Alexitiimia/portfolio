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
export function describePrice({ known, pending }: PriceSummary): string {
  if (known === 0) return 'a combinar'
  return pending > 0 ? `${formatBRL(known)} + itens sob consulta` : formatBRL(known)
}

export function priceLabel(item: QuoteItem): string {
  return item.price === null ? 'sob consulta' : formatBRL(item.price)
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
export function missingFields(input: Pick<QuoteInput, 'project' | 'name'>): string[] {
  const missing: string[] = []
  if (input.project === null) missing.push('o tipo de projeto')
  if (cleanText(input.name, NAME_MAX_LENGTH).length < NAME_MIN_LENGTH) missing.push('seu nome')
  return missing
}

/** Mensagem pronta para o WhatsApp (asteriscos = negrito no WhatsApp). */
export function buildMessage(input: QuoteInput): string {
  const chosen = input.project === null ? [...input.extras] : [input.project, ...input.extras]
  const total = describePrice(priceSummary(chosen))
  const lines = ['Olá! Vim pelo seu portfólio e montei um orçamento.', '']
  lines.push(`*Nome:* ${cleanText(input.name, NAME_MAX_LENGTH)}`)
  lines.push(`*Projeto:* ${input.project?.label ?? 'a definir'}`)
  if (input.extras.length > 0) {
    lines.push('*Extras:*')
    for (const extra of input.extras) lines.push(`- ${extra.label} (${priceLabel(extra)})`)
  }
  lines.push(`*Estimativa:* ${total}`)
  lines.push(`*Prazo:* ${input.deadlineLabel}`)
  const details = cleanText(input.details, DETAILS_MAX_LENGTH)
  if (details !== '') lines.push('*Sobre o projeto:*', details)
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
