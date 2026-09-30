import { Brand } from '@/components/brand/Brand'
import { Container } from '@/components/layout/Container'
import { SkipLink } from '@/components/layout/SkipLink'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
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
  const { site } = useContent()
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
