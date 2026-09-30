import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { contactChannels } from '@/content/contact'
import { CTA_SECTION_ID, SECTION_IDS, navItems, sections } from '@/content/sections'
import { site } from '@/content/site'
import { mockIntersectionObserver } from '@/test/intersectionObserver'
import { Footer } from './Footer'
import { Header } from './Header'
import { StatusBar } from './StatusBar'

function renderHeaderWithSections() {
  return render(
    <>
      <Header />
      {SECTION_IDS.map((id) => (
        <section key={id} id={id} />
      ))}
    </>,
  )
}

describe('Header', () => {
  it('lista as seções do menu na ordem, com o destaque no último item', () => {
    renderHeaderWithSections()

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const links = within(nav).getAllByRole('link')

    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      navItems.map((item) => `#${item.id}`),
    )
    expect(links.at(-1)).toHaveTextContent(`${sections[CTA_SECTION_ID].navLabel}→`)
  })

  it('numera os itens comuns e não numera o destaque', () => {
    renderHeaderWithSections()

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: /projetos/ })).toHaveTextContent('01')
    expect(within(nav).getByRole('link', { name: /contato/ })).not.toHaveTextContent('06')
  })

  it('leva o logo ao topo da página', () => {
    renderHeaderWithSections()

    expect(screen.getByRole('link', { name: /início da página/ })).toHaveAttribute(
      'href',
      '#inicio',
    )
  })

  it('abre e fecha o menu do celular com o botão, informando o estado ao leitor de tela', async () => {
    const user = userEvent.setup()
    renderHeaderWithSections()

    const button = screen.getByRole('button', { name: 'menu' })
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', nav.id)

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('fecha o menu com Esc', async () => {
    const user = userEvent.setup()
    renderHeaderWithSections()
    const button = screen.getByRole('button', { name: 'menu' })

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('fecha o menu ao escolher uma seção', async () => {
    const user = userEvent.setup()
    renderHeaderWithSections()
    const button = screen.getByRole('button', { name: 'menu' })

    await user.click(button)
    await user.click(screen.getByRole('link', { name: /ferramentas/ }))

    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('marca com aria-current só o item da seção que está na tela', () => {
    const Observer = mockIntersectionObserver()
    renderHeaderWithSections()

    const target = document.getElementById('seguranca')
    if (target === null) throw new Error('#seguranca não existe')
    act(() => {
      Observer.instances[0]?.emit([{ target, isIntersecting: true }])
    })

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const current = within(nav)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'location')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveAttribute('href', '#seguranca')
  })

  it('inclui o botão de tema', () => {
    renderHeaderWithSections()

    expect(screen.getByRole('button', { name: /Ativar tema/ })).toBeInTheDocument()
  })
})

describe('StatusBar', () => {
  it('é decorativa: fica fora da árvore de acessibilidade, mas mostra o texto da marca', () => {
    const { container } = render(<StatusBar />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container).toHaveTextContent(site.statusBar.left)
    expect(container).toHaveTextContent(`${site.statusBar.prompt} ${site.statusBar.command}`)
  })
})

describe('Footer', () => {
  it('leva a todas as seções', () => {
    render(<Footer />)

    const nav = screen.getByRole('navigation', { name: 'Rodapé' })
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(SECTION_IDS.map((id) => `#${id}`))
  })

  it('lista as garantias de segurança do site', () => {
    render(<Footer />)

    for (const fact of site.footer.securityFacts) {
      expect(screen.getByText(fact.label, { exact: false })).toBeInTheDocument()
    }
  })

  it('mostra os canais de contato e o link para o código-fonte', () => {
    render(<Footer />)

    for (const channel of contactChannels) {
      expect(screen.getByRole('link', { name: new RegExp(channel.label) })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /Código-fonte/ })).toHaveAttribute(
      'href',
      site.links.repository,
    )
  })

  it('cita o ano atual, a marca e o nome de quem assina', () => {
    const { container } = render(<Footer />)

    expect(container).toHaveTextContent(
      `© ${String(new Date().getFullYear())} ${site.name} · ${site.person.name}`,
    )
    expect(container).toHaveTextContent(site.footer.closing)
  })

  it('não traz aviso de marcas de terceiros', () => {
    const { container } = render(<Footer />)

    expect(container).not.toHaveTextContent(/Logotipos e marcas/)
  })

  it('põe um ícone em cada título e em cada item de Navegar, Segurança e Contato', () => {
    const { container } = render(<Footer />)

    const headings = [...container.querySelectorAll('h3')]
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Navegar',
      'Segurança',
      'Contato',
    ])
    for (const heading of headings) expect(heading.querySelector('svg')).not.toBeNull()

    const items = [...container.querySelectorAll('li')]
    expect(items.length).toBeGreaterThan(SECTION_IDS.length)
    for (const item of items) expect(item.querySelector('svg')).not.toBeNull()
  })

  it('está dentro do marco "contentinfo"', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
