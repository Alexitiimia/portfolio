import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { contactChannels } from '@/content/contact'
import { projects } from '@/content/projects'
import { site } from '@/content/site'
import { describeViolations, findA11yViolations } from '@/test/a11y'
import { LangProvider } from '@/i18n/LangProvider'
import { QuotePage } from './QuotePage'

describe('QuotePage: corvo do logo', () => {
  it('clicar no corvo o faz voar aqui mesmo, em vez de ir para o portfólio', () => {
    const { container } = render(<QuotePage />)
    const flyer = container.querySelector('[data-flying]')
    if (flyer === null) throw new Error('corvo não encontrado')

    expect(fireEvent.click(flyer)).toBe(false)
    expect(flyer).toHaveAttribute('data-flying', 'true')
  })
})

describe('QuotePage: estrutura', () => {
  it('tem os marcos de página e um único h1, o título do orçamento', () => {
    render(<QuotePage />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Monte o orçamento do seu projeto')
  })

  it('o primeiro item da tabulação pula para o conteúdo', async () => {
    const user = userEvent.setup()
    render(<QuotePage />)

    await user.tab()

    const skip = screen.getByRole('link', { name: 'Ir para o conteúdo' })
    expect(skip).toHaveFocus()
    expect(skip).toHaveAttribute('href', '#conteudo')
  })

  it('o logo e o "voltar" levam ao portfólio (página inicial)', () => {
    render(<QuotePage />)

    expect(screen.getByRole('link', { name: /início da página/ })).toHaveAttribute('href', '/pt/')
    for (const link of screen.getAllByRole('link', { name: /voltar ao portfólio/ })) {
      expect(link).toHaveAttribute('href', '/pt/')
    }
  })

  it('cita o ano, a marca e quem assina no rodapé', () => {
    render(<QuotePage />)

    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      `© ${String(new Date().getFullYear())} ${site.name} · ${site.person.name}`,
    )
  })
})

describe('QuotePage: conteúdo', () => {
  it('traz o painel de orçamento completo', () => {
    render(<QuotePage />)

    const main = screen.getByRole('main')
    expect(within(main).getByRole('radio', { name: /Loja virtual/ })).toBeInTheDocument()
    expect(within(main).getByRole('checkbox', { name: /Frete/ })).toBeInTheDocument()
    expect(within(main).getByLabelText(/Seu nome/)).toBeInTheDocument()
  })

  it('mostra os projetos já publicados como links para os sites reais', () => {
    render(<QuotePage />)

    const section = screen.getByRole('region', { name: 'Projetos meus que já estão no ar' })
    for (const project of projects) {
      const link = within(section).getByRole('link', { name: new RegExp(project.name) })
      expect(link).toHaveAttribute('href', project.links[0]?.href)
    }
  })

  it('promete a resposta em até 24 horas, no passo a passo e ao lado do botão de enviar', () => {
    render(<QuotePage />)

    expect(screen.getAllByText(/24 horas/).length).toBeGreaterThanOrEqual(2)
  })

  it('oferece os canais de contato para quem prefere conversar', () => {
    render(<QuotePage />)

    for (const channel of contactChannels) {
      expect(screen.getByRole('link', { name: new RegExp(channel.label) })).toBeInTheDocument()
    }
  })

  it('todo link para fora abre em nova aba com segurança; os internos só vão ao próprio site', () => {
    const { container } = render(<QuotePage />)

    for (const anchor of container.querySelectorAll<HTMLAnchorElement>('a[href]')) {
      const href = anchor.getAttribute('href') ?? ''
      if (href.startsWith('#') || href.startsWith('mailto:')) continue
      if (href.startsWith('/') && !href.startsWith('//')) continue
      expect(href, 'link externo precisa ser HTTPS').toMatch(/^https:\/\//)
      expect(anchor).toHaveAttribute('target', '_blank')
      expect(anchor.getAttribute('rel')?.split(' ')).toEqual(
        expect.arrayContaining(['noopener', 'noreferrer']),
      )
    }
  })

  it('só tem ícones decorativos, ocultos a leitores de tela', () => {
    const { container } = render(<QuotePage />)

    for (const svg of container.querySelectorAll('svg')) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('passa na verificação automática do axe (exceto contraste, medido no navegador)', async () => {
    document.documentElement.lang = 'pt-BR'
    document.title = 'Orçamento · The Crow'
    render(<QuotePage />)

    const violations = await findA11yViolations(document.documentElement)

    expect(violations, describeViolations(violations)).toEqual([])
  })
})

describe('QuotePage: outros idiomas', () => {
  it('em inglês, o título, o logo e o "voltar" estão em inglês e levam a /en/', () => {
    render(
      <LangProvider lang="en">
        <QuotePage />
      </LangProvider>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Build a quote for your project',
    )
    expect(screen.getByRole('link', { name: /top of the page/ })).toHaveAttribute('href', '/en/')
    for (const link of screen.getAllByRole('link', { name: /back to the portfolio/ })) {
      expect(link).toHaveAttribute('href', '/en/')
    }
    expect(screen.getByRole('radio', { name: /Business website/ })).toBeInTheDocument()
  })

  it('em espanhol, o painel e o resumo estão em espanhol', () => {
    render(
      <LangProvider lang="es">
        <QuotePage />
      </LangProvider>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Arma el presupuesto de tu proyecto',
    )
    expect(screen.getByText('Elige el tipo de proyecto para empezar.')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /¿Qué necesitas\?/ })).toBeInTheDocument()
  })

  it('o seletor de idioma leva à mesma página nas outras versões', () => {
    render(
      <LangProvider lang="en">
        <QuotePage />
      </LangProvider>,
    )

    expect(screen.getByRole('link', { name: /Español/ })).toHaveAttribute(
      'href',
      '/es/presupuesto/',
    )
    expect(screen.getByRole('link', { name: /Português/ })).toHaveAttribute(
      'href',
      '/pt/orcamento/',
    )
  })
})
