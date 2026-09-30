import { BrandIcon } from '@/components/icons/BrandIcon'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { Section } from '@/components/layout/Section'
import { useContent } from '@/i18n/useI18n'
import styles from './Tools.module.css'

export function Tools() {
  const { toolGroups } = useContent()

  return (
    <Section id="ferramentas">
      <div className={styles.groups}>
        {toolGroups.map((group) => (
          <div key={group.id} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul role="list" className={styles.grid}>
              {group.tools.map((tool) => (
                <li key={tool.id}>
                  <ExternalLink href={tool.href} className={styles.tile}>
                    <BrandIcon icon={tool.icon} size={28} colored />
                    <span>
                      <span className={styles.name}>{tool.name}</span>
                      {tool.note ? <span className={styles.note}>{tool.note}</span> : null}
                    </span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
