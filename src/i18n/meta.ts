import {
  LANG_INFO,
  LANGS,
  SITE_ORIGIN,
  pageAlternates,
  pagePath,
  type Lang,
  type PageId,
} from './lang.ts'

/*
  Textos do <head> de cada página e idioma: título da aba, descrição, prévia de link (og:*) e o
  aviso de "precisa de JavaScript". O Vite usa isto para gerar o HTML de cada idioma (ver
  vite.i18n.ts); a página em si lê os textos em src/i18n/ui.ts.
*/

interface PageMeta {
  /** Título da aba do navegador e da prévia do link. */
  readonly title: string
  readonly description: string
  readonly imageAlt: string
  /** Aviso para quem está sem JavaScript. */
  readonly noscript: string
  /** Texto do link do aviso (para o GitHub ou de volta ao portfólio). */
  readonly noscriptLink: string
}

const META: Readonly<Record<PageId, Readonly<Record<Lang, PageMeta>>>> = {
  home: {
    pt: {
      title: 'Endriky Axel · Dev Full Stack e Segurança | The Crow',
      description:
        'Endriky Axel, dev full stack e de segurança. Sites de vendas, gestão financeira, automações e análise de segurança. Domínio grátis por 1 ano e suporte 24h.',
      imageAlt:
        'The Crow: sistemas web seguros, do banco de dados à interface. Por Endriky Axel, full stack e segurança da informação. Ao lado, a cabeça de um corvo em pixel art com o olho vermelho.',
      noscript: 'Este site precisa de JavaScript para funcionar.',
      noscriptLink: 'github.com/Alexitiimia',
    },
    en: {
      title: 'Endriky Axel · Full Stack Dev & Security | The Crow',
      description:
        'Endriky Axel, full stack and security developer. Sales websites, financial management, automations and security analysis. Free domain for 1 year and 24/7 support.',
      imageAlt:
        'The Crow: secure web systems, from the database to the interface. By Endriky Axel, full stack and information security. Beside it, the head of a pixel-art crow with a red eye.',
      noscript: 'This site needs JavaScript to work.',
      noscriptLink: 'github.com/Alexitiimia',
    },
    es: {
      title: 'Endriky Axel · Dev Full Stack y Seguridad | The Crow',
      description:
        'Endriky Axel, dev full stack y de seguridad. Sitios de ventas, gestión financiera, automatizaciones y análisis de seguridad. Dominio gratis por 1 año y soporte 24 h.',
      imageAlt:
        'The Crow: sistemas web seguros, de la base de datos a la interfaz. Por Endriky Axel, full stack y seguridad de la información. Al lado, la cabeza de un cuervo en pixel art con el ojo rojo.',
      noscript: 'Este sitio necesita JavaScript para funcionar.',
      noscriptLink: 'github.com/Alexitiimia',
    },
  },
  quote: {
    pt: {
      title: 'Orçamento · The Crow',
      description:
        'Monte o orçamento do seu site, loja ou sistema, veja a estimativa e envie o resumo pronto para o WhatsApp. Sem cadastro e sem pagar nada agora.',
      imageAlt:
        'Orçamento The Crow: monte o orçamento do seu projeto, sem cadastro. Ao lado, a cabeça de um corvo em pixel art com o olho vermelho.',
      noscript: 'Esta página precisa de JavaScript para funcionar.',
      noscriptLink: 'Voltar ao portfólio',
    },
    en: {
      title: 'Quote · The Crow',
      description:
        'Build a quote for your website, store or system, see the estimate and send the ready-made summary to WhatsApp. No sign-up and nothing to pay now.',
      imageAlt:
        'The Crow quote: build a quote for your project, no sign-up. Beside it, the head of a pixel-art crow with a red eye.',
      noscript: 'This page needs JavaScript to work.',
      noscriptLink: 'Back to the portfolio',
    },
    es: {
      title: 'Presupuesto · The Crow',
      description:
        'Arma el presupuesto de tu sitio, tienda o sistema, mira la estimación y envía el resumen listo por WhatsApp. Sin registro y sin pagar nada ahora.',
      imageAlt:
        'Presupuesto The Crow: arma el presupuesto de tu proyecto, sin registro. Al lado, la cabeza de un cuervo en pixel art con el ojo rojo.',
      noscript: 'Esta página necesita JavaScript para funcionar.',
      noscriptLink: 'Volver al portafolio',
    },
  },
}

/**
 * Imagem da prévia do link (1200x630), em public/. Igual em todos os idiomas.
 * O `?v=` força WhatsApp, Discord, bio.site etc. a buscarem a imagem de novo; some um número a cada troca.
 */
const OG_IMAGE: Readonly<Record<PageId, string>> = {
  home: 'og-image.png?v=2',
  quote: 'og-orcamento.png?v=2',
}

/** Perfis públicos que já aparecem na seção Contato (src/content/contact.ts e site.ts). */
const PROFILES = [
  'https://github.com/Alexitiimia',
  'https://www.linkedin.com/in/endriky-657a89197/',
  'https://www.instagram.com/antigo.dont/',
] as const

/**
 * Dados estruturados (schema.org) da página inicial: dizem ao Google quem é a pessoa, qual é o site e
 * onde estão os perfis dela. Não entram telefone, e-mail nem data de nascimento de propósito.
 */
function homeJsonLd(lang: Lang, url: string, description: string): string {
  const jobTitle = {
    pt: 'Desenvolvedor full stack e de segurança da informação',
    en: 'Full stack and information security developer',
    es: 'Desarrollador full stack y de seguridad de la información',
  }[lang]
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: 'The Crow',
        inLanguage: LANG_INFO[lang].htmlLang,
        publisher: { '@id': `${SITE_ORIGIN}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_ORIGIN}/#person`,
        name: 'Endriky Axel',
        alternateName: 'The Crow',
        jobTitle,
        description,
        url,
        image: `${SITE_ORIGIN}/icon-512.png`,
        sameAs: PROFILES,
        knowsAbout: ['React', 'TypeScript', 'Node.js', 'Cybersecurity', 'Web development'],
      },
    ],
  }
  // "<" vira < para que nenhum texto consiga fechar a tag <script> antes da hora.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

export function pageMeta(lang: Lang, page: PageId): PageMeta {
  return META[page][lang]
}

/** Valores que preenchem os `{{marcadores}}` dos modelos index.html e orcamento/index.html. */
export function pageTokens(lang: Lang, page: PageId): Readonly<Record<string, string>> {
  const meta = pageMeta(lang, page)
  const url = `${SITE_ORIGIN}${pagePath(lang, page)}`
  const image = `${SITE_ORIGIN}/${OG_IMAGE[page]}`
  const alternates = [
    ...pageAlternates(page).map(
      ({ lang: other, path }) =>
        `<link rel="alternate" hreflang="${LANG_INFO[other].htmlLang}" href="${SITE_ORIGIN}${path}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${pagePath('pt', page)}" />`,
  ].join('\n    ')
  const otherLocales = LANGS.filter((other) => other !== lang)
    .map(
      (other) => `<meta property="og:locale:alternate" content="${LANG_INFO[other].ogLocale}" />`,
    )
    .join('\n    ')

  return {
    lang: LANG_INFO[lang].htmlLang,
    title: meta.title,
    description: meta.description,
    url,
    image,
    imageAlt: meta.imageAlt,
    ogLocale: LANG_INFO[lang].ogLocale,
    ogLocaleAlternates: otherLocales,
    alternates,
    jsonLd: page === 'home' ? homeJsonLd(lang, url, meta.description) : '',
    noscript: meta.noscript,
    noscriptLink: meta.noscriptLink,
    noscriptHref: page === 'home' ? 'https://github.com/Alexitiimia' : pagePath(lang, 'home'),
  }
}
