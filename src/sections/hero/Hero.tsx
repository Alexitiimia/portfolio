import { Fragment } from 'react'
import { Container } from '@/components/layout/Container'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Cursor } from '@/components/ui/Cursor'
import { useContent, useUi } from '@/i18n/useI18n'
import { ageOn } from '@/lib/age'
import styles from './Hero.module.css'

export function Hero() {
  const { site, offers } = useContent()
  const ui = useUi()
  const age = ageOn(site.person.birthDate, new Date())

  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className={styles.hero}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.command}>
              $ {site.hero.command}
            </span>
            <span className={styles.name}>
              {site.person.name} · {ui.hero.age(age)}
            </span>
            <span>
              {site.hero.role}
              <Cursor />
            </span>
          </p>

          <h1 id="inicio-titulo" className={styles.title}>
            {site.hero.headline.map((segment, index) => (
              <Fragment key={index}>
                {typeof segment === 'string' ? (
                  segment
                ) : (
                  <span className={styles.mark}>{segment.mark}</span>
                )}
              </Fragment>
            ))}
          </h1>

          <p className={styles.lead}>{site.hero.lead}</p>

          <div className={styles.actions}>
            <ButtonLink href="#projetos" arrow="↓">
              {ui.hero.seeProjects}
            </ButtonLink>
            <ButtonLink href="#contato" variant="secondary" arrow="→">
              {ui.hero.talkToMe}
            </ButtonLink>
          </div>
        </div>

        <dl className={styles.facts}>
          {offers.map((offer) => (
            <div key={offer.id} className={styles.fact}>
              <dt className={styles.factLabel}>{offer.label}</dt>
              <dd className={styles.factValue}>{offer.highlight}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
