import { createContext } from 'react'
import { DEFAULT_LANG, type Lang } from './lang'

/** Idioma da página em exibição. Sem provedor (ex.: nos testes), português. */
export const LangContext = createContext<Lang>(DEFAULT_LANG)
