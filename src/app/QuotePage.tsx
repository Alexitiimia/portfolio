import { Brand } from '@/components/brand/Brand'
import { Container } from '@/components/layout/Container'
import { SkipLink } from '@/components/layout/SkipLink'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { pagePath } from '@/i18n/lang'
import { useContent, useLang, useUi } from '@/i18n/useI18n'
import { ContactChannels } from '@/sections/contact/ContactChannels'
import { QuotePanel } from '@/sections/contact/QuotePanel'
import styles from './QuotePage.module.css'

const CURRENT_YEAR = new Date().getFullYear()

/** Página própria do orçamento (/orcamento/): serve de link direto para mandar a um cliente. */
export function QuotePage() {
  const lang = useLang()
  const { quotePage: ui } = useUi()
  const { site, projects } = useContent()
  const home = pagePath(lang, 'home')

  return (
    <>
      <SkipLink />

      <header className={styles.header}>
        <Container className={styles.bar}>
          <Brand href={home} iconNavigates={false} />
          <div className={styles.actions}>
            <a href={home} className={styles.back}>
              <span aria-hidden="true">←</span> {ui.backToPortfolio}
            </a>
            <LanguageSwitcher page="quote" />
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <main id="conteudo" tabIndex={-1} className={styles.main}>
        <Container>
          <p className={styles.eyebrow} aria-hidden="true">
            {ui.eyebrow}
          </p>
          <h1 className={styles.title}>{ui.title}</h1>
          <p className={styles.lead}>{ui.lead}</p>

          <section aria-labelledby="como-funciona" className={styles.how}>
            <h2 id="como-funciona" className={styles.howTitle}>
              {ui.howItWorks}
            </h2>
            <ol role="list" className={styles.steps}>
              {ui.steps.map((step, index) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepText}>{step.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="projetos-no-ar" className={styles.proof}>
            <h2 id="projetos-no-ar" className={styles.howTitle}>
              {ui.proofTitle}
            </h2>
            <p className={styles.proofLead}>{ui.proofLead}</p>
            <ul role="list" className={styles.proofList}>
              {projects.map((project) => {
                const link = project.links[0]
                if (link === undefined) return null
                return (
                  <li key={project.id}>
                    <ExternalLink href={link.href} showArrow className={styles.proofLink}>
                      <img
                        src={project.icon}
                        alt=""
                        width={24}
                        height={24}
                        loading="lazy"
                        decoding="async"
                        className={styles.proofIcon}
                      />
                      <span>{project.name}</span>
                    </ExternalLink>
                  </li>
                )
              })}
            </ul>
          </section>

          <QuotePanel />
          <ContactChannels />
        </Container>
      </main>

      <footer className={styles.foot}>
        <Container className={styles.term}>
          <span>
            <b>©</b> {CURRENT_YEAR} {site.name} · {site.person.name}
          </span>
          <a href={home}>{ui.backToPortfolio}</a>
        </Container>
      </footer>
    </>
  )
}
