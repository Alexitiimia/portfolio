/** URL absoluta em HTTPS. O compilador recusa "http://", caminhos relativos e "javascript:". */
export type HttpsUrl = `https://${string}`

/** Endereço de e-mail no formato `mailto:`. */
export type MailtoUrl = `mailto:${string}`

/** Destino de um canal de contato: um site em HTTPS ou um e-mail. */
export type ContactHref = HttpsUrl | MailtoUrl

/** Confere em tempo de execução o que o tipo `HttpsUrl` garante em tempo de compilação. */
export function isHttpsUrl(value: string): value is HttpsUrl {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.includes('.')
  } catch {
    return false
  }
}

export function isMailtoUrl(value: string): value is MailtoUrl {
  return value.startsWith('mailto:') && value.length > 'mailto:'.length
}
