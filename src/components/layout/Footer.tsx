import { useRef } from 'react'
import { CodeXml, Compass, MessageCircle, ShieldCheck } from 'lucide-react'
import { Brand } from '@/components/brand/Brand'
import { FooterCrow } from '@/components/brand/FooterCrow'
import { BrandIcon } from '@/components/icons/BrandIcon'
import { ContactLink } from '@/components/ui/ContactLink'
import { Cursor } from '@/components/ui/Cursor'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { LineIcon } from '@/components/ui/LineIcon'
import { contactChannels } from '@/content/contact'
import { SECTION_IDS, sections } from '@/content/sections'
import { site } from '@/content/site'
import { Container } from './Container'
import styles from './Footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  // O corvo do rodapé é o logo: pousa no espaço dele e sai de lá para passear.
  const perch = useRef<HTMLSpanElement>(null)

  return (
    <footer className={styles.foot}>
      <Container className={styles.wrap}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brandRow}>
              <Brand href="#inicio" slotRef={perch} />
            </div>
            <p className={styles.about}>{site.footer.about}</p>
          </div>

          <nav aria-label="Rodapé">
            <h3 className={styles.heading}>
              <LineIcon icon={Compass} size={14} />
              Navegar
            </h3>
            <ul role="list" className={styles.list}>
              {SECTION_IDS.map((id) => (
                <li key={id} className={styles.item}>
                  <LineIcon icon={sections[id].icon} className={styles.icon} />
                  <a href={`#${id}`}>{sections[id].label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={styles.heading}>
              <LineIcon icon={ShieldCheck} size={14} />
              Segurança
            </h3>
            <ul role="list" className={styles.list}>
              {site.footer.securityFacts.map((fact) => (
                <li key={fact.label} className={styles.item}>
                  <LineIcon icon={fact.icon} className={styles.icon} />
                  {fact.label}
                </li>
              ))}
              <li className={styles.item}>
                <LineIcon icon={CodeXml} className={styles.icon} />
                <ExternalLink href={site.links.repository} showArrow>
                  Código-fonte
                </ExternalLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.heading}>
              <LineIcon icon={MessageCircle} size={14} />
              Contato
            </h3>
            <ul role="list" className={styles.list}>
              {contactChannels.map((channel) => (
                <li key={channel.id} className={styles.item}>
                  <BrandIcon icon={channel.icon} size={16} className={styles.icon} />
                  <ContactLink href={channel.href}>{channel.label}</ContactLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.term}>
          <span>
            <b>©</b> {CURRENT_YEAR} {site.name} · {site.person.name} — todos os direitos reservados
          </span>
          <span>
            {site.footer.closing}
            <Cursor />
          </span>
        </div>
      </Container>

      {/* Vem DEPOIS do logo de propósito: o corvo mede o poleiro (o logo) ao montar, e a referência
          só existe quando o logo já foi montado. O CSS o desenha atrás do texto. */}
      <FooterCrow homeRef={perch} />
    </footer>
  )
}
