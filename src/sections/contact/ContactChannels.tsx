import { BrandIcon } from '@/components/icons/BrandIcon'
import { ContactLink } from '@/components/ui/ContactLink'
import { useContent, useUi } from '@/i18n/useI18n'
import styles from './ContactChannels.module.css'

/** "Prefere conversar direto?" e os botões dos canais de contato. Usado no portfólio e na página de orçamento. */
export function ContactChannels() {
  const { contactChannels } = useContent()
  const ui = useUi()

  return (
    <>
      <p className={styles.orChannel}>{ui.contact.preferDirect}</p>

      <ul role="list" className={styles.channels}>
        {contactChannels.map((channel) => (
          <li key={channel.id}>
            <ContactLink href={channel.href} className={styles.channel}>
              <BrandIcon icon={channel.icon} size={22} />
              <span className={styles.channelLabel}>{channel.label}</span>
              <span className={styles.channelValue}>{channel.value}</span>
            </ContactLink>
          </li>
        ))}
      </ul>
    </>
  )
}
