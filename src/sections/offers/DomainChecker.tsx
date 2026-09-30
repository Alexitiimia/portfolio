import { useId, useState, type ChangeEvent, type SubmitEvent } from 'react'
import { CircleCheck, CircleX, LoaderCircle, TriangleAlert, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { LineIcon } from '@/components/ui/LineIcon'
import { whatsappHref } from '@/content/contact'
import { pagePath } from '@/i18n/lang'
import { useLang, useUi } from '@/i18n/useI18n'
import type { Ui } from '@/i18n/ui'
import { cx } from '@/lib/cx'
import {
  DOMAIN_SUFFIX,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  fullAddress,
  validateName,
  type DomainCheck,
  type NameProblem,
} from '@/lib/domainName'
import { AvailableBadge } from './AvailableBadge'
import styles from './DomainChecker.module.css'
import { useDomainCheck, type CheckState } from './useDomainCheck'

interface Message {
  readonly tone: 'good' | 'bad' | 'warn' | 'busy'
  readonly icon: LucideIcon
  readonly text: string
  /** Endereço a oferecer no WhatsApp, quando o nome está livre. */
  readonly offer?: string
}

function describeResult(result: DomainCheck, ui: Ui['domain']): Message {
  switch (result.status) {
    case 'available':
      return {
        tone: 'good',
        icon: CircleCheck,
        text: ui.available(fullAddress(result.name)),
        offer: fullAddress(result.name),
      }
    case 'taken':
      return { tone: 'bad', icon: CircleX, text: ui.taken(fullAddress(result.name)) }
    case 'reserved':
      return { tone: 'bad', icon: CircleX, text: ui.reserved(result.name) }
    case 'invalid':
      return { tone: 'warn', icon: TriangleAlert, text: result.message }
    case 'rate_limited':
      return { tone: 'warn', icon: TriangleAlert, text: ui.rateLimited }
    case 'unavailable':
      return { tone: 'warn', icon: TriangleAlert, text: ui.unavailable }
  }
}

function describeState(
  state: CheckState,
  formatProblem: NameProblem | null,
  ui: Ui['domain'],
): Message | null {
  if (formatProblem !== null) {
    return {
      tone: 'warn',
      icon: TriangleAlert,
      text: ui.problems[formatProblem](NAME_MIN_LENGTH, NAME_MAX_LENGTH),
    }
  }
  if (state.phase === 'checking') {
    return { tone: 'busy', icon: LoaderCircle, text: ui.checking(fullAddress(state.name)) }
  }
  if (state.phase === 'done') return describeResult(state.result, ui)
  return null
}

/**
 * Formulário (dentro do popup DomainDialog) para conferir, de verdade, se um nome de endereço grátis (`nome.axeldev.workers.dev`)
 * ainda está livre. Quem responde é o Worker (worker/domain.ts), que consulta a conta na Cloudflare.
 */
export function DomainChecker() {
  const inputId = useId()
  const lang = useLang()
  const { domain: ui } = useUi()
  const hintId = `${inputId}-dica`
  const [value, setValue] = useState('')
  const [formatProblem, setFormatProblem] = useState<NameProblem | null>(null)
  const { state, check, reset } = useDomainCheck()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.toLowerCase())
    // O resultado anterior era de outro nome: some assim que a pessoa volta a digitar.
    setFormatProblem(null)
    reset()
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validation = validateName(value)
    if (!validation.ok) {
      reset()
      setFormatProblem(validation.problem)
      return
    }
    setFormatProblem(null)
    void check(validation.name)
  }

  const message = describeState(state, formatProblem, ui)
  const checking = state.phase === 'checking'

  return (
    <form className={styles.panel} onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className={styles.label}>
        {ui.fieldLabel}
      </label>
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            id={inputId}
            name="nome"
            type="text"
            value={value}
            onChange={handleChange}
            maxLength={NAME_MAX_LENGTH}
            placeholder={ui.placeholder}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby={hintId}
            aria-invalid={formatProblem !== null}
            className={styles.input}
          />
          <span aria-hidden="true" className={styles.suffix}>
            .{DOMAIN_SUFFIX}
          </span>
        </div>
        <Button disabled={checking}>{checking ? ui.verifying : ui.verify}</Button>
      </div>

      <p id={hintId} className={styles.hint}>
        {ui.hint(NAME_MIN_LENGTH, NAME_MAX_LENGTH)}
      </p>

      <div role="status" aria-live="polite" className={styles.result}>
        {message === null ? null : (
          <div className={styles.message} data-tone={message.tone}>
            {message.tone === 'good' ? (
              <AvailableBadge />
            ) : (
              <LineIcon
                icon={message.icon}
                size={20}
                className={cx(styles.icon, message.tone === 'busy' && styles.spinner)}
              />
            )}
            <div className={styles.text}>
              <p>{message.text}</p>
              {message.offer === undefined ? null : (
                <div className={styles.offer}>
                  <ButtonLink href={pagePath(lang, 'quote')} arrow="→">
                    {ui.buildQuote}
                  </ButtonLink>
                  <ButtonLink
                    href={whatsappHref(ui.whatsappMessage(message.offer))}
                    external
                    variant="secondary"
                    arrow="↗"
                  >
                    {ui.talkOnWhatsApp}
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
