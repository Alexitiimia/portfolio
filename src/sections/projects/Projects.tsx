import { Section } from '@/components/layout/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { projects, type Project } from '@/content/projects'
import styles from './Projects.module.css'

function ProjectItem({ project }: { readonly project: Project }) {
  return (
    <article className={styles.project}>
      <p className={styles.year}>{project.year}</p>

      <div className={styles.main}>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.summary}>{project.summary}</p>
      </div>

      <div className={styles.aside}>
        <ul role="list" aria-label="Tecnologias" className={styles.stack}>
          {project.stack.map((item) => (
            <li key={item} className={styles.tag}>
              {item}
            </li>
          ))}
        </ul>

        {project.links.length > 0 ? (
          <ul role="list" className={styles.links}>
            {project.links.map((link) => (
              <li key={link.href}>
                <ExternalLink href={link.href} showArrow>
                  {link.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}

export function Projects() {
  return (
    <Section id="projetos">
      <ul role="list" className={styles.list}>
        {projects.map((project) => (
          <li key={project.id} className={styles.item}>
            <ProjectItem project={project} />
          </li>
        ))}
        <li className={styles.item}>
          <div className={styles.cta}>
            <p className={styles.ctaText}>O próximo projeto pode ser o seu.</p>
            <ButtonLink href="#contato" arrow="→">
              solicitar orçamento
            </ButtonLink>
          </div>
        </li>
      </ul>
    </Section>
  )
}
