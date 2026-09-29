import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ButtonLink } from './ButtonLink'
import { ContactLink } from './ContactLink'
import { ExternalLink } from './ExternalLink'
import { ThemeToggle } from './ThemeToggle'

describe('ExternalLink', () => {
  it('abre em nova aba com noopener e noreferrer', () => {
    render(<ExternalLink href="https://github.com/Alexitiimia">GitHub</ExternalLink>)

    const link = screen.getByRole('link', { name: /GitHub/ })
    expect(link).toHaveAttribute('href', 'https://github.com/Alexitiimia')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')?.split(' ')).toEqual(
      expect.arrayContaining(['noopener', 'noreferrer']),
    )
  })

  it('avisa leitores de tela que abre em nova aba', () => {
    render(<ExternalLink href="https://github.com/Alexitiimia">GitHub</ExternalLink>)

    expect(screen.getByRole('link', { name: 'GitHub (abre em nova aba)' })).toBeInTheDocument()
  })

  it('mostra a seta apenas quando pedido, sem poluir o nome acessível', () => {
    const { rerender } = render(<ExternalLink href="https://exemplo.com.br">Site</ExternalLink>)
    expect(screen.queryByText('↗')).not.toBeInTheDocument()

    rerender(
      <ExternalLink href="https://exemplo.com.br" showArrow>
        Site
      </ExternalLink>,
    )
    expect(screen.getByText('↗')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('link')).toHaveAccessibleName('Site (abre em nova aba)')
  })
})

describe('ContactLink', () => {
  it('trata e-mail como link comum, sem abrir nova aba', () => {
    render(<ContactLink href="mailto:oi@exemplo.com.br">Escrever</ContactLink>)

    const link = screen.getByRole('link', { name: 'Escrever' })
    expect(link).toHaveAttribute('href', 'mailto:oi@exemplo.com.br')
    expect(link).not.toHaveAttribute('target')
  })

  it('trata sites como link externo seguro', () => {
    render(<ContactLink href="https://wa.me/5511999999999">WhatsApp</ContactLink>)

    const link = screen.getByRole('link', { name: /WhatsApp/ })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('ButtonLink', () => {
  it('é um link para a âncora, com a seta escondida dos leitores de tela', () => {
    render(
      <ButtonLink href="#projetos" arrow="↓">
        ver projetos
      </ButtonLink>,
    )

    const link = screen.getByRole('link', { name: 'ver projetos' })
    expect(link).toHaveAttribute('href', '#projetos')
    expect(link).not.toHaveAttribute('target')
    expect(screen.getByText('↓')).toHaveAttribute('aria-hidden', 'true')
  })

  it('vira link externo seguro quando marcado como external', () => {
    render(
      <ButtonLink href="https://github.com/Alexitiimia" external>
        github
      </ButtonLink>,
    )

    const link = screen.getByRole('link', { name: /github/ })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('ThemeToggle', () => {
  it('informa para qual tema o clique leva e alterna ao clicar', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />) // sistema escuro

    await user.click(screen.getByRole('button', { name: 'Ativar tema claro' }))
    expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })
})
