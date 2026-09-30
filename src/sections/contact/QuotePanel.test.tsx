import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { QuoteCatalog } from '@/content/quote'
import { QuotePanel } from './QuotePanel'

const catalog: QuoteCatalog = {
  projects: [
    { id: 'loja', label: 'Loja virtual', description: 'Vende produtos.', price: 1000 },
    { id: 'site', label: 'Site simples', description: 'Institucional.', price: null },
  ],
  extras: [
    { id: 'frete', label: 'Frete', description: 'Cálculo de frete.', price: 200 },
    { id: 'logo', label: 'Logo', description: 'Identidade.', price: null },
  ],
  deadlines: [
    { id: 'calma', label: 'Sem pressa' },
    { id: 'urgente', label: 'Urgente' },
  ],
}

const whatsappButton = () =>
  screen.getByText('enviar meu orçamento no WhatsApp').closest('a, button')
const plain = (text: string | null) => (text ?? '').replaceAll(' ', ' ')

describe('QuotePanel', () => {
  it('começa sem envio possível e diz o que falta', () => {
    render(<QuotePanel catalog={catalog} />)

    expect(whatsappButton()?.tagName).toBe('BUTTON')
    expect(screen.getByRole('status')).toHaveTextContent('o tipo de projeto e seu nome')
    expect(screen.getByText('0 de 2 passos obrigatórios')).toBeInTheDocument()
  })

  it('sem os dados obrigatórios, o botão leva ao primeiro campo que falta em vez de ficar morto', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)

    await user.click(whatsappButton() as HTMLElement)
    expect(screen.getByRole('radio', { name: /Loja virtual/ })).toHaveFocus()

    await user.click(screen.getByRole('radio', { name: /Loja virtual/ }))
    await user.click(whatsappButton() as HTMLElement)
    expect(screen.getByLabelText(/Seu nome/)).toHaveFocus()
  })

  it('mostra o progresso e avisa quando está pronto para enviar', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)

    await user.click(screen.getByRole('radio', { name: /Loja virtual/ }))
    expect(screen.getByText('1 de 2 passos obrigatórios')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Seu nome/), 'Joana')
    expect(screen.getByText('Pronto para enviar')).toBeInTheDocument()
  })

  it('abre com o projeto marcado quando a URL traz ?item= (vindo de um cartão de serviços)', () => {
    window.history.pushState({}, '', '/pt/orcamento/?item=loja')
    try {
      render(<QuotePanel catalog={catalog} />)
      expect(screen.getByRole('radio', { name: /Loja virtual/ })).toBeChecked()
    } finally {
      window.history.pushState({}, '', '/')
    }
  })

  it('abre com o extra marcado quando o ?item= é um extra', () => {
    window.history.pushState({}, '', '/pt/orcamento/?item=frete')
    try {
      render(<QuotePanel catalog={catalog} />)
      expect(screen.getByRole('checkbox', { name: /Frete/ })).toBeChecked()
    } finally {
      window.history.pushState({}, '', '/')
    }
  })

  it('ignora um ?item= que não existe', () => {
    window.history.pushState({}, '', '/pt/orcamento/?item=nada')
    try {
      render(<QuotePanel catalog={catalog} />)
      expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1)
    } finally {
      window.history.pushState({}, '', '/')
    }
  })

  it('oferece um atalho para o resumo só depois de escolher o projeto', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)
    expect(screen.queryByRole('link', { name: /ver resumo e enviar/ })).toBeNull()

    await user.click(screen.getByRole('radio', { name: /Site simples/ }))

    expect(screen.getByRole('link', { name: /ver resumo e enviar/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^#.+-resumo$/),
    )
  })

  it('libera o WhatsApp com a mensagem pronta quando há projeto e nome', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)

    await user.click(screen.getByRole('radio', { name: /Loja virtual/ }))
    await user.type(screen.getByLabelText(/Seu nome/), 'Joana')
    await user.click(screen.getByRole('checkbox', { name: /Frete/ }))
    await user.click(screen.getByRole('radio', { name: 'Urgente' }))

    const link = whatsappButton()
    expect(link?.tagName).toBe('A')
    const href = link?.getAttribute('href') ?? ''
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
    const text = decodeURIComponent(href.split('?text=')[1] ?? '')
    expect(text).toContain('*Nome:* Joana')
    expect(text).toContain('*Projeto:* Loja virtual')
    expect(text).toContain('Frete')
    expect(text).toContain('*Prazo:* Urgente')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link?.getAttribute('rel')).toContain('noopener')
  })

  it('soma só o que tem preço e avisa dos itens sob consulta', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)

    await user.click(screen.getByRole('radio', { name: /Loja virtual/ }))
    await user.click(screen.getByRole('checkbox', { name: /Frete/ }))
    await user.click(screen.getByRole('checkbox', { name: /Logo/ }))

    const total = screen.getByText('Estimativa').parentElement
    expect(plain(total?.textContent ?? '')).toContain('R$ 1.200 + itens sob consulta')
  })

  it('mostra "a combinar" quando nenhum item escolhido tem preço', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)

    await user.click(screen.getByRole('radio', { name: /Site simples/ }))

    expect(screen.getByText('Estimativa').parentElement).toHaveTextContent('a combinar')
  })

  it('permite escolher só um projeto, mas vários extras, e desmarcar', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)

    await user.click(screen.getByRole('radio', { name: /Loja virtual/ }))
    await user.click(screen.getByRole('radio', { name: /Site simples/ }))
    expect(screen.getByRole('radio', { name: /Loja virtual/ })).not.toBeChecked()

    const frete = screen.getByRole('checkbox', { name: /Frete/ })
    await user.click(frete)
    await user.click(screen.getByRole('checkbox', { name: /Logo/ }))
    await user.click(frete)
    expect(frete).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: /Logo/ })).toBeChecked()
  })

  it('mostra o Instagram só quando está pronto e nunca inclui link inseguro', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)
    expect(screen.queryByText('enviar pelo Instagram')).toBeNull()

    await user.click(screen.getByRole('radio', { name: /Loja virtual/ }))
    await user.type(screen.getByLabelText(/Seu nome/), 'Joana')

    const instagram = screen.getByText('enviar pelo Instagram').closest('a')
    expect(instagram?.getAttribute('href')).toMatch(/^https:\/\/ig\.me\/m\/[\w.]+$/)
  })

  it('limita o tamanho dos campos e mostra o contador', async () => {
    const user = userEvent.setup()
    render(<QuotePanel catalog={catalog} />)

    await user.type(screen.getByLabelText(/Conte sobre o projeto/), 'abcd')

    expect(
      screen.getByText((_, element) => element?.textContent === '4/600' && element.tagName === 'P'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Seu nome/)).toHaveAttribute('maxlength', '60')
  })

  it('agrupa as opções em fieldsets com legenda (leitor de tela)', () => {
    render(<QuotePanel catalog={catalog} />)

    const groups = screen.getAllByRole('group')
    expect(groups.length).toBeGreaterThanOrEqual(3)
    const first = groups[0]
    if (first === undefined) throw new Error('nenhum grupo encontrado')
    expect(within(first).getAllByRole('radio')).toHaveLength(2)
  })
})
