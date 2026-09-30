import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LangProvider } from '@/i18n/LangProvider'
import { Services } from './Services'

describe('Services', () => {
  it('cada cartão leva ao orçamento com o serviço já marcado', () => {
    render(<Services />)

    expect(
      screen.getByRole('link', { name: /Pedir orçamento: Lojas e vendas online/ }),
    ).toHaveAttribute('href', '/pt/orcamento/?item=loja-virtual')
    expect(
      screen.getByRole('link', { name: /Pedir orçamento: Integração de APIs/ }),
    ).toHaveAttribute('href', '/pt/orcamento/?item=integracao-de-apis')
  })

  it('serviço sem item no orçamento só abre a página', () => {
    render(<Services />)

    expect(screen.getByRole('link', { name: /Pedir orçamento: SEO para sites/ })).toHaveAttribute(
      'href',
      '/pt/orcamento/',
    )
  })

  it('em inglês, o link vai para a página em inglês', () => {
    render(
      <LangProvider lang="en">
        <Services />
      </LangProvider>,
    )

    expect(
      screen.getByRole('link', { name: /Ask for a quote: Online stores and sales/ }),
    ).toHaveAttribute('href', '/en/quote/?item=loja-virtual')
  })
})
