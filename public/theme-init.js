// Roda no <head>, antes da primeira pintura, para não piscar o tema errado.
// Prioridade: escolha salva pela pessoa > preferência do sistema > escuro (padrão do CSS).
'use strict'
;(function () {
  var theme = null

  try {
    var stored = window.localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') theme = stored
  } catch {
    // localStorage bloqueado (modo privado, política do navegador): segue o sistema.
  }

  if (theme === null) {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }

  document.documentElement.setAttribute('data-theme', theme)
})()
