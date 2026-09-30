import type { Lang } from '@/i18n/lang'
import { ui } from '@/i18n/ui'
import { buildContactChannels, type ContactChannel } from './contact'
import { offers, type Offer } from './offers'
import { projects, type Project } from './projects'
import { quoteCatalog, type QuoteCatalog, type QuoteItem } from './quote'
import { buildNavItems, sections, type NavItem, type SectionId, type SectionMeta } from './sections'
import { capabilities, methodologies, type Capability, type Methodology } from './security'
import { services, type Service } from './services'
import { site, type SiteConfig } from './site'
import { toolGroups, type ToolGroup } from './tools'
import { en } from './translations/en'
import { es } from './translations/es'
import type { Translations } from './translations/types'

/** Todo o conteúdo do site, já no idioma pedido. */
export interface Content {
  readonly site: SiteConfig
  readonly sections: Readonly<Record<SectionId, SectionMeta>>
  readonly navItems: readonly NavItem[]
  readonly offers: readonly Offer[]
  readonly projects: readonly Project[]
  readonly toolGroups: readonly ToolGroup[]
  readonly services: readonly Service[]
  readonly methodologies: readonly Methodology[]
  readonly capabilities: readonly Capability[]
  readonly contactChannels: readonly ContactChannel[]
  readonly quoteCatalog: QuoteCatalog
}

const TRANSLATIONS: Readonly<Record<Exclude<Lang, 'pt'>, Translations>> = { en, es }

/** O português é o conteúdo original (arquivos de src/content/): não passa por tradução. */
const PORTUGUESE: Content = {
  site,
  sections,
  navItems: buildNavItems(sections),
  offers,
  projects,
  toolGroups,
  services,
  methodologies,
  capabilities,
  contactChannels: buildContactChannels(ui.pt.contact.whatsappGreeting),
  quoteCatalog,
}

function translateQuoteItem(item: QuoteItem, t: Translations['quote']): QuoteItem {
  const text = t.items[item.id]
  return text === undefined ? item : { ...item, ...text }
}

function translate(t: Translations, lang: Lang): Content {
  const translatedSections = Object.fromEntries(
    (Object.keys(sections) as SectionId[]).map((id) => [
      id,
      { ...sections[id], ...t.sections[id] },
    ]),
  ) as Record<SectionId, SectionMeta>

  return {
    site: {
      ...site,
      statusBar: t.site.statusBar,
      hero: t.site.hero,
      footer: {
        about: t.site.footer.about,
        closing: t.site.footer.closing,
        securityFacts: site.footer.securityFacts.map((fact, index) => ({
          ...fact,
          label: t.site.footer.securityFacts[index] ?? fact.label,
        })),
      },
    },
    sections: translatedSections,
    navItems: buildNavItems(translatedSections),
    offers: offers.map((offer): Offer => {
      const text = t.offers[offer.id]
      if (text === undefined) return offer
      const { actionLabel, ...rest } = text
      return {
        ...offer,
        ...rest,
        ...(offer.action !== undefined && actionLabel !== undefined
          ? { action: { ...offer.action, label: actionLabel } }
          : {}),
      }
    }),
    projects: projects.map((project) => {
      const text = t.projects[project.id]
      if (text === undefined) return project
      return {
        ...project,
        summary: text.summary,
        links: project.links.map((link, index) => ({
          ...link,
          label: text.links[index] ?? link.label,
        })),
      }
    }),
    toolGroups: toolGroups.map((group) => ({
      ...group,
      title: t.tools.groups[group.id] ?? group.title,
      tools: group.tools.map((tool) => {
        const note = t.tools.notes[tool.id]
        return note === undefined ? tool : { ...tool, note }
      }),
    })),
    services: services.map((service) => ({ ...service, ...t.services[service.id] })),
    methodologies: methodologies.map((method) => ({
      ...method,
      ...t.security.methodologies[method.id],
    })),
    capabilities: capabilities.map((capability) => ({
      ...capability,
      ...t.security.capabilities[capability.id],
    })),
    contactChannels: buildContactChannels(ui[lang].contact.whatsappGreeting),
    quoteCatalog: {
      projects: quoteCatalog.projects.map((item) => translateQuoteItem(item, t.quote)),
      extras: quoteCatalog.extras.map((item) => translateQuoteItem(item, t.quote)),
      deadlines: quoteCatalog.deadlines.map((deadline) => ({
        ...deadline,
        label: t.quote.deadlines[deadline.id] ?? deadline.label,
      })),
    },
  }
}

const CACHE = new Map<Lang, Content>()

/** Conteúdo do site no idioma pedido (calculado uma vez por idioma). */
export function contentFor(lang: Lang): Content {
  const cached = CACHE.get(lang)
  if (cached !== undefined) return cached
  const content = lang === 'pt' ? PORTUGUESE : translate(TRANSLATIONS[lang], lang)
  CACHE.set(lang, content)
  return content
}
