/**
 * O jsdom ainda não implementa `showModal()`/`close()` do <dialog>. Este apoio faz o mínimo que o
 * navegador faz: marca `open`, dispara o evento `close` e o `cancel` do Esc não é simulado aqui.
 */
export function mockDialog(): void {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
