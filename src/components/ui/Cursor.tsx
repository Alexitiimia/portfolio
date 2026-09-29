import styles from './Cursor.module.css'

/** Cursor de terminal piscando, no tamanho da fonte ao redor. Decorativo. */
export function Cursor() {
  return <i className={styles.cursor} aria-hidden="true" />
}
