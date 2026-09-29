import { vi } from 'vitest'

/** Versão mínima de MediaQueryList: o `EventTarget` já entrega add/removeEventListener. */
class FakeMediaQueryList extends EventTarget {
  matches: boolean
  readonly media: string
  onchange = null

  constructor(media: string, matches: boolean) {
    super()
    this.media = media
    this.matches = matches
  }

  addListener(): void {
    /* API antiga, não usada pelo site */
  }

  removeListener(): void {
    /* API antiga, não usada pelo site */
  }
}

interface MatchMediaController {
  /** Simula o sistema operacional mudando a preferência (`true` = tema claro). */
  setMatches: (matches: boolean) => void
}

/** O jsdom não implementa `matchMedia`. Este mock responde igual a qualquer consulta. */
export function mockMatchMedia(initialMatches: boolean): MatchMediaController {
  const list = new FakeMediaQueryList('(prefers-color-scheme: light)', initialMatches)
  vi.stubGlobal('matchMedia', () => list)

  return {
    setMatches(matches) {
      list.matches = matches
      list.dispatchEvent(new Event('change'))
    },
  }
}
