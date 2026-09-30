import { useState } from 'react'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { IconBox } from '@/components/ui/IconBox'
import { offers } from '@/content/offers'
import { DomainDialog } from './DomainDialog'
import styles from './Offers.module.css'

export function Offers() {
  const [checkingDomain, setCheckingDomain] = useState(false)

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
            {offer.callout === undefined ? null : <p className={styles.callout}>{offer.callout}</p>}
            {offer.action === undefined ? null : (
              <div className={styles.action}>
                <Button
                  type="button"
                  variant="secondary"
                  haspopup="dialog"
                  onClick={() => {
                    setCheckingDomain(true)
                  }}
                >
                  {offer.action.label}
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <DomainDialog
        open={checkingDomain}
        onClose={() => {
          setCheckingDomain(false)
        }}
      />
    </Section>
  )
}
