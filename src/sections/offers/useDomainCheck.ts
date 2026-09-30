import { useCallback, useEffect, useRef, useState } from 'react'
import { parseDomainCheck, type DomainCheck } from '@/lib/domainName'

export type CheckState =
  | { readonly phase: 'idle' }
  | { readonly phase: 'checking'; readonly name: string }
  | { readonly phase: 'done'; readonly result: DomainCheck }

const TIMEOUT_MS = 8000
const UNAVAILABLE: DomainCheck = { status: 'unavailable' }

/** Respostas que só valem com HTTP 200: um "livre" vindo de um erro de rede/proxy não é confiável. */
function isTrusted(result: DomainCheck, httpOk: boolean): boolean {
  if (httpOk) return true
  return (
    result.status === 'invalid' ||
    result.status === 'rate_limited' ||
    result.status === 'unavailable'
  )
}

/**
 * Pergunta ao Worker (`/api/dominio`) se um nome de endereço está livre. Qualquer coisa fora do
 * esperado (rede, tempo esgotado, resposta estranha, nome diferente do perguntado) vira
 * "indisponível": a página nunca afirma que um nome está livre sem o servidor ter dito isso.
 */
export function useDomainCheck() {
  const [state, setState] = useState<CheckState>({ phase: 'idle' })
  const current = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    current.current?.abort()
    current.current = null
    setState({ phase: 'idle' })
  }, [])

  const check = useCallback(async (name: string) => {
    current.current?.abort()
    const controller = new AbortController()
    current.current = controller
    setState({ phase: 'checking', name })
    const timer = window.setTimeout(() => {
      controller.abort()
    }, TIMEOUT_MS)

    let result: DomainCheck = UNAVAILABLE
    try {
      const response = await fetch(`/api/dominio?nome=${encodeURIComponent(name)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      })
      const parsed = parseDomainCheck(await response.json().catch(() => null))
      const sameName = parsed === null || !('name' in parsed) || parsed.name === name
      if (parsed !== null && sameName && isTrusted(parsed, response.ok)) result = parsed
    } catch {
      result = UNAVAILABLE
    } finally {
      window.clearTimeout(timer)
    }

    // Se a pessoa mudou o nome (ou saiu) durante a consulta, esta resposta já não vale.
    if (current.current !== controller) return
    current.current = null
    setState({ phase: 'done', result })
  }, [])

  useEffect(
    () => () => {
      current.current?.abort()
    },
    [],
  )

  return { state, check, reset }
}
