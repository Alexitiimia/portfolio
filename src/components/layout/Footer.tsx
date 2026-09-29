import { Brand } from '@/components/brand/Brand'
import { BrandMark } from '@/components/brand/BrandMark'
import { ContactLink } from '@/components/ui/ContactLink'
import { Cursor } from '@/components/ui/Cursor'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { contactChannels } from '@/content/contact'
import { SECTION_IDS, sections } from '@/content/sections'
import { site } from '@/content/site'
import { Container } from './Container'
import styles from './Footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.foot}>
      <BrandMark size={288} className={styles.ghost} />

      <Container className={styles.wrap}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brandRow}>
              <Brand href="#inicio" />
            </div>
            <p className={styles.about}>{site.footer.about}</p>
          </div>

          <nav aria-label="Rodapé">
            <h3 className={styles.heading}>Navegar</h3>
            <ul role="list" className={styles.list}>
              {SECTION_IDS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`}>{sections[id].label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={styles.heading}>Segurança</h3>
            <ul role="list" className={styles.list}>
              {site.footer.securityFacts.map((fact) => (
                <li key={fact}>
                  <span aria-hidden="true" className={styles.ok}>
                    [ok]
                  </span>{' '}
                  {fact}
                </li>
              ))}
              <li>
                <ExternalLink href={site.links.repository} showArrow>
                  Código-fonte
                </ExternalLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.heading}>Contato</h3>
            <ul role="list" className={styles.list}>
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <ContactLink href={channel.href}>{channel.label}</ContactLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={styles.legal}>
          Logotipos e marcas citados pertencem aos seus respectivos proprietários e aparecem apenas
          para identificar as tecnologias.
        </p>

        <div className={styles.term}>
          <span>
            <b>©</b> {CURRENT_YEAR} {site.name} — todos os direitos reservados
          </span>
          <span>
            {site.footer.closing}
            <Cursor />
          </span>
        </div>
      </Container>
    </footer>
  )
}
