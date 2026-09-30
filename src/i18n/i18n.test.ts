import { describe, expect, it } from 'vitest'
import { contentFor } from '@/content/localize'
import { capabilities, methodologies } from '@/content/security'
import { offers } from '@/content/offers'
import { projects } from '@/content/projects'
import { quoteCatalog } from '@/content/quote'
import { SECTION_IDS } from '@/content/sections'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { toolGroups } from '@/content/tools'
import { en } from '@/content/translations/en'
import { es } from '@/content/translations/es'
import type { Translations } from '@/content/translations/types'
import homeTemplate from '../../index.html?raw'
import quoteTemplate from '../../orcamento/index.html?raw'
import { renderPage } from './html'
import {
  LANGS,
  SITE_ORIGIN,
  detectLang,
  langFromPath,
  pageFile,
  pagePath,
  parsePath,
  type Lang,
} from './lang'
import { pageMeta } from './meta'
import { ui } from './ui'

const TRANSLATED: readonly (readonly [Exclude<Lang, 'pt'>, Translations])[] = [
  ['en', en],
  ['es', es],
]

describe('rotas dos idiomas', () => {
  it('cada idioma tem a sua pasta: /pt/, /en/, /es/', () => {
    expect(LANGS.map((lang) => pagePath(lang, 'home'))).toEqual(['/pt/', '/en/', '/es/'])
  })

  it('o orçamento tem o nome da pasta no idioma da página', () => {
    expect(pagePath('pt', 'quote')).toBe('/pt/orcamento/')
    expect(pagePath('en', 'quote')).toBe('/en/quote/')
    expect(pagePath('es', 'quote')).toBe('/es/presupuesto/')
  })

  it('o arquivo gerado fica no mesmo caminho da URL', () => {
    expect(pageFile('en', 'home')).toBe('en/index.html')
    expect(pageFile('es', 'quote')).toBe('es/presupuesto/index.html')
  })

  it.each([
    ['/pt', 'pt', 'home'],
    ['/en/', 'en', 'home'],
    ['/es/presupuesto/', 'es', 'quote'],
    ['/en/quote', 'en', 'quote'],
  ])('lê o idioma e a página de %s', (path, lang, page) => {
    expect(parsePath(path)).toEqual({ lang, page })
  })

  it.each(['/', '/fr/', '/en/orcamento/', '/es/quote/', '/pt/orcamento/x', '/api/dominio'])(
    '%s não é uma página do site',
    (path) => {
      expect(parsePath(path)).toBeNull()
    },
  )

  it('sem prefixo de idioma, vale o português', () => {
    expect(langFromPath('/')).toBe('pt')
    expect(langFromPath('/en/quote/')).toBe('en')
  })
})

describe('idioma do navegador (Accept-Language)', () => {
  it.each([
    [null, 'pt'],
    ['', 'pt'],
    ['pt-BR,pt;q=0.9,en;q=0.8', 'pt'],
    ['en-US,en;q=0.9', 'en'],
    ['es-MX,es;q=0.9', 'es'],
    ['fr-FR,fr;q=0.9,es;q=0.5', 'es'],
    ['fr-FR,de;q=0.9', 'en'],
    ['en;q=0.4, es;q=0.8', 'es'],
    ['*', 'en'],
    ['pt;q=0, en;q=0.5', 'en'],
  ])('"%s" -> %s', (header, expected) => {
    expect(detectLang(header)).toBe(expected)
  })
})

describe('páginas geradas (modelos HTML)', () => {
  const pages = [
    ['home', homeTemplate],
    ['quote', quoteTemplate],
  ] as const

  it.each(
    LANGS.flatMap((lang) => pages.map(([page, template]) => [lang, page, template] as const)),
  )(
    '%s/%s: sem marcador sobrando, com idioma, título e canônico certos',
    (lang, page, template) => {
      const html = renderPage(template, lang, page)
      const meta = pageMeta(lang, page)

      expect(html).not.toContain('{{')
      expect(html).toMatch(/<html lang="(pt-BR|en|es)">/)
      expect(html).toContain(`<title>${meta.title.replaceAll('&', '&amp;')}</title>`)
      expect(html).toContain(
        `<link rel="canonical" href="${SITE_ORIGIN}${pagePath(lang, page)}" />`,
      )
      expect(html).toContain(
        `<script type="module" src="/src/${page === 'home' ? 'main' : 'orcamento'}.tsx">`,
      )
    },
  )

  it('cada página aponta para as três versões (hreflang) e para o padrão (português)', () => {
    const html = renderPage(homeTemplate, 'en', 'home')

    for (const lang of LANGS) {
      expect(html).toContain(
        `hreflang="${lang === 'pt' ? 'pt-BR' : lang}" href="${SITE_ORIGIN}/${lang}/"`,
      )
    }
    expect(html).toContain(`hreflang="x-default" href="${SITE_ORIGIN}/pt/"`)
  })

  it('escapa aspas e sinais nos textos', () => {
    const html = renderPage('<meta content="{{title}}" />', 'en', 'home')

    expect(html).not.toMatch(/content="[^"]*"[^/]*"/)
  })

  it('marcador desconhecido é erro (typo não vai para produção)', () => {
    expect(() => renderPage('{{naoExiste}}', 'pt', 'home')).toThrow(/naoExiste/)
  })

  it('cada idioma tem título e descrição próprios, com a marca no título', () => {
    for (const page of ['home', 'quote'] as const) {
      const titles = LANGS.map((lang) => pageMeta(lang, page).title)
      expect(new Set(titles).size).toBe(3)
      for (const title of titles) expect(title).toContain(site.name)
      for (const lang of LANGS) {
        expect(pageMeta(lang, page).description.length).toBeGreaterThanOrEqual(60)
        expect(pageMeta(lang, page).description.length).toBeLessThanOrEqual(200)
      }
    }
  })
})

describe('traduções do conteúdo: nada fica de fora', () => {
  const ids = (list: readonly { readonly id: string }[]) => list.map((item) => item.id)
  const keys = (record: Record<string, unknown>) => Object.keys(record).sort()

  describe.each(TRANSLATED)('%s', (_lang, t) => {
    it('traz todas as seções, ofertas, projetos, serviços e itens de segurança', () => {
      expect(keys(t.sections)).toEqual([...SECTION_IDS].sort())
      expect(keys(t.offers)).toEqual(ids(offers).sort())
      expect(keys(t.projects)).toEqual(ids(projects).sort())
      expect(keys(t.services)).toEqual(ids(services).sort())
      expect(keys(t.security.methodologies)).toEqual(ids(methodologies).sort())
      expect(keys(t.security.capabilities)).toEqual(ids(capabilities).sort())
    })

    it('traz todos os grupos de ferramentas e as observações que existem em português', () => {
      expect(keys(t.tools.groups)).toEqual(ids(toolGroups).sort())
      const noted = toolGroups
        .flatMap((group) => group.tools)
        .filter((tool) => tool.note !== undefined)
      expect(keys(t.tools.notes)).toEqual(ids(noted).sort())
    })

    it('traz todos os itens e prazos do orçamento', () => {
      const items = [...quoteCatalog.projects, ...quoteCatalog.extras]
      expect(keys(t.quote.items)).toEqual(ids(items).sort())
      expect(keys(t.quote.deadlines)).toEqual(ids(quoteCatalog.deadlines).sort())
    })

    it('tem a mesma quantidade de garantias no rodapé e de rótulos de link por projeto', () => {
      expect(t.site.footer.securityFacts).toHaveLength(site.footer.securityFacts.length)
      for (const project of projects) {
        expect(t.projects[project.id]?.links).toHaveLength(project.links.length)
      }
    })

    it('a suporte técnico traz a faixa dos 30 dias grátis, como em português', () => {
      expect(t.offers.suporte?.callout).toMatch(/30/)
      expect(offers.find((offer) => offer.id === 'suporte')?.callout).toBeDefined()
    })

    it('não deixa nenhum texto vazio', () => {
      const texts: string[] = []
      const walk = (value: unknown) => {
        if (typeof value === 'string') texts.push(value)
        else if (Array.isArray(value)) value.forEach(walk)
        else if (typeof value === 'object' && value !== null) Object.values(value).forEach(walk)
      }
      walk(t)

      expect(texts.length).toBeGreaterThan(100)
      for (const text of texts) expect(text.trim(), 'texto vazio').not.toBe('')
    })
  })
})

describe('conteúdo entregue a cada idioma', () => {
  it('o português é o conteúdo original, sem alteração', () => {
    const pt = contentFor('pt')

    expect(pt.site).toBe(site)
    expect(pt.projects).toBe(projects)
    expect(pt.offers).toBe(offers)
  })

  it.each(['en', 'es'] as const)('%s mantém ids, ícones e links, e só troca o texto', (lang) => {
    const translated = contentFor(lang)

    expect(translated.projects.map((p) => p.id)).toEqual(projects.map((p) => p.id))
    expect(translated.projects.map((p) => p.links.map((l) => l.href))).toEqual(
      projects.map((p) => p.links.map((l) => l.href)),
    )
    expect(translated.services.map((s) => s.icon)).toEqual(services.map((s) => s.icon))
    expect(translated.offers.map((o) => o.icon)).toEqual(offers.map((o) => o.icon))
    expect(translated.offers[0]?.action?.kind).toBe('domain-check')
    expect(translated.site.person).toEqual(site.person)
    expect(translated.site.name).toBe(site.name)
  })

  it.each(['en', 'es'] as const)('%s: o texto realmente mudou em relação ao português', (lang) => {
    const translated = contentFor(lang)

    expect(translated.sections.projetos.label).not.toBe('Projetos')
    expect(translated.services[0]?.title).not.toBe(services[0]?.title)
    expect(translated.offers[2]?.callout).not.toBe(offers[2]?.callout)
    expect(translated.navItems.map((item) => item.id)).toEqual(SECTION_IDS)
    expect(translated.navItems.filter((item) => item.isCta)).toHaveLength(1)
  })

  it('a mensagem do WhatsApp do contato sai no idioma da página', () => {
    const text = (lang: Lang) =>
      new URL(contentFor(lang).contactChannels[0]?.href ?? '').searchParams.get('text')

    expect(text('pt')).toBe(ui.pt.contact.whatsappGreeting)
    expect(text('en')).toBe(ui.en.contact.whatsappGreeting)
    expect(text('es')).toBe(ui.es.contact.whatsappGreeting)
  })

  it('o orçamento em outro idioma mantém horas e preços', () => {
    const translated = contentFor('en').quoteCatalog

    expect(translated.projects.map((item) => item.price)).toEqual(
      quoteCatalog.projects.map((item) => item.price),
    )
    expect(translated.projects[0]?.label).toBe('Business website')
  })
})

describe('textos da interface', () => {
  it.each(LANGS)('%s: nenhum texto vazio', (lang) => {
    const texts: string[] = []
    const walk = (value: unknown) => {
      if (typeof value === 'string') texts.push(value)
      else if (typeof value === 'object' && value !== null) Object.values(value).forEach(walk)
    }
    walk(ui[lang])

    for (const text of texts) expect(text.trim(), 'texto vazio').not.toBe('')
  })

  it('funções de texto recebem os valores e os usam', () => {
    for (const lang of LANGS) {
      expect(ui[lang].hero.age(20)).toContain('20')
      expect(ui[lang].brandLabel('The Crow')).toContain('The Crow')
      expect(ui[lang].domain.hint(3, 30)).toContain('30')
      expect(ui[lang].domain.available('a.b.dev')).toContain('a.b.dev')
      expect(ui[lang].domain.whatsappMessage('a.b.dev')).toContain('a.b.dev')
      expect(ui[lang].quotePanel.missing('X')).toContain('X')
    }
  })
})
