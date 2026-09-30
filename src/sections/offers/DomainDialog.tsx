import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { LineIcon } from '@/components/ui/LineIcon'
import { DOMAIN_SUFFIX } from '@/lib/domainName'
import { DomainChecker } from './DomainChecker'
import styles from './DomainDialog.module.css'

interface DomainDialogProps {
  readonly open: boolean
  readonly onClose: () => void
}

/**
 * Popup para conferir se um nome de endereço grátis está livre. Usa o <dialog> nativo: o navegador
 * prende o foco lá dentro, esconde o resto da página dos leitores de tela e fecha com Esc. Também
 * fecha ao clicar fora ou no "X". O conteúdo só existe enquanto aberto, então cada abertura começa
 * do zero.
 */
export function DomainDialog({ open, onClose }: DomainDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null) return
    if (open && !dialog.open) {
      // Sem <dialog> moderno (navegador muito antigo), abre como bloco comum em vez de quebrar.
      if (typeof dialog.showModal === 'function') dialog.showModal()
      else dialog.setAttribute('open', '')
      dialog.querySelector('input')?.focus()
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Só o clique no fundo escurecido (o próprio <dialog>) fecha; dentro do conteúdo, não.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {open ? (
        <div className={styles.body}>
          <div className={styles.head}>
            <h2 id={titleId} className={styles.title}>
              Confira se o nome do seu site está livre
            </h2>
            <IconButton label="Fechar" onClick={onClose}>
              <LineIcon icon={X} size={18} />
            </IconButton>
          </div>
          <p className={styles.lead}>
            O endereço grátis do primeiro ano tem o formato <b>seunome.{DOMAIN_SUFFIX}</b>. A
            consulta é feita na hora, direto na conta da Cloudflare.
          </p>
          <DomainChecker />
        </div>
      ) : null}
    </dialog>
  )
}
