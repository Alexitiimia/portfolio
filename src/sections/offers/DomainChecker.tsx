import { useId, useState, type ChangeEvent, type SubmitEvent } from 'react'
import { CircleCheck, CircleX, LoaderCircle, TriangleAlert, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { LineIcon } from '@/components/ui/LineIcon'
import { whatsappHref } from '@/content/contact'
import { cx } from '@/lib/cx'
import {
  DOMAIN_SUFFIX,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  fullAddress,
  validateName,
  type DomainCheck,
} from '@/lib/domainName'
import styles from './DomainChecker.module.css'
import { useDomainCheck, type CheckState } from './useDomainCheck'

interface Message {
  readonly tone: 'good' | 'bad' | 'warn' | 'busy'
  readonly icon: LucideIcon
  readonly text: string
  /** Endereço a oferecer no WhatsApp, quando o nome está livre. */
  readonly offer?: string
}

function describeResult(result: DomainCheck): Message {
  switch (result.status) {
    case 'available':
      return {
        tone: 'good',
        icon: CircleCheck,
        text: `${fullAddress(result.name)} está livre agora. Ele só fica seu depois de fechar comigo, então fale antes que alguém escolha o mesmo.`,
        offer: fullAddress(result.name),
      }
    case 'taken':
      return {
        tone: 'bad',
        icon: CircleX,
        text: `${fullAddress(result.name)} já está em uso. Tente outro nome.`,
      }
    case 'reserved':
      return {
        tone: 'bad',
        icon: CircleX,
        text: `"${result.name}" é um nome reservado. Tente outro.`,
      }
    case 'invalid':
      return { tone: 'warn', icon: TriangleAlert, text: result.message }
    case 'rate_limited':
      return {
        tone: 'warn',
        icon: TriangleAlert,
        text: 'Muitas consultas seguidas. Espere um minuto e tente de novo.',
      }
    case 'unavailable':
      return {
        tone: 'warn',
        icon: TriangleAlert,
        text: 'Não consegui verificar agora. Tente de novo em instantes ou fale comigo pelo WhatsApp.',
      }
  }
}

function describeState(state: CheckState, formatProblem: string | null): Message | null {
  if (formatProblem !== null) return { tone: 'warn', icon: TriangleAlert, text: formatProblem }
  if (state.phase === 'checking') {
    return {
      tone: 'busy',
      icon: LoaderCircle,
      text: `Verificando ${fullAddress(state.name)}…`,
    }
  }
  if (state.phase === 'done') return describeResult(state.result)
  return null
}

/**
 * Campo para conferir, de verdade, se um nome de endereço grátis (`nome.axeldev.workers.dev`)
 * ainda está livre. Quem responde é o Worker (worker/domain.ts), que consulta a conta na Cloudflare.
 */
export function DomainChecker() {
  const inputId = useId()
  const hintId = `${inputId}-dica`
  const [value, setValue] = useState('')
  const [formatProblem, setFormatProblem] = useState<string | null>(null)
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
      setFormatProblem(validation.message)
      return
    }
    setFormatProblem(null)
    void check(validation.name)
  }

  const message = describeState(state, formatProblem)
  const checking = state.phase === 'checking'

  return (
    <form className={styles.panel} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.title}>Confira se o nome do seu site está livre</h3>
      <p className={styles.lead}>
        O endereço grátis do primeiro ano tem o formato <b>seunome.{DOMAIN_SUFFIX}</b>. A consulta é
        feita na hora, direto na conta da Cloudflare.
      </p>

      <label htmlFor={inputId} className={styles.label}>
        Nome desejado
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
            placeholder="minha-loja"
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
        <Button disabled={checking}>{checking ? 'verificando…' : 'verificar'}</Button>
      </div>

      <p id={hintId} className={styles.hint}>
        De {String(NAME_MIN_LENGTH)} a {String(NAME_MAX_LENGTH)} caracteres: letras sem acento,
        números e hífen.
      </p>

      <div role="status" aria-live="polite" className={styles.result}>
        {message === null ? null : (
          <div className={styles.message} data-tone={message.tone}>
            <LineIcon
              icon={message.icon}
              size={20}
              className={cx(styles.icon, message.tone === 'busy' && styles.spinner)}
            />
            <div className={styles.text}>
              <p>{message.text}</p>
              {message.offer === undefined ? null : (
                <div className={styles.offer}>
                  <ButtonLink
                    href={whatsappHref(
                      `Olá! Vi seu portfólio e quero o endereço ${message.offer} para o meu site.`,
                    )}
                    external
                    arrow="↗"
                  >
                    falar no WhatsApp
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
