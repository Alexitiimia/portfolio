import { useContext } from 'react'
import { contentFor, type Content } from '@/content/localize'
import type { Lang } from './lang'
import { LangContext } from './langContext'
import { ui, type Ui } from './ui'

export function useLang(): Lang {
  return useContext(LangContext)
}

/** Textos da interface no idioma da página. */
export function useUi(): Ui {
  return ui[useLang()]
}

/** Conteúdo (projetos, serviços, condições...) no idioma da página. */
export function useContent(): Content {
  return contentFor(useLang())
}
