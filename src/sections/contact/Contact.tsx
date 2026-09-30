import { Section } from '@/components/layout/Section'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ContactChannels } from './ContactChannels'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <Section id="contato">
      <p className={styles.statement}>Vamos tirar o seu projeto do papel.</p>

      <div className={styles.quote}>
        <h3 className={styles.quoteTitle}>Monte o orçamento do seu projeto</h3>
        <p className={styles.quoteText}>
          Escolha o que precisa, veja a estimativa e envie o resumo pronto para o meu WhatsApp. Sem
          cadastro e sem pagar nada agora.
        </p>
        <div className={styles.quoteAction}>
          <ButtonLink href="/orcamento/" arrow="→">
            montar orçamento
          </ButtonLink>
        </div>
      </div>

      <ContactChannels />
    </Section>
  )
}
