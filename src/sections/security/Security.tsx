import { Section } from '@/components/layout/Section'
import { IconBox } from '@/components/ui/IconBox'
import { capabilities, methodologies, type Capability } from '@/content/security'
import { BoxDiagram } from './BoxDiagram'
import styles from './Security.module.css'

function CapabilityItem({ capability }: { readonly capability: Capability }) {
  return (
    <li className={styles.capability}>
      <IconBox icon={capability.icon} />
      <div>
        <h3 className={styles.capabilityTitle}>{capability.title}</h3>
        <p className={styles.capabilityText}>{capability.description}</p>
      </div>
    </li>
  )
}

export function Security() {
  return (
    <Section id="seguranca">
      <ul role="list" className={styles.methods}>
        {methodologies.map((method) => (
          <li key={method.id} className={styles.method}>
            <BoxDiagram variant={method.id} />
            <div>
              <p className={styles.knowledge}>Conhecimento do sistema: {method.knowledge}</p>
              <h3 className={styles.name}>{method.name}</h3>
              <p className={styles.translation}>{method.translation}</p>
            </div>
            <p className={styles.description}>{method.description}</p>
          </li>
        ))}
      </ul>

      <ul role="list" className={styles.capabilities}>
        {capabilities.map((capability) => (
          <CapabilityItem key={capability.id} capability={capability} />
        ))}
      </ul>
    </Section>
  )
}
