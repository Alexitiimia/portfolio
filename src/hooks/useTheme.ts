import { useCallback, useSyncExternalStore } from 'react'
import {
  SYSTEM_LIGHT_QUERY,
  applyTheme,
  ensureThemeApplied,
  getSystemTheme,
  readStoredTheme,
  resolveInitialTheme,
  storeTheme,
  type Theme,
} from '@/lib/theme'

interface UseTheme {
  readonly theme: Theme
  readonly toggleTheme: () => void
}

/** Quem está ouvindo o tema (os botões de alternar). A fonte da verdade é o atributo do <html>. */
const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => {
    listener()
  })
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  ensureThemeApplied()
  // Sem escolha salva, acompanha mudanças do sistema (ex.: modo escuro automático ao anoitecer).
  const query = window.matchMedia(SYSTEM_LIGHT_QUERY)
  const onSystemChange = () => {
    if (readStoredTheme() !== null) return
    applyTheme(getSystemTheme())
    notify()
  }
  query.addEventListener('change', onSystemChange)
  return () => {
    listeners.delete(onChange)
    query.removeEventListener('change', onSystemChange)
  }
}

/** No HTML pré-renderizado (build) ainda não há como saber o tema: começa no escuro, o padrão do site. */
const serverTheme = (): Theme => 'dark'

export function useTheme(): UseTheme {
  // Na hidratação o React usa `serverTheme` primeiro (igual ao HTML pronto) e logo troca pelo tema real.
  const theme = useSyncExternalStore(subscribe, resolveInitialTheme, serverTheme)

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    storeTheme(next)
    applyTheme(next)
    notify()
  }, [theme])

  return { theme, toggleTheme }
}
