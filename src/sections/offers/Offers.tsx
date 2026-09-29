import { Section } from '@/components/layout/Section'
import { IconBox } from '@/components/ui/IconBox'
import { offers } from '@/content/offers'
import styles from './Offers.module.css'

export function Offers() {
  return (
    <Section id="condicoes">
      <ul role="list" className={styles.grid}>
        {offers.map((offer) => (
          <li key={offer.id} className={styles.card}>
            <IconBox icon={offer.icon} />
            <div>
              <p className={styles.label}>{offer.label}</p>
              <h3 className={styles.highlight}>{offer.highlight}</h3>
            </div>
            <p className={styles.description}>{offer.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
