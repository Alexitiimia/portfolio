import { Brand } from '@/components/brand/Brand'
import { Container } from '@/components/layout/Container'
import { SkipLink } from '@/components/layout/SkipLink'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { site } from '@/content/site'
import { ContactChannels } from '@/sections/contact/ContactChannels'
import { QuotePanel } from '@/sections/contact/QuotePanel'
import styles from './QuotePage.module.css'

const CURRENT_YEAR = new Date().getFullYear()

/** Página própria do orçamento (/orcamento/): serve de link direto para mandar a um cliente. */
export function QuotePage() {
  return (
    <>
      <SkipLink />

      <header className={styles.header}>
        <Container className={styles.bar}>
          <Brand href="/" iconNavigates={false} />
          <div className={styles.actions}>
            <a href="/" className={styles.back}>
              <span aria-hidden="true">←</span> voltar ao portfólio
            </a>
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <main id="conteudo" tabIndex={-1} className={styles.main}>
        <Container>
          <p className={styles.eyebrow} aria-hidden="true">
            $ orcamento --novo
          </p>
          <h1 className={styles.title}>Monte o orçamento do seu projeto</h1>
          <p className={styles.lead}>
            Escolha o que precisa e veja a estimativa. No fim, o resumo segue pronto para o meu
            WhatsApp, sem cadastro e sem pagar nada agora.
          </p>

          <QuotePanel />
          <ContactChannels />
        </Container>
      </main>

      <footer className={styles.foot}>
        <Container className={styles.term}>
          <span>
            <b>©</b> {CURRENT_YEAR} {site.name} · {site.person.name}
          </span>
          <a href="/">voltar ao portfólio</a>
        </Container>
      </footer>
    </>
  )
}
