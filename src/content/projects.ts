import fCordeiroIcon from '@/assets/projects/f-cordeiro.svg'
import pureToneCheckIcon from '@/assets/projects/pure-tone-check.svg'
import vilaCartolaIcon from '@/assets/projects/vila-cartola.png'
import type { HttpsUrl } from '@/lib/url'

export interface ProjectLink {
  readonly label: string
  readonly href: HttpsUrl
}

export interface Project {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly name: string
  /** Favicon do site do projeto, em `src/assets/projects/`. Fica no próprio site (a CSP só libera imagens daqui). */
  readonly icon: string
  readonly summary: string
  /** Tecnologias em texto livre. */
  readonly stack: readonly string[]
  readonly year: number
  /** Viram botões. Vazio quando o projeto não tem link público. */
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
    icon: fCordeiroIcon,
    summary:
      'Loja online de peças impressas em 3D: carrinho, favoritos, conta de cliente, pagamento pelo Mercado Pago, frete pelo Melhor Envio e pedido de orçamento sob medida. Tem painel de administração com financeiro, precificação e orçamento em PDF. Inclui uma comunidade automatizada no Discord, via bot: liga a conta do cliente ao servidor, dá cargos automáticos (vinculado, comprador, afiliado) e faz sorteios só para contas vinculadas.',
    stack: [
      'JavaScript',
      'Node.js',
      'discord.js',
      'Supabase',
      'Mercado Pago',
      'Melhor Envio',
      'Railway',
      'Cloudflare',
    ],
    year: 2025,
    links: [{ label: 'Ver a loja', href: 'https://f-cordeiro.axeldev.workers.dev/' }],
  },
  {
    id: 'vila-cartola',
    name: 'Vila Cartola',
    icon: vilaCartolaIcon,
    summary:
      'Comunidade de Minecraft com jogo entre Java e Bedrock. O site tem login com Discord, mapa 3D ao vivo, ranking, loja e assinatura de apoiador com Mercado Pago. Por trás: servidor em Docker com backups, plugins próprios em Java (economia, social e verificação), bot de boas-vindas e painel de admin.',
    stack: ['JavaScript', 'Java', 'Python', 'Docker', 'Mercado Pago', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Ver o site', href: 'https://vilacartola.com/' }],
  },
  {
    id: 'pure-tone-check',
    name: 'Pure Tone Check',
    icon: pureToneCheckIcon,
    summary:
      'Triagem auditiva online e gratuita, em inglês: toca tons puros em cinco frequências, um ouvido por vez, e entrega um gráfico com o resultado, que pode ser baixado em PDF. Um Worker guarda o histórico por e-mail e barra spam com armadilha invisível e lista de e-mails descartáveis.',
    stack: ['JavaScript', 'Web Audio', 'Supabase', 'MailerLite', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Fazer o teste', href: 'https://puretonecheck.com/' }],
  },
]
