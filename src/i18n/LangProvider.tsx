import type { ReactNode } from 'react'
import type { Lang } from './lang'
import { LangContext } from './langContext'

/** Informa a toda a página em que idioma ela está (o idioma vem da URL: /pt/, /en/, /es/). */
export function LangProvider({
  lang,
  children,
}: {
  readonly lang: Lang
  readonly children: ReactNode
}) {
  return <LangContext value={lang}>{children}</LangContext>
}
