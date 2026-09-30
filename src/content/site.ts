import { EyeOff, FileLock2, Lock, type LucideIcon } from 'lucide-react'
import type { IsoDate } from '@/lib/age'
import type { HttpsUrl } from '@/lib/url'

/** Trecho do título principal: texto comum ou palavra em destaque (barra com cores invertidas). */
export type HeadlineSegment = string | { readonly mark: string }

/** Uma garantia de segurança do próprio site, mostrada no rodapé. */
export interface SecurityFact {
  readonly label: string
  readonly icon: LucideIcon
}

interface SiteConfig {
  /** Nome da marca, exibido ao lado do corvo. */
  readonly name: string
  /** Assinatura curta abaixo do nome. */
  readonly tagline: string
  /** Quem assina o site. A idade é calculada a partir da data de nascimento. */
  readonly person: {
    readonly name: string
    readonly birthDate: IsoDate
  }
  /** Faixa fina no topo da página, no estilo de terminal. */
  readonly statusBar: {
    readonly left: string
    readonly prompt: string
    readonly command: string
    readonly result: string
  }
  readonly hero: {
    /** Comando digitado no "terminal" acima do título. */
    readonly command: string
    /** Resposta do comando: o que faço, em uma linha. */
    readonly role: string
    readonly headline: readonly HeadlineSegment[]
    readonly lead: string
  }
  readonly footer: {
    readonly about: string
    /** Só afirmações que o próprio site garante (ver test/deploy.test.ts). */
    readonly securityFacts: readonly SecurityFact[]
    readonly closing: string
  }
  readonly links: {
    readonly github: HttpsUrl
    readonly repository: HttpsUrl
  }
}

export const site: SiteConfig = {
  name: 'CORVO',
  tagline: 'DEV // CYBERSEC',
  person: {
    name: 'Endrily Axel',
    birthDate: '2006-03-29',
  },
  statusBar: {
    left: 'CANAL SEGURO · TLS 1.3 · HSTS',
    prompt: 'operador@corvo:~$',
    command: 'status --all',
    result: 'ok',
  },
  hero: {
    command: 'whoami',
    role: 'full stack · segurança da informação',
    headline: ['Sistemas web ', { mark: 'seguros' }, ', do banco de dados à interface.'],
    lead: 'Crio lojas virtuais, sistemas de gestão financeira e automações, com análise de segurança. Front-end e back-end, do protótipo ao suporte 24h.',
  },
  footer: {
    about: 'Desenvolvimento web seguro e análise de segurança. Código auditável, zero ruído.',
    securityFacts: [
      { label: 'HTTPS + HSTS', icon: Lock },
      { label: 'CSP estrita', icon: FileLock2 },
      { label: 'Sem rastreadores', icon: EyeOff },
    ],
    closing: '$ echo "nevermore"',
  },
  links: {
    github: 'https://github.com/Alexitiimia',
    repository: 'https://github.com/Alexitiimia/portfolio',
  },
}
