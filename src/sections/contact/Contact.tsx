import { Section } from '@/components/layout/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { pagePath } from '@/i18n/lang'
import { useLang, useUi } from '@/i18n/useI18n'
import { ContactChannels } from './ContactChannels'
import styles from './Contact.module.css'

export function Contact() {
  const lang = useLang()
  const ui = useUi()

  return (
    <Section id="contato">
      <p className={styles.statement}>{ui.contact.statement}</p>

      <div className={styles.quote}>
        <h3 className={styles.quoteTitle}>{ui.contact.quoteTitle}</h3>
        <p className={styles.quoteText}>{ui.contact.quoteText}</p>
        <div className={styles.quoteAction}>
          <ButtonLink href={pagePath(lang, 'quote')} arrow="→">
            {ui.contact.quoteButton}
          </ButtonLink>
        </div>
      </div>

      <ContactChannels />
    </Section>
  )
}
