import { site } from '@/content/site'
import { Container } from './Container'
import styles from './StatusBar.module.css'

/**
 * Faixa fina no topo, no estilo de terminal. É decoração: fica fora da árvore de acessibilidade
 * (`aria-hidden`), e as mesmas informações de segurança aparecem em texto no rodapé.
 * Só o lado esquerdo aparece no celular.
 */
export function StatusBar() {
  const { left, prompt, command, result } = site.statusBar

  return (
    <div className={styles.bar} aria-hidden="true">
      <Container className={styles.inner}>
        <span>
          <i className={styles.dot} />
          {left}
        </span>
        <span>
          {prompt} {command} <b>{result}</b>
        </span>
      </Container>
    </div>
  )
}
