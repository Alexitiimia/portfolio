import type { HeadlineSegment } from '../site'
import type { SectionId } from '../sections'
import type { MethodologyId } from '../security'

/**
 * Traduções do conteúdo (o português fica nos próprios arquivos de src/content/). Cada tabela é
 * indexada pelo `id` do item, então acrescentar um item em português exige acrescentar a tradução
 * nos outros idiomas: um teste (translations.test.ts) confere se nenhum id ficou de fora.
 */
export interface Translations {
  site: {
    statusBar: { left: string; prompt: string; command: string; result: string }
    hero: { command: string; role: string; headline: readonly HeadlineSegment[]; lead: string }
    footer: {
      about: string
      /** Na mesma ordem de `site.footer.securityFacts`. */
      securityFacts: readonly string[]
      closing: string
    }
  }
  sections: Record<SectionId, { label: string; navLabel: string; lead: string }>
  offers: Record<
    string,
    {
      label: string
      highlight: string
      description: string
      callout?: string
      actionLabel?: string
    }
  >
  projects: Record<
    string,
    { summary: string; /** Na mesma ordem de `links`. */ links: readonly string[] }
  >
  tools: {
    groups: Record<string, string>
    /** Só as ferramentas que têm observação, pelo `id`. */
    notes: Record<string, string>
  }
  services: Record<string, { title: string; description: string }>
  security: {
    methodologies: Record<
      MethodologyId,
      { translation: string; knowledge: string; description: string }
    >
    capabilities: Record<string, { title: string; description: string }>
  }
  quote: {
    items: Record<string, { label: string; description: string }>
    deadlines: Record<string, string>
  }
}
