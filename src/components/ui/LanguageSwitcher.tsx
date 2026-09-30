import { useEffect, useId, useRef, useState } from 'react'
import { Check, Languages } from 'lucide-react'
import { LANG_INFO, LANGS, pagePath, type PageId } from '@/i18n/lang'
import { useLang, useUi } from '@/i18n/useI18n'
import { cx } from '@/lib/cx'
import { LineIcon } from './LineIcon'
import styles from './LanguageSwitcher.module.css'

/**
 * Seletor de idioma, ao lado do botão de tema. O botão mostra a sigla do idioma atual e abre uma
 * lista curta; cada idioma é um link para a mesma página na outra versão (/pt/, /en/, /es/), então
 * a escolha vale também para quem compartilhar o endereço. Esc e clique fora fecham a lista.
 */
export function LanguageSwitcher({ page }: { readonly page: PageId }) {
  const current = useLang()
  const ui = useUi()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && root.current?.contains(event.target) !== true) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div ref={root} className={styles.root}>
      <button
        ref={button}
        type="button"
        className={styles.button}
        aria-label={`${ui.language.label}: ${LANG_INFO[current].name}`}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((value) => !value)
        }}
      >
        <LineIcon icon={Languages} size={16} />
        <span aria-hidden="true" className={styles.short}>
          {LANG_INFO[current].short}
        </span>
      </button>

      <ul
        id={listId}
        role="list"
        aria-label={ui.language.menuLabel}
        className={cx(styles.list, open && styles.open)}
      >
        {LANGS.map((lang) => (
          <li key={lang}>
            <a
              href={pagePath(lang, page)}
              lang={LANG_INFO[lang].htmlLang}
              hrefLang={LANG_INFO[lang].htmlLang}
              aria-current={lang === current ? 'true' : undefined}
              className={styles.link}
            >
              <span className={styles.code} aria-hidden="true">
                {LANG_INFO[lang].short}
              </span>
              {LANG_INFO[lang].name}
              {lang === current ? (
                <LineIcon icon={Check} size={14} className={styles.check} />
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
