import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { contactChannels } from '@/content/contact'
import { Contact } from './Contact'

describe('Contato (portfólio)', () => {
  it('leva à página própria do orçamento em vez de trazer o painel completo', () => {
    render(<Contact />)

    const link = screen.getByRole('link', { name: /montar orçamento/ })
    expect(link).toHaveAttribute('href', '/pt/orcamento/')
    // É uma página do próprio site: abre na mesma aba, sem "nova aba".
    expect(link).not.toHaveAttribute('target')
    expect(screen.queryByRole('radio')).toBeNull()
    expect(screen.queryByRole('checkbox')).toBeNull()
  })

  it('mantém os canais de contato', () => {
    render(<Contact />)

    for (const channel of contactChannels) {
      expect(screen.getByRole('link', { name: new RegExp(channel.label) })).toBeInTheDocument()
    }
  })
})
