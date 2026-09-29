import type { HttpsUrl } from '@/lib/url'
import { site } from './site'

export interface ProjectLink {
  readonly label: string
  readonly href: HttpsUrl
}

export interface Project {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly name: string
  readonly summary: string
  /** Tecnologias em texto livre. */
  readonly stack: readonly string[]
  readonly year: number
  /** Vazio quando o projeto não tem link público. */
  readonly links: readonly ProjectLink[]
}

/**
 * Para adicionar um projeto, acrescente um item à lista. A ordem aqui é a ordem na página.
 * Só coloque links públicos: o site inteiro é aberto a qualquer pessoa.
 */
export const projects: readonly Project[] = [
  {
    id: 'portfolio',
    name: 'Este portfólio',
    summary:
      'Site estático em React e TypeScript, publicado na Cloudflare, com política de segurança de conteúdo (CSP), testes automatizados e verificação de acessibilidade.',
    stack: ['React', 'TypeScript', 'Vite', 'Cloudflare'],
    year: 2026,
    links: [{ label: 'Código-fonte', href: site.links.repository }],
  },
  {
    id: 'operacao-arvoredo',
    name: 'Operação Arvoredo',
    summary:
      'Página de evento em HTML, CSS e JavaScript puros, sem build e sem dependências: confirmação de presença por WhatsApp, controle de vagas e a lista do que o grupo vai levar.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    year: 2026,
    links: [],
  },
]
