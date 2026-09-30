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
    id: 'f-cordeiro',
    name: 'F Cordeiro Soluções 3D',
    summary:
      'Loja online de peças impressas em 3D, com carrinho, favoritos, conta de cliente, pagamento pelo Mercado Pago, cálculo de frete para todo o Brasil e pedido de orçamento sob medida.',
    stack: ['JavaScript', 'Supabase', 'Mercado Pago', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Ver a loja', href: 'https://f-cordeiro.axeldev.workers.dev/' }],
  },
  {
    id: 'vila-cartola',
    name: 'Vila Cartola',
    summary:
      'Site de um servidor de Minecraft com jogo entre Java e Bedrock: login com Discord para entrar na whitelist, mapa 3D ao vivo do mundo, ranking e área de apoiadores.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Discord', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Ver o site', href: 'https://vilacartola.com/' }],
  },
  {
    id: 'pure-tone-check',
    name: 'Pure Tone Check',
    summary:
      'Triagem auditiva online e gratuita, em inglês: toca tons puros em cinco frequências, um ouvido por vez, e entrega um gráfico com o resultado, que pode ser baixado em PDF.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Web Audio', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Fazer o teste', href: 'https://puretonecheck.com/' }],
  },
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
