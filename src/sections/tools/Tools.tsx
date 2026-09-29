import { BrandIcon } from '@/components/icons/BrandIcon'
import { Section } from '@/components/layout/Section'
import { toolGroups } from '@/content/tools'
import styles from './Tools.module.css'

export function Tools() {
  return (
    <Section id="ferramentas">
      <div className={styles.groups}>
        {toolGroups.map((group) => (
          <div key={group.id} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul role="list" className={styles.grid}>
              {group.tools.map((tool) => (
                <li key={tool.id} className={styles.tile}>
                  <BrandIcon icon={tool.icon} size={28} />
                  <div>
                    <span className={styles.name}>{tool.name}</span>
                    {tool.note ? <span className={styles.note}>{tool.note}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
