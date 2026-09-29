import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { IconButton } from './IconButton'

/** Alterna entre tema escuro e claro. O ícone mostra para qual tema o clique vai levar. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <IconButton label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'} onClick={toggleTheme}>
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </IconButton>
  )
}
