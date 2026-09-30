import { useId, useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { contactChannels, whatsappHref } from '@/content/contact'
import type { QuoteCatalog, QuoteItem } from '@/content/quote'
import { useContent, useUi } from '@/i18n/useI18n'
import {
  DETAILS_MAX_LENGTH,
  NAME_MAX_LENGTH,
  buildMessage,
  describePrice,
  instagramDmUrl,
  isReady,
  missingFields,
  priceLabel,
  priceSummary,
  type QuoteText,
} from '@/lib/quote'
import styles from './QuotePanel.module.css'

interface ChoiceProps {
  readonly type: 'radio' | 'checkbox'
  readonly text: QuoteText
  readonly name: string
  readonly item: QuoteItem
  readonly checked: boolean
  readonly onChange: () => void
}

function Choice({ type, text, name, item, checked, onChange }: ChoiceProps) {
  return (
    <label className={styles.choice}>
      <input
        type={type}
        name={name}
        value={item.id}
        checked={checked}
        onChange={onChange}
        className={styles.control}
      />
      <span className={styles.choiceText}>
        <span className={styles.choiceLabel}>{item.label}</span>
        <span className={styles.choiceDescription}>{item.description}</span>
      </span>
      <span className={styles.price}>{priceLabel(item, text)}</span>
    </label>
  )
}

const instagramProfile = contactChannels.find((channel) => channel.id === 'instagram')?.href

/**
 * Painel de orçamento (página /orcamento/). O cliente escolhe o projeto, os extras e o prazo, vê a estimativa e envia o
 * resumo já escrito para o seu WhatsApp (ou Instagram). Nada passa por servidor nem é guardado
 * aqui: o "enviar" é só um link que abre a conversa com a mensagem pronta.
 */
export function QuotePanel({ catalog: custom }: { readonly catalog?: QuoteCatalog }) {
  const uid = useId()
  const content = useContent()
  const { quotePanel: ui } = useUi()
  const catalog = custom ?? content.quoteCatalog
  const { text } = ui
  const [projectId, setProjectId] = useState<string | null>(null)
  const [extraIds, setExtraIds] = useState<readonly string[]>([])
  const [deadlineId, setDeadlineId] = useState(catalog.deadlines[0]?.id ?? '')
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [copied, setCopied] = useState(false)

  const project = catalog.projects.find((item) => item.id === projectId) ?? null
  const extras = catalog.extras.filter((item) => extraIds.includes(item.id))
  const deadlineLabel = catalog.deadlines.find((item) => item.id === deadlineId)?.label ?? ''
  const chosen = project === null ? extras : [project, ...extras]
  const total = describePrice(priceSummary(chosen), text)

  const input = { project, extras, deadlineLabel, name, details }
  const ready = isReady(input)
  const missing = missingFields(input, text)
  const message = buildMessage(input, text)
  const instagramUrl = instagramProfile === undefined ? null : instagramDmUrl(instagramProfile)

  const toggleExtra = (id: string) => {
    setExtraIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const copyMessage = () => {
    if (!('clipboard' in navigator)) return
    navigator.clipboard.writeText(message).then(
      () => {
        setCopied(true)
      },
      () => {
        setCopied(false)
      },
    )
  }

  return (
    <div className={styles.panel}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault()
        }}
        noValidate
      >
        <fieldset className={styles.group}>
          <legend className={styles.legend}>{ui.stepProject}</legend>
          <div className={styles.choices}>
            {catalog.projects.map((item) => (
              <Choice
                key={item.id}
                type="radio"
                text={text}
                name={`${uid}-projeto`}
                item={item}
                checked={projectId === item.id}
                onChange={() => {
                  setProjectId(item.id)
                }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{ui.stepExtras}</legend>
          <div className={styles.choices}>
            {catalog.extras.map((item) => (
              <Choice
                key={item.id}
                type="checkbox"
                text={text}
                name={`${uid}-extras`}
                item={item}
                checked={extraIds.includes(item.id)}
                onChange={() => {
                  toggleExtra(item.id)
                }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{ui.stepDeadline}</legend>
          <div className={styles.pills}>
            {catalog.deadlines.map((item) => (
              <label key={item.id} className={styles.pill}>
                <input
                  type="radio"
                  name={`${uid}-prazo`}
                  value={item.id}
                  checked={deadlineId === item.id}
                  onChange={() => {
                    setDeadlineId(item.id)
                  }}
                  className={styles.control}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.group}>
          <label htmlFor={`${uid}-nome`} className={styles.legend}>
            {ui.stepName}
          </label>
          <input
            id={`${uid}-nome`}
            type="text"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            autoComplete="name"
            placeholder={ui.namePlaceholder}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value)
            }}
            className={styles.input}
          />
        </div>

        <div className={styles.group}>
          <label htmlFor={`${uid}-detalhes`} className={styles.legend}>
            {ui.stepDetails}
          </label>
          <textarea
            id={`${uid}-detalhes`}
            value={details}
            maxLength={DETAILS_MAX_LENGTH}
            rows={4}
            placeholder={ui.detailsPlaceholder}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setDetails(event.target.value)
            }}
            className={styles.textarea}
          />
          <p className={styles.counter}>
            {details.length}/{DETAILS_MAX_LENGTH}
          </p>
        </div>
      </form>

      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>{ui.summary}</h2>

        {chosen.length === 0 ? (
          <p className={styles.empty}>{ui.empty}</p>
        ) : (
          <ul role="list" className={styles.lines}>
            {chosen.map((item) => (
              <li key={item.id} className={styles.line}>
                <span>{item.label}</span>
                <span className={styles.linePrice}>{priceLabel(item, text)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.total} aria-live="polite">
          <span className={styles.totalLabel}>{ui.estimate}</span>
          <span className={styles.totalValue}>{total}</span>
        </p>
        <p className={styles.note}>{ui.note}</p>

        <div className={styles.actions}>
          {ready ? (
            <ButtonLink href={whatsappHref(message)} external arrow="↗">
              {ui.sendWhatsApp}
            </ButtonLink>
          ) : (
            <Button disabled>{ui.sendWhatsApp}</Button>
          )}
          {ready && instagramUrl !== null ? (
            <ButtonLink
              href={instagramUrl}
              external
              variant="secondary"
              arrow="↗"
              onClick={copyMessage}
            >
              {ui.sendInstagram}
            </ButtonLink>
          ) : null}
        </div>

        <p className={styles.status} role="status">
          {ready ? (copied ? ui.copied : ui.ready) : ui.missing(missing.join(text.and))}
        </p>

        <details className={styles.preview}>
          <summary>{ui.preview}</summary>
          <pre className={styles.message}>{message}</pre>
        </details>
        <p className={styles.privacy}>{ui.privacy}</p>
      </div>
    </div>
  )
}
