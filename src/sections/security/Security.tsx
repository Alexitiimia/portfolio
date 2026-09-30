import { Section } from '@/components/layout/Section'
import { IconBox } from '@/components/ui/IconBox'
import { capabilities, methodologies, type Capability, type Methodology } from '@/content/security'
import { BoxDiagram } from './BoxDiagram'
import styles from './Security.module.css'
import { useBoxInteraction } from './useBoxInteraction'

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

/** Um nível de conhecimento. O cartão inteiro reage ao mouse: a caixa acompanha o ponteiro. */
function MethodCard({ method }: { readonly method: Methodology }) {
  const { view, cardRef, svgRef, handlers } = useBoxInteraction()

  return (
    <li ref={cardRef} className={styles.method} {...handlers}>
      <BoxDiagram variant={method.id} view={view} svgRef={svgRef} />
      <div>
        <p className={styles.knowledge}>Conhecimento do sistema: {method.knowledge}</p>
        <h3 className={styles.name}>{method.name}</h3>
        <p className={styles.translation}>{method.translation}</p>
      </div>
      <p className={styles.description}>{method.description}</p>
    </li>
  )
}

export function Security() {
  return (
    <Section id="seguranca">
      <ul role="list" className={styles.methods}>
        {methodologies.map((method) => (
          <MethodCard key={method.id} method={method} />
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
