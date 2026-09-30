import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { contactChannels } from '@/content/contact'
import { site } from '@/content/site'
import { describeViolations, findA11yViolations } from '@/test/a11y'
import { QuotePage } from './QuotePage'

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

    expect(screen.getByRole('link', { name: /início da página/ })).toHaveAttribute('href', '/')
    for (const link of screen.getAllByRole('link', { name: /voltar ao portfólio/ })) {
      expect(link).toHaveAttribute('href', '/')
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
