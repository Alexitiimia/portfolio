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

const whatsappButton = () => screen.getByText('enviar pelo WhatsApp').closest('a, button')
const plain = (text: string | null) => (text ?? '').replaceAll(' ', ' ')

describe('QuotePanel', () => {
  it('começa sem envio possível e diz o que falta', () => {
    render(<QuotePanel catalog={catalog} />)

    expect(whatsappButton()?.tagName).toBe('BUTTON')
    expect(whatsappButton()).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('o tipo de projeto e seu nome')
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
