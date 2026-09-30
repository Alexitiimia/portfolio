import { Section } from '@/components/layout/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'
import type { Project } from '@/content/projects'
import { useContent, useUi } from '@/i18n/useI18n'
import styles from './Projects.module.css'

function ProjectItem({ project }: { readonly project: Project }) {
  const ui = useUi()

  return (
    <article className={styles.project}>
      <div className={styles.since}>
        <span className={styles.sinceLabel}>Início</span>
        <time dateTime={String(project.startYear)} className={styles.sinceYear}>
          {project.startYear}
        </time>
      </div>

      <div className={styles.main}>
        <div className={styles.heading}>
          <img
            src={project.icon}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className={styles.icon}
          />
          <h3 className={styles.name}>{project.name}</h3>
        </div>
        <p className={styles.summary}>{project.summary}</p>
      </div>

      <div className={styles.aside}>
        <ul role="list" aria-label={ui.projects.technologies} className={styles.stack}>
          {project.stack.map((item) => (
            <li key={item} className={styles.tag}>
              {item}
            </li>
          ))}
        </ul>

        {project.links.length > 0 ? (
          <ul role="list" className={styles.links}>
            {project.links.map((link, index) => (
              <li key={link.href}>
                <ButtonLink
                  href={link.href}
                  external
                  arrow="↗"
                  variant={index === 0 ? 'primary' : 'secondary'}
                >
                  {link.label}
                </ButtonLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}

export function Projects() {
  const { projects } = useContent()
  const ui = useUi()

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
            <p className={styles.ctaText}>{ui.projects.nextProject}</p>
            <ButtonLink href="#contato" arrow="→">
              {ui.projects.requestQuote}
            </ButtonLink>
          </div>
        </li>
      </ul>
    </Section>
  )
}
