import { describe, expect, it } from 'vitest'
import { priceFromHours } from '@/lib/pricing'
import { isHttpsUrl, isMailtoUrl } from '@/lib/url'
import { contactChannels } from './contact'
import { offers } from './offers'
import { projects } from './projects'
import { HOURLY_RATE, quoteCatalog } from './quote'
import { CTA_SECTION_ID, SECTION_IDS, navItems, sectionNumber, sections } from './sections'
import { capabilities, methodologies } from './security'
import { services } from './services'
import { site } from './site'
import { toolGroups } from './tools'

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const SVG_PATH = /^[Mm][\d\s.,eE+\-a-zA-Z]+$/

function expectUniqueSlugs(ids: readonly string[]) {
  for (const id of ids) expect(id, `id inválido: "${id}"`).toMatch(SLUG)
  expect(new Set(ids).size, 'há ids repetidos').toBe(ids.length)
}

function expectCleanText(...values: readonly string[]) {
  for (const value of values) {
    expect(value.length, 'texto vazio').toBeGreaterThan(0)
    expect(value, `espaços sobrando em "${value}"`).toBe(value.trim())
  }
}

describe('seções', () => {
  it('têm identificadores únicos e todas as descrições', () => {
    expectUniqueSlugs(SECTION_IDS)
    for (const id of SECTION_IDS) {
      expectCleanText(sections[id].label, sections[id].navLabel, sections[id].lead)
    }
  })

  it('geram o menu na mesma ordem, com um único botão de destaque', () => {
    expect(navItems.map((item) => item.id)).toEqual([...SECTION_IDS])
    expect(navItems.filter((item) => item.isCta).map((item) => item.id)).toEqual([CTA_SECTION_ID])
  })

  it('numeram a partir de 01, seguindo a ordem da lista', () => {
    expect(sectionNumber(SECTION_IDS[0])).toBe('01')
    expect(sectionNumber(CTA_SECTION_ID)).toBe(
      String(SECTION_IDS.indexOf(CTA_SECTION_ID) + 1).padStart(2, '0'),
    )
  })
})

describe('site', () => {
  it('usa apenas links HTTPS', () => {
    expect(isHttpsUrl(site.links.github)).toBe(true)
    expect(isHttpsUrl(site.links.repository)).toBe(true)
  })

  it('tem marca, barra de status, título e rodapé preenchidos', () => {
    const { statusBar, hero, footer } = site
    expectCleanText(
      site.name,
      site.tagline,
      statusBar.left,
      statusBar.prompt,
      statusBar.command,
      statusBar.result,
      hero.command,
      hero.role,
      hero.lead,
      footer.about,
      footer.closing,
      ...footer.securityFacts.map((fact) => fact.label),
    )
    expect(footer.securityFacts.length).toBeGreaterThan(0)
  })

  it('destaca exatamente uma palavra no título principal', () => {
    const highlighted = site.hero.headline.filter((part) => typeof part !== 'string')
    expect(highlighted).toHaveLength(1)
    for (const part of site.hero.headline) {
      expectCleanText(typeof part === 'string' ? part.trim() : part.mark)
    }
  })
})

describe('projetos', () => {
  it('têm ids únicos, texto e tecnologias', () => {
    expect(projects.length).toBeGreaterThan(0)
    expectUniqueSlugs(projects.map((project) => project.id))

    for (const project of projects) {
      expectCleanText(project.name, project.summary, ...project.stack)
      expect(project.stack.length, `${project.id}: sem tecnologias`).toBeGreaterThan(0)
      expect(new Set(project.stack).size, `${project.id}: tecnologia repetida`).toBe(
        project.stack.length,
      )
      expect(project.icon.length, `${project.id}: sem favicon`).toBeGreaterThan(0)
      expect(Number.isInteger(project.year)).toBe(true)
      expect(project.year).toBeGreaterThanOrEqual(2000)
    }
  })

  it('só linkam para HTTPS', () => {
    for (const project of projects) {
      for (const link of project.links) {
        expectCleanText(link.label)
        expect(isHttpsUrl(link.href), `${project.id}: ${link.href}`).toBe(true)
      }
    }
  })
})

describe('ferramentas', () => {
  it('têm grupos e ferramentas com ids únicos', () => {
    expect(toolGroups.length).toBeGreaterThan(0)
    expectUniqueSlugs(toolGroups.map((group) => group.id))
    expectUniqueSlugs(toolGroups.flatMap((group) => group.tools.map((tool) => tool.id)))
  })

  it('trazem nome, observação limpa e um logo válido', () => {
    for (const group of toolGroups) {
      expectCleanText(group.title)
      expect(group.tools.length, `${group.id}: grupo vazio`).toBeGreaterThan(0)

      for (const tool of group.tools) {
        expectCleanText(tool.name, tool.icon.title)
        if (tool.note !== undefined) expectCleanText(tool.note)
        expect(tool.icon.path, `${tool.id}: desenho do logo inválido`).toMatch(SVG_PATH)
      }
    }
  })
})

describe('serviços', () => {
  it('têm ids únicos e textos preenchidos', () => {
    expect(services.length).toBeGreaterThan(0)
    expectUniqueSlugs(services.map((service) => service.id))
    for (const service of services) expectCleanText(service.title, service.description)
  })

  it('usam logos válidos quando exibem marcas', () => {
    for (const service of services) {
      for (const brand of service.brands ?? []) {
        expect(brand.path, `${service.id}: ${brand.title}`).toMatch(SVG_PATH)
      }
    }
  })
})

describe('segurança', () => {
  it('cobre Black, Grey e White Box, nessa ordem', () => {
    expect(methodologies.map((method) => method.id)).toEqual(['black', 'grey', 'white'])
    for (const method of methodologies) {
      expectCleanText(method.name, method.translation, method.knowledge, method.description)
    }
  })

  it('tem capacidades com ids únicos', () => {
    expectUniqueSlugs(capabilities.map((capability) => capability.id))
    for (const capability of capabilities) expectCleanText(capability.title, capability.description)
  })
})

describe('condições', () => {
  it('têm ids únicos e textos preenchidos', () => {
    expect(offers.length).toBeGreaterThan(0)
    expectUniqueSlugs(offers.map((offer) => offer.id))
    for (const offer of offers) expectCleanText(offer.label, offer.highlight, offer.description)
  })

  it('os 30 dias de suporte grátis ficam dentro do suporte técnico, não num cartão à parte', () => {
    const support = offers.find((offer) => offer.id === 'suporte')

    expect(support?.description).toMatch(/30 dias/)
    expect(offers.some((offer) => offer.label.includes('30 dias'))).toBe(false)
  })
})

describe('contato', () => {
  it('tem ao menos um canal, com ids únicos', () => {
    expect(contactChannels.length).toBeGreaterThan(0)
    expectUniqueSlugs(contactChannels.map((channel) => channel.id))
  })

  it('só usa HTTPS ou e-mail (mailto)', () => {
    for (const channel of contactChannels) {
      expectCleanText(channel.label, channel.value)
      const valid = isMailtoUrl(channel.href) || isHttpsUrl(channel.href)
      expect(valid, `${channel.id}: ${channel.href}`).toBe(true)
      expect(channel.icon.path).toMatch(SVG_PATH)
    }
  })
})

describe('orçamento', () => {
  const items = [...quoteCatalog.projects, ...quoteCatalog.extras]

  it('tem ids únicos e textos limpos', () => {
    expectUniqueSlugs(items.map((item) => item.id))
    for (const item of items) expectCleanText(item.label, item.description)
  })

  it('estima as horas de cada item em números inteiros e positivos', () => {
    for (const item of items) {
      if (item.hours === undefined) continue
      expect(Number.isInteger(item.hours), `${item.id}: horas`).toBe(true)
      expect(item.hours, `${item.id}: horas`).toBeGreaterThan(0)
    }
  })

  it('deixa "Outro projeto" sem horas nem preço: cada caso pede conversa', () => {
    const other = quoteCatalog.projects.find((project) => project.id === 'outro')

    expect(other?.hours).toBeUndefined()
    expect(other?.price).toBeNull()
  })

  it('o preço de cada item vem sempre de horas × valor da hora, sem valor solto', () => {
    for (const item of items) {
      expect(item.price, item.id).toBe(priceFromHours(item.hours ?? 0, HOURLY_RATE))
    }
  })

  it('valor da hora, quando definido, é um número positivo em reais', () => {
    if (HOURLY_RATE === null) return
    expect(Number.isFinite(HOURLY_RATE)).toBe(true)
    expect(HOURLY_RATE).toBeGreaterThan(0)
  })
})
