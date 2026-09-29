import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { SECTION_IDS, sections } from '@/content/sections'
import { describeViolations, findA11yViolations } from '@/test/a11y'
import { App } from './App'

beforeEach(() => {
  // Em produção estes dois vêm do index.html; o jsdom parte de um documento vazio.
  document.documentElement.lang = 'pt-BR'
  document.title = 'CORVO · Full stack e segurança da informação'
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

    const anchors = [...container.querySelectorAll<HTMLAnchorElement>('a[href]')].filter(
      (anchor) => !anchor.getAttribute('href')?.startsWith('#'),
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

  it('não tem imagens sem descrição nem ícones expostos a leitores de tela', () => {
    const { container } = render(<App />)

    expect(container.querySelectorAll('img')).toHaveLength(0)
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
