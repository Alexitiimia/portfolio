import { BrandIcon } from '@/components/icons/BrandIcon'
import { Section } from '@/components/layout/Section'
import { ContactLink } from '@/components/ui/ContactLink'
import { contactChannels } from '@/content/contact'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <Section id="contato">
      <p className={styles.statement}>Vamos tirar o seu projeto do papel.</p>

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
    </Section>
  )
}
