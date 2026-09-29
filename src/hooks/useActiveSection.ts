import { useEffect, useState } from 'react'

/**
 * Descobre qual seção ocupa a "faixa de leitura" (perto do topo da tela) para marcar o item
 * correspondente do menu. Sem `IntersectionObserver`, simplesmente não marca nada.
 *
 * `ids` deve ser uma lista estável (constante do módulo): uma lista nova a cada render
 * reinicia a observação.
 */
export function useActiveSection<Id extends string>(ids: readonly Id[]): Id | null {
  const [active, setActive] = useState<Id | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    const inBand = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        }
        setActive(ids.find((id) => inBand.has(id)) ?? null)
      },
      // Faixa fina entre 35% e 45% da altura da tela, contada a partir do topo.
      { rootMargin: '-35% 0px -55% 0px' },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [ids])

  return active
}
