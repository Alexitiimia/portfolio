/*
  Regras dos endereços grátis (`nome.axeldev.workers.dev`), compartilhadas entre a página e o Worker
  da verificação (worker/). Só funções puras e tipos: nada de DOM nem de React aqui, porque o
  Worker também importa este arquivo.
*/

/** Parte fixa do endereço: o subdomínio da conta na Cloudflare mais o domínio dos Workers. */
export const DOMAIN_SUFFIX = 'axeldev.workers.dev'

export const NAME_MIN_LENGTH = 3
export const NAME_MAX_LENGTH = 30

/** Nomes que não se oferecem a clientes, mesmo que ainda não existam na conta. */
const RESERVED_NAMES: ReadonlySet<string> = new Set([
  'admin',
  'api',
  'app',
  'assets',
  'auth',
  'blog',
  'cdn',
  'corvo',
  'dashboard',
  'dev',
  'email',
  'ftp',
  'login',
  'loja',
  'mail',
  'painel',
  'portfolio',
  'root',
  'shop',
  'smtp',
  'staging',
  'static',
  'suporte',
  'support',
  'test',
  'www',
])

export type NameProblem = 'empty' | 'short' | 'long' | 'characters' | 'hyphen'

const PROBLEM_MESSAGES: Readonly<Record<NameProblem, string>> = {
  empty: 'Digite o nome que você quer para o seu site.',
  short: `Use pelo menos ${String(NAME_MIN_LENGTH)} caracteres.`,
  long: `Use no máximo ${String(NAME_MAX_LENGTH)} caracteres.`,
  characters: 'Use só letras sem acento, números e hífen (-).',
  hyphen: 'O hífen não pode ficar no começo, no fim nem aparecer duas vezes seguidas.',
}

export type NameValidation =
  | { readonly ok: true; readonly name: string }
  | { readonly ok: false; readonly problem: NameProblem; readonly message: string }

/** Tira espaços das pontas e passa para minúsculas, como o DNS trata os nomes. */
export function normalizeName(raw: string): string {
  return raw.trim().toLowerCase()
}

function invalid(problem: NameProblem): NameValidation {
  return { ok: false, problem, message: PROBLEM_MESSAGES[problem] }
}

/** Confere se o texto é um nome válido de endereço (letras, números e hífens no meio). */
export function validateName(raw: string): NameValidation {
  const name = normalizeName(raw)

  if (name.length === 0) return invalid('empty')
  if (!/^[a-z0-9-]+$/.test(name)) return invalid('characters')
  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) return invalid('hyphen')
  if (name.length < NAME_MIN_LENGTH) return invalid('short')
  if (name.length > NAME_MAX_LENGTH) return invalid('long')

  return { ok: true, name }
}

export function isReservedName(name: string): boolean {
  return RESERVED_NAMES.has(normalizeName(name))
}

/** Endereço completo, sem o `https://`. */
export function fullAddress(name: string): string {
  return `${name}.${DOMAIN_SUFFIX}`
}

/** Resposta da verificação, igual para o Worker (que envia) e para a página (que lê). */
export type DomainCheck =
  | { readonly status: 'available'; readonly name: string }
  | { readonly status: 'taken'; readonly name: string }
  | { readonly status: 'reserved'; readonly name: string }
  | { readonly status: 'invalid'; readonly message: string }
  | { readonly status: 'rate_limited' }
  | { readonly status: 'unavailable' }

const NAMED_STATUSES = ['available', 'taken', 'reserved'] as const

/**
 * Lê a resposta do servidor sem confiar nela: qualquer formato inesperado vira `null`, e a página
 * trata como "não consegui verificar" (nunca como "livre").
 */
export function parseDomainCheck(value: unknown): DomainCheck | null {
  if (typeof value !== 'object' || value === null) return null
  const data = value as Record<string, unknown>
  const status = data.status

  for (const named of NAMED_STATUSES) {
    if (status === named) {
      const name = data.name
      return typeof name === 'string' && validateName(name).ok ? { status: named, name } : null
    }
  }
  if (status === 'invalid') {
    const message = data.message
    return typeof message === 'string' ? { status, message } : null
  }
  if (status === 'rate_limited' || status === 'unavailable') return { status }
  return null
}
