import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      renderer({
        resolve: {
          serialport: { type: 'cjs' },
          got: { type: 'esm' }
        }
      })
    ]
  }
})
