import { BrandIcon } from '@/components/icons/BrandIcon'
import { Section } from '@/components/layout/Section'
import { IconBox } from '@/components/ui/IconBox'
import type { Service } from '@/content/services'
import { pagePath } from '@/i18n/lang'
import { useContent, useLang, useUi } from '@/i18n/useI18n'
import styles from './Services.module.css'

function ServiceItem({ service }: { readonly service: Service }) {
  const lang = useLang()
  const { services: ui } = useUi()
  // O item vai na URL (?item=...): a página do orçamento já abre com ele marcado.
  const quoteHref =
    service.quoteItem === undefined
      ? pagePath(lang, 'quote')
      : `${pagePath(lang, 'quote')}?item=${service.quoteItem}`

  return (
    <li className={styles.item}>
      <IconBox icon={service.icon} />
      <div>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>
        {service.brands ? (
          <ul role="list" className={styles.brands}>
            {service.brands.map((brand) => (
              <li key={brand.title}>
                <BrandIcon icon={brand} size={20} />
              </li>
            ))}
          </ul>
        ) : null}
        <a href={quoteHref} className={styles.quote} aria-label={ui.quoteFor(service.title)}>
          {ui.quote} <span aria-hidden="true">→</span>
        </a>
      </div>
    </li>
  )
}

export function Services() {
  const { services } = useContent()

  return (
    <Section id="servicos">
      <ul role="list" className={styles.grid}>
        {services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </ul>
    </Section>
  )
}
