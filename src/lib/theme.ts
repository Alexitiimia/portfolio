export type Theme = 'light' | 'dark'

/** Mesma chave usada por public/theme-init.js. Se mudar aqui, mude lá. */
export const THEME_STORAGE_KEY = 'theme'
export const SYSTEM_LIGHT_QUERY = '(prefers-color-scheme: light)'

const THEME_ATTRIBUTE = 'data-theme'

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/** Escolha salva pela pessoa, ou `null` se não houver (ou se o armazenamento estiver bloqueado). */
export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Armazenamento indisponível: a escolha vale apenas nesta visita.
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia(SYSTEM_LIGHT_QUERY).matches ? 'light' : 'dark'
}

function getAppliedTheme(): Theme | null {
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE)
  return isTheme(value) ? value : null
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
}

/** Tema inicial: o que o script do <head> já aplicou > escolha salva > preferência do sistema. */
export function resolveInitialTheme(): Theme {
  return getAppliedTheme() ?? readStoredTheme() ?? getSystemTheme()
}

/** Cobre o caso de o script do <head> não ter rodado: o <html> fica sem tema até alguém aplicar um. */
export function ensureThemeApplied(): void {
  if (getAppliedTheme() === null) applyTheme(resolveInitialTheme())
}
