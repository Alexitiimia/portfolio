import { useEffect, useId, useState } from 'react'
import { Brand } from '@/components/brand/Brand'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SECTION_IDS, navItems, sectionNumber } from '@/content/sections'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cx } from '@/lib/cx'
import { Container } from './Container'
import styles from './Header.module.css'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navId = useId()
  const activeId = useActiveSection(SECTION_IDS)

  // Esc fecha o menu no celular.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <Container className={styles.bar}>
        <Brand href="#inicio" onClick={closeMenu} />

        <nav
          id={navId}
          aria-label="Principal"
          className={cx(styles.nav, menuOpen && styles.navOpen)}
        >
          <ul role="list" className={styles.list}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cx(styles.link, item.isCta && styles.cta)}
                  aria-current={activeId === item.id ? 'location' : undefined}
                  onClick={closeMenu}
                >
                  {item.isCta ? (
                    <span className={styles.online} aria-hidden="true" />
                  ) : (
                    <span className={styles.index}>{sectionNumber(item.id)}</span>
                  )}
                  {item.label}
                  {item.isCta ? <span aria-hidden="true">→</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls={navId}
            onClick={() => {
              setMenuOpen((open) => !open)
            }}
          >
            menu
          </button>
        </div>
      </Container>
    </header>
  )
}
