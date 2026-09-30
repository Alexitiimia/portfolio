import { Section } from '@/components/layout/Section'
import { IconBox } from '@/components/ui/IconBox'
import type { Capability, Methodology } from '@/content/security'
import { useContent, useUi } from '@/i18n/useI18n'
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
  const ui = useUi()
  const { view, cardRef, svgRef, handlers } = useBoxInteraction()

  return (
    <li ref={cardRef} className={styles.method} {...handlers}>
      <BoxDiagram variant={method.id} view={view} svgRef={svgRef} />
      <div>
        <p className={styles.knowledge}>{ui.security.knowledge(method.knowledge)}</p>
        <h3 className={styles.name}>{method.name}</h3>
        <p className={styles.translation}>{method.translation}</p>
      </div>
      <p className={styles.description}>{method.description}</p>
    </li>
  )
}

export function Security() {
  const { methodologies, capabilities } = useContent()

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
