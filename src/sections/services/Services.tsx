import { BrandIcon } from '@/components/icons/BrandIcon'
import { Section } from '@/components/layout/Section'
import { IconBox } from '@/components/ui/IconBox'
import { services, type Service } from '@/content/services'
import styles from './Services.module.css'

function ServiceItem({ service }: { readonly service: Service }) {
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
      </div>
    </li>
  )
}

export function Services() {
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
