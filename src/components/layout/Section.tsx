import type { ReactNode } from 'react'
import { sectionNumber, sections, type SectionId } from '@/content/sections'
import { Container } from './Container'
import styles from './Section.module.css'

interface SectionProps {
  readonly id: SectionId
  readonly children: ReactNode
}

/**
 * Seção numerada da página. Título, frase de apoio e número vêm de `content/sections.ts`,
 * então o menu, os títulos e as âncoras nunca ficam fora de sincronia.
 */
export function Section({ id, children }: SectionProps) {
  const { label, lead } = sections[id]
  const titleId = `${id}-titulo`

  return (
    <section id={id} aria-labelledby={titleId} className={styles.section}>
      <Container>
        {/*
          Um <div>, e não um <header>: dentro de <section> o <header> vira landmark "banner" em
          leitores de tela e quebraria a navegação por marcos (a seção já é nomeada por
          `aria-labelledby`). Por isso o cabeçalho da página é o único <header> do site.
        */}
        <div className={styles.header}>
          <div className={styles.heading}>
            <p className={styles.index} aria-hidden="true">
              {sectionNumber(id)} //
            </p>
            <h2 id={titleId} className={styles.title}>
              {label}
            </h2>
          </div>
          <p className={styles.lead}>{lead}</p>
        </div>
        {children}
      </Container>
    </section>
  )
}
