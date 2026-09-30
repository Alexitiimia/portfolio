import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mantenha igual ao "paths" de tsconfig.app.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Nada é embutido em base64 no build. Assim a CSP (public/_headers) continua estrita
    // e previsível: fontes e imagens sempre vêm de arquivos do próprio site.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'worker/**/*.test.ts'],
    restoreMocks: true,
    unstubGlobals: true,
    // Por padrão o Vitest esvazia todo .css importado. Liberamos só a leitura como texto
    // ("?raw"), que os testes usam para conferir tokens de cor e classes de CSS Modules.
    css: { include: [/\.css\?raw$/] },
  },
})
