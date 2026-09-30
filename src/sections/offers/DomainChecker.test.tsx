import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DOMAIN_SUFFIX } from '@/lib/domainName'
import { DomainChecker } from './DomainChecker'

function answer(body: unknown, status = 200): Response {
  return Response.json(body, { status })
}

function stubFetch(handler: (url: string) => Promise<Response> | Response) {
  const fetchMock = vi.fn((input: string) => Promise.resolve(handler(input)))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Digita o nome e envia o formulário como uma pessoa faria. */
async function submitName(name: string) {
  const user = userEvent.setup()
  render(<DomainChecker />)
  const input = screen.getByLabelText('Nome desejado')
  if (name !== '') await user.type(input, name)
  await user.click(screen.getByRole('button', { name: 'verificar' }))
  return { user, input }
}

const status = () => screen.getByRole('status')

describe('DomainChecker: aparência inicial', () => {
  it('tem campo com rótulo, botão e o sufixo fixo do endereço', () => {
    const { container } = render(<DomainChecker />)

    expect(screen.getByLabelText('Nome desejado')).toHaveAttribute('name', 'nome')
    expect(screen.getByRole('button', { name: 'verificar' })).toBeEnabled()
    expect(container).toHaveTextContent(`.${DOMAIN_SUFFIX}`)
    expect(status()).toBeEmptyDOMElement()
  })

  it('anuncia o resultado a leitores de tela (região "status" educada)', () => {
    render(<DomainChecker />)

    expect(status()).toHaveAttribute('aria-live', 'polite')
  })

  it('descreve as regras do nome no campo, para leitores de tela', () => {
    render(<DomainChecker />)

    const input = screen.getByLabelText('Nome desejado')
    const hint = document.getElementById(input.getAttribute('aria-describedby') ?? '')
    expect(hint).toHaveTextContent(/letras sem acento/)
  })
})

describe('DomainChecker: nome livre', () => {
  it('pergunta ao servidor e mostra o endereço livre com o botão do WhatsApp', async () => {
    const api = stubFetch(() => answer({ status: 'available', name: 'minha-loja' }))

    await submitName('minha-loja')

    expect(api).toHaveBeenCalledTimes(1)
    expect(api.mock.calls[0]?.[0]).toBe('/api/dominio?nome=minha-loja')
    await waitFor(() => {
      expect(status()).toHaveTextContent(`minha-loja.${DOMAIN_SUFFIX} está livre agora`)
    })

    const link = screen.getByRole('link', { name: /falar no WhatsApp/ })
    const href = new URL(link.getAttribute('href') ?? '')
    expect(href.origin + href.pathname).toBe('https://wa.me/5547991275759')
    expect(href.searchParams.get('text')).toContain(`minha-loja.${DOMAIN_SUFFIX}`)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')?.split(' ')).toEqual(
      expect.arrayContaining(['noopener', 'noreferrer']),
    )
  })

  it('comemora com o selo animado e oferece orçamento ou WhatsApp', async () => {
    stubFetch(() => answer({ status: 'available', name: 'minha-loja' }))

    await submitName('minha-loja')

    await waitFor(() => {
      expect(screen.getByTestId('available-badge')).toHaveAttribute('aria-hidden', 'true')
    })
    expect(screen.getByRole('link', { name: /montar orçamento/ })).toHaveAttribute(
      'href',
      '/pt/orcamento/',
    )
    expect(screen.getByRole('link', { name: /falar no WhatsApp/ })).toBeInTheDocument()
  })

  it('nome em uso não mostra o selo de livre', async () => {
    stubFetch(() => answer({ status: 'taken', name: 'f-cordeiro' }))

    await submitName('f-cordeiro')

    await waitFor(() => {
      expect(status()).toHaveTextContent(/já está em uso/)
    })
    expect(screen.queryByTestId('available-badge')).toBeNull()
  })

  it('deixa claro que livre não é o mesmo que reservado', async () => {
    stubFetch(() => answer({ status: 'available', name: 'minha-loja' }))

    await submitName('minha-loja')

    await waitFor(() => {
      expect(status()).toHaveTextContent(/só fica seu depois de fechar/)
    })
  })

  it('aceita maiúsculas e espaços, e manda o nome já normalizado', async () => {
    const api = stubFetch(() => answer({ status: 'available', name: 'minha-loja' }))

    const { input } = await submitName('  Minha-Loja ')

    expect(input).toHaveValue('  minha-loja ')
    expect(api.mock.calls[0]?.[0]).toBe('/api/dominio?nome=minha-loja')
  })
})

describe('DomainChecker: nome em uso ou reservado', () => {
  it('avisa que o nome já está em uso e não oferece o WhatsApp', async () => {
    stubFetch(() => answer({ status: 'taken', name: 'f-cordeiro' }))

    await submitName('f-cordeiro')

    await waitFor(() => {
      expect(status()).toHaveTextContent(`f-cordeiro.${DOMAIN_SUFFIX} já está em uso`)
    })
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('avisa que o nome é reservado', async () => {
    stubFetch(() => answer({ status: 'reserved', name: 'www' }))

    await submitName('www')

    await waitFor(() => {
      expect(status()).toHaveTextContent(/"www" é um nome reservado/)
    })
  })
})

describe('DomainChecker: nome com formato inválido', () => {
  it.each([
    ['', /Digite o nome/],
    ['ab', /pelo menos 3/],
    ['minha loja', /letras sem acento/],
    ['loja.com', /letras sem acento/],
    ['-loja', /hífen/],
  ])('recusa %j na própria página, sem consultar o servidor', async (name, message) => {
    const api = stubFetch(() => answer({ status: 'available', name: 'nao-deveria-chamar' }))

    const { input } = await submitName(name)

    expect(api).not.toHaveBeenCalled()
    expect(status()).toHaveTextContent(message)
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('DomainChecker: nunca afirma "livre" sem o servidor dizer', () => {
  const NOT_AVAILABLE = /Não consegui verificar agora/

  async function expectUnavailable() {
    await waitFor(() => {
      expect(status()).toHaveTextContent(NOT_AVAILABLE)
    })
    expect(status()).not.toHaveTextContent(/está livre/)
    expect(screen.queryByRole('link')).toBeNull()
  }

  it('quando a rede falha', async () => {
    stubFetch(() => {
      throw new TypeError('sem rede')
    })

    await submitName('minha-loja')

    await expectUnavailable()
  })

  it('quando o servidor responde 503 "indisponível"', async () => {
    stubFetch(() => answer({ status: 'unavailable' }, 503))

    await submitName('minha-loja')

    await expectUnavailable()
  })

  it('quando o servidor responde 404 (ex.: rodando só o Vite, sem o Worker)', async () => {
    stubFetch(() => new Response('Not found', { status: 404 }))

    await submitName('minha-loja')

    await expectUnavailable()
  })

  it('quando a resposta não é JSON', async () => {
    stubFetch(() => new Response('<html>erro</html>'))

    await submitName('minha-loja')

    await expectUnavailable()
  })

  it.each([
    ['sem nome', { status: 'available' }],
    ['status desconhecido', { status: 'livre', name: 'minha-loja' }],
    ['nome diferente do perguntado', { status: 'available', name: 'outra-loja' }],
    ['formato errado', ['available', 'minha-loja']],
  ])('quando a resposta vem estranha: %s', async (_case, body) => {
    stubFetch(() => answer(body))

    await submitName('minha-loja')

    await expectUnavailable()
  })

  it('quando um erro HTTP (proxy, CDN) traz um corpo que diz "livre"', async () => {
    stubFetch(() => answer({ status: 'available', name: 'minha-loja' }, 502))

    await submitName('minha-loja')

    await expectUnavailable()
  })

  it('avisa quando há consultas demais', async () => {
    stubFetch(() => answer({ status: 'rate_limited' }, 429))

    await submitName('minha-loja')

    await waitFor(() => {
      expect(status()).toHaveTextContent(/Muitas consultas seguidas/)
    })
  })
})

describe('DomainChecker: durante e depois da consulta', () => {
  it('desativa o botão e avisa que está verificando enquanto espera', async () => {
    let finish: (response: Response) => void = () => undefined
    stubFetch(
      () =>
        new Promise<Response>((resolve) => {
          finish = resolve
        }),
    )

    await submitName('minha-loja')

    const button = screen.getByRole('button', { name: 'verificando…' })
    expect(button).toBeDisabled()
    expect(status()).toHaveTextContent(`Verificando minha-loja.${DOMAIN_SUFFIX}`)

    finish(answer({ status: 'available', name: 'minha-loja' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'verificar' })).toBeEnabled()
    })
  })

  it('apaga o resultado assim que a pessoa volta a digitar (era de outro nome)', async () => {
    stubFetch(() => answer({ status: 'available', name: 'minha-loja' }))
    const { user, input } = await submitName('minha-loja')
    await waitFor(() => {
      expect(status()).toHaveTextContent(/está livre/)
    })

    await user.type(input, '2')

    expect(status()).toBeEmptyDOMElement()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('ignora a resposta atrasada de um nome que a pessoa já trocou', async () => {
    const pending: Record<string, (response: Response) => void> = {}
    stubFetch(
      (url) =>
        new Promise<Response>((resolve) => {
          pending[new URL(url, 'https://x.test').searchParams.get('nome') ?? ''] = resolve
        }),
    )
    const user = userEvent.setup()
    render(<DomainChecker />)
    const input = screen.getByLabelText('Nome desejado')

    await user.type(input, 'primeiro')
    await user.click(screen.getByRole('button', { name: 'verificar' }))
    await user.clear(input)
    await user.type(input, 'segundo')
    await user.click(screen.getByRole('button', { name: 'verificar' }))

    pending.segundo?.(answer({ status: 'taken', name: 'segundo' }))
    await waitFor(() => {
      expect(status()).toHaveTextContent(`segundo.${DOMAIN_SUFFIX} já está em uso`)
    })

    // A resposta do primeiro chega tarde e não pode sobrescrever a do segundo.
    pending.primeiro?.(answer({ status: 'available', name: 'primeiro' }))
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(status()).toHaveTextContent(`segundo.${DOMAIN_SUFFIX} já está em uso`)
    expect(status()).not.toHaveTextContent(/primeiro/)
  })
})
