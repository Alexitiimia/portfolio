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
      'Loja online de peças impressas em 3D: carrinho, favoritos, conta de cliente, pagamento pelo Mercado Pago, frete pelo Melhor Envio e pedido de orçamento sob medida. Tem painel de administração com financeiro, precificação e orçamento em PDF.',
    stack: ['JavaScript', 'Supabase', 'Mercado Pago', 'Melhor Envio', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Ver a loja', href: 'https://f-cordeiro.axeldev.workers.dev/' }],
  },
  {
    id: 'f-cordeiro-bot',
    name: 'Bot do Discord da F Cordeiro',
    summary:
      'Liga a conta do cliente no site ao Discord, dá cargos automáticos (vinculado, comprador, afiliado) e faz sorteios criados pelo painel, só para contas vinculadas. O site fala com o bot por chamadas assinadas (HMAC) e o sorteio roda no banco, sem sortear duas vezes.',
    stack: ['Node.js', 'discord.js', 'Supabase', 'Railway'],
    year: 2026,
    links: [],
  },
  {
    id: 'vila-cartola',
    name: 'Vila Cartola',
    summary:
      'Comunidade de Minecraft com jogo entre Java e Bedrock. O site tem login com Discord, mapa 3D ao vivo, ranking, loja e assinatura de apoiador com Mercado Pago. Por trás: servidor em Docker com backups, plugins próprios em Java (economia, social e verificação), bot de boas-vindas e painel de admin.',
    stack: ['JavaScript', 'Java', 'Python', 'Docker', 'Mercado Pago', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Ver o site', href: 'https://vilacartola.com/' }],
  },
  {
    id: 'pure-tone-check',
    name: 'Pure Tone Check',
    summary:
      'Triagem auditiva online e gratuita, em inglês: toca tons puros em cinco frequências, um ouvido por vez, e entrega um gráfico com o resultado, que pode ser baixado em PDF. Um Worker guarda o histórico por e-mail e barra spam com armadilha invisível e lista de e-mails descartáveis.',
    stack: ['JavaScript', 'Web Audio', 'Supabase', 'MailerLite', 'Cloudflare'],
    year: 2025,
    links: [{ label: 'Fazer o teste', href: 'https://puretonecheck.com/' }],
  },
  {
    id: 'allmaretro',
    name: 'Allmaretro',
    summary:
      'Protótipo de loja e painel para um brechó: vitrine com filtros, sacola com reserva por tempo, frete simulado, Pix com código e QR gerados no próprio navegador, e painel do lojista com calculadora de preço, pedidos, financeiro e impostos do MEI. Tudo simulado, sem backend.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Pix'],
    year: 2026,
    links: [],
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
  {
    id: 'portfolio',
    name: 'Este portfólio',
    summary:
      'Site estático em React e TypeScript, publicado na Cloudflare, com política de segurança de conteúdo (CSP), testes automatizados e verificação de acessibilidade.',
    stack: ['React', 'TypeScript', 'Vite', 'Cloudflare'],
    year: 2026,
    links: [{ label: 'Código-fonte', href: site.links.repository }],
  },
]
