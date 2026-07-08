import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@solana/kit': path.resolve(__dirname, './src/mocks/solana.ts'),
      '@solana-program/system': path.resolve(__dirname, './src/mocks/solana.ts'),
      '@solana-program/token': path.resolve(__dirname, './src/mocks/solana.ts'),
      '@solana-program/token-2022': path.resolve(__dirname, './src/mocks/solana.ts')
    }
  }
})
