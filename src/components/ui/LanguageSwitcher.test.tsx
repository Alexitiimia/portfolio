import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LangProvider } from '@/i18n/LangProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

function renderSwitcher(lang: 'pt' | 'en' | 'es' = 'pt', page: 'home' | 'quote' = 'home') {
  return render(
    <LangProvider lang={lang}>
      <LanguageSwitcher page={page} />
    </LangProvider>,
  )
}

describe('LanguageSwitcher', () => {
  it('mostra a sigla do idioma atual e um nome acessível completo', () => {
    renderSwitcher('en')

    const button = screen.getByRole('button', { name: 'Language: English' })
    expect(button).toHaveTextContent('EN')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('lista os três idiomas como links para a mesma página, marcando o atual', () => {
    renderSwitcher('pt')

    const links = screen.getAllByRole('link', { hidden: true })
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/pt/', '/en/', '/es/'])
    expect(links.map((link) => link.getAttribute('hreflang'))).toEqual(['pt-BR', 'en', 'es'])
    expect(links[0]).toHaveAttribute('aria-current', 'true')
    expect(links[1]).not.toHaveAttribute('aria-current')
  })

  it('na página de orçamento, cada idioma leva ao orçamento dele', () => {
    renderSwitcher('es', 'quote')

    const hrefs = screen
      .getAllByRole('link', { hidden: true })
      .map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/pt/orcamento/', '/en/quote/', '/es/presupuesto/'])
  })

  it('abre e fecha pelo botão, por Esc (devolvendo o foco) e por clique fora', async () => {
    const user = userEvent.setup()
    render(
      <LangProvider lang="pt">
        <LanguageSwitcher page="home" />
        <p>fora</p>
      </LangProvider>,
    )
    const button = screen.getByRole('button', { name: /Idioma/ })

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()

    await user.click(button)
    await user.click(screen.getByText('fora'))
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
