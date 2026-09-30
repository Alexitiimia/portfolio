import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { SECTION_IDS, sections } from '@/content/sections'
import { site } from '@/content/site'
import { LangProvider } from '@/i18n/LangProvider'
import { LANG_INFO, LANGS, type Lang } from '@/i18n/lang'
import { ageOn } from '@/lib/age'
import { describeViolations, findA11yViolations } from '@/test/a11y'
import { App } from './App'

beforeEach(() => {
  // Em produção estes dois vêm do index.html; o jsdom parte de um documento vazio.
  document.documentElement.lang = 'pt-BR'
  document.title = 'The Crow · Dev e Segurança'
})

describe('App: estrutura da página', () => {
  it('tem os marcos de página esperados e um único h1', () => {
    render(<App />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Rodapé' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('tem uma região nomeada e um título h2 para cada seção do menu', () => {
    render(<App />)

    for (const id of SECTION_IDS) {
      const region = screen.getByRole('region', { name: sections[id].label })
      expect(region).toHaveAttribute('id', id)
      expect(
        within(region).getByRole('heading', { level: 2, name: sections[id].label }),
      ).toBeInTheDocument()
    }
  })

  it('não repete nenhum id no documento', () => {
    const { container } = render(<App />)

    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('App: identificação', () => {
  it('mostra o nome e a idade de quem assina, calculada pela data de nascimento', () => {
    render(<App />)

    const age = ageOn(site.person.birthDate, new Date())
    expect(age).toBeGreaterThanOrEqual(20)
    expect(screen.getByText(`${site.person.name} · ${String(age)} anos`)).toBeInTheDocument()
  })
})

describe('App: links', () => {
  it('todo link interno (#) aponta para um elemento que existe', () => {
    const { container } = render(<App />)

    const anchors = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
    expect(anchors.length).toBeGreaterThan(10)
    for (const anchor of anchors) {
      const id = anchor.getAttribute('href')?.slice(1) ?? ''
      expect(container.querySelector(`[id="${id}"]`), `link para #${id}`).not.toBeNull()
    }
  })

  it('todo link para fora abre com segurança e usa só HTTPS ou mailto', () => {
    const { container } = render(<App />)

    const isOwnPage = (href: string) =>
      href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//'))
    const anchors = [...container.querySelectorAll<HTMLAnchorElement>('a[href]')].filter(
      (anchor) => !isOwnPage(anchor.getAttribute('href') ?? ''),
    )
    expect(anchors.length).toBeGreaterThan(0)

    for (const anchor of anchors) {
      const href = anchor.getAttribute('href') ?? ''
      if (href.startsWith('mailto:')) continue
      expect(href, 'link externo precisa ser HTTPS').toMatch(/^https:\/\//)
      expect(anchor).toHaveAttribute('target', '_blank')
      expect(anchor.getAttribute('rel')?.split(' ')).toEqual(
        expect.arrayContaining(['noopener', 'noreferrer']),
      )
    }
  })

  it('o primeiro item da tabulação é o link "Ir para o conteúdo", que leva ao <main>', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.tab()

    const skip = screen.getByRole('link', { name: 'Ir para o conteúdo' })
    expect(skip).toHaveFocus()
    expect(skip).toHaveAttribute('href', '#conteudo')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo')
  })
})

describe('App: acessibilidade', () => {
  it('mantém a semântica de lista em todo <ul> (Safari remove ao usar list-style: none)', () => {
    const { container } = render(<App />)

    const lists = [...container.querySelectorAll('ul')]
    expect(lists.length).toBeGreaterThan(5)
    for (const list of lists) expect(list).toHaveAttribute('role', 'list')
  })

  it('só tem imagens decorativas, do próprio site, e ícones ocultos a leitores de tela', () => {
    const { container } = render(<App />)

    const images = [...container.querySelectorAll('img')]
    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      // O nome do projeto está em texto ao lado: a imagem não precisa ser lida em voz alta.
      expect(image, 'imagem decorativa precisa de alt vazio').toHaveAttribute('alt', '')
      // A CSP só libera imagens do próprio site: nada de endereço de outro domínio.
      expect(image.getAttribute('src'), 'imagem de outro site').not.toMatch(/^(https?:)?\/\//)
    }
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg, 'todo SVG do site é decorativo').toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('passa na verificação automática do axe (exceto contraste, medido no navegador)', async () => {
    render(<App />)

    const violations = await findA11yViolations(document.documentElement)

    expect(violations, describeViolations(violations)).toEqual([])
  })
})

describe.each(LANGS)('App em %s', (lang: Lang) => {
  beforeEach(() => {
    document.documentElement.lang = LANG_INFO[lang].htmlLang
  })

  const renderApp = () =>
    render(
      <LangProvider lang={lang}>
        <App />
      </LangProvider>,
    )

  it('tem o seletor de idioma no cabeçalho, ao lado do botão de tema', () => {
    renderApp()

    const header = screen.getByRole('banner')
    const buttons = within(header)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label') ?? button.textContent)
    const languageIndex = buttons.findIndex((label) => label.includes(LANG_INFO[lang].name))
    const themeIndex = buttons.findIndex((label) => /theme|tema/i.test(label))

    expect(languageIndex).toBeGreaterThanOrEqual(0)
    expect(themeIndex).toBe(languageIndex + 1)
  })

  it('todo link interno (#) aponta para um elemento que existe', () => {
    const { container } = renderApp()

    for (const link of container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
      const id = link.getAttribute('href')?.slice(1) ?? ''
      expect(id === '' || document.getElementById(id) !== null, `#${id} não existe`).toBe(true)
    }
  })

  it('o link do orçamento vai para o orçamento do mesmo idioma', () => {
    const { container } = renderApp()

    const quoteLinks = [...container.querySelectorAll<HTMLAnchorElement>('a[href*="/"]')].filter(
      (link) =>
        /^\/(pt|en|es)\/\w+\/$/.test(link.getAttribute('href') ?? '') &&
        !link.hasAttribute('hreflang'),
    )
    expect(quoteLinks.length).toBeGreaterThan(0)
    for (const link of quoteLinks) {
      expect(link.getAttribute('href')).toMatch(new RegExp(`^/${lang}/`))
    }
  })

  it('não deixa texto em português nos outros idiomas (títulos das seções e menu)', () => {
    renderApp()

    if (lang === 'pt') return
    expect(screen.queryByRole('heading', { name: 'Projetos' })).toBeNull()
    expect(screen.queryByText(/Escolha o que precisa/)).toBeNull()
    expect(screen.queryByRole('link', { name: /orçamento/i })).toBeNull()
  })

  it('passa na verificação automática do axe', async () => {
    renderApp()

    const violations = await findA11yViolations(document.documentElement)

    expect(violations, describeViolations(violations)).toEqual([])
  })
})
