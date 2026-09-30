import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDialog } from '@/test/dialog'
import { DomainDialog } from './DomainDialog'
import { Offers } from './Offers'

beforeEach(() => {
  mockDialog()
})

describe('Condições: botão do domínio', () => {
  it('o cartão de Domínio tem um botão que abre o popup; o campo não fica mais solto na página', async () => {
    const user = userEvent.setup()
    render(<Offers />)

    // Fechado: o campo não está na página.
    expect(screen.queryByLabelText('Nome desejado')).toBeNull()

    const button = screen.getByRole('button', { name: 'verificar nome' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')

    await user.click(button)

    const dialog = screen.getByRole('dialog', { name: /nome do seu site está livre/ })
    expect(dialog).toHaveAttribute('open')
    expect(screen.getByLabelText('Nome desejado')).toBeInTheDocument()
  })

  it('só o cartão de Domínio tem botão', () => {
    render(<Offers />)

    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('leva o foco ao campo ao abrir e fecha pelo "X"', async () => {
    const user = userEvent.setup()
    render(<Offers />)

    await user.click(screen.getByRole('button', { name: 'verificar nome' }))
    expect(screen.getByLabelText('Nome desejado')).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByLabelText('Nome desejado')).toBeNull()
  })

  it('reabre do zero: o que foi digitado antes não fica', async () => {
    const user = userEvent.setup()
    render(<Offers />)

    await user.click(screen.getByRole('button', { name: 'verificar nome' }))
    await user.type(screen.getByLabelText('Nome desejado'), 'minha-loja')
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    await user.click(screen.getByRole('button', { name: 'verificar nome' }))

    expect(screen.getByLabelText('Nome desejado')).toHaveValue('')
  })
})

describe('DomainDialog', () => {
  it('fecha ao clicar no fundo escurecido, mas não ao clicar no conteúdo', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DomainDialog open onClose={onClose} />)

    await user.click(screen.getByLabelText('Nome desejado'))
    expect(onClose).not.toHaveBeenCalled()

    await user.click(screen.getByRole('dialog', { hidden: true }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('avisa quando o navegador o fecha (Esc)', () => {
    const onClose = vi.fn()
    render(<DomainDialog open onClose={onClose} />)

    screen.getByRole('dialog', { hidden: true }).dispatchEvent(new Event('close'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('não quebra em navegador sem showModal', () => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      value: undefined,
      configurable: true,
    })

    render(<DomainDialog open onClose={vi.fn()} />)

    expect(screen.getByRole('dialog')).toHaveAttribute('open')
  })
})
