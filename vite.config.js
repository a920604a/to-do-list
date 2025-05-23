import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'to-do-list'
export default defineConfig({
  base: `/${repoName}/`, // GitHub Pages 路徑
  plugins: [react()]
})
