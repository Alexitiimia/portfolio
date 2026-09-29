import { useCallback, useEffect, useState } from 'react'
import {
  SYSTEM_LIGHT_QUERY,
  applyTheme,
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

export function useTheme(): UseTheme {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme)

  // Mantém o DOM alinhado ao estado (cobre o caso de o script do <head> não ter rodado).
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Sem escolha salva, acompanha mudanças do sistema (ex.: modo escuro automático ao anoitecer).
  useEffect(() => {
    const query = window.matchMedia(SYSTEM_LIGHT_QUERY)
    const onChange = () => {
      if (readStoredTheme() === null) setTheme(getSystemTheme())
    }
    query.addEventListener('change', onChange)
    return () => {
      query.removeEventListener('change', onChange)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    storeTheme(next)
    setTheme(next)
  }, [theme])

  return { theme, toggleTheme }
}
