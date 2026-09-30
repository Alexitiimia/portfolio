import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.wrangler', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // HTML injetado à mão abre brecha para XSS e briga com a CSP do site.
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'Não use dangerouslySetInnerHTML: risco de XSS e conflito com a CSP.',
        },
      ],
    },
  },
  {
    files: ['vite.config.ts', 'vite.i18n.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    // Roda no <head> antes do React. Erros aqui são silenciosos, então também passa pelo lint.
    files: ['public/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
])
