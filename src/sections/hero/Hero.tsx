import { Fragment } from 'react'
import { BrandMark } from '@/components/brand/BrandMark'
import { Container } from '@/components/layout/Container'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Cursor } from '@/components/ui/Cursor'
import { offers } from '@/content/offers'
import { site } from '@/content/site'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className={styles.hero}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.command}>
              $ {site.hero.command}
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
              ver projetos
            </ButtonLink>
            <ButtonLink href="#contato" variant="secondary" arrow="→">
              falar comigo
            </ButtonLink>
          </div>
        </div>

        <div className={styles.art} aria-hidden="true">
          <BrandMark size={320} className={styles.raven} />
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
