import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
  },
})
