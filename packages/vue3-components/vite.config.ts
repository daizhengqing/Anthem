import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { opendir } from 'node:fs/promises'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

async function listEntry () {
  const entries = {}

  const res = await opendir('./src/components')

  for await (const entry of res) {
    entries[entry.name] = resolve(__dirname + '/lib/' + entry.name + '/index.js')
  }

  return entries
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
      ],
      imports: [
        'vue',
        'vue-router'
      ],
      resolvers: [ElementPlusResolver()],
      vueTemplate: true,
      dts: true,
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx']
  },
  build: {
    lib: {
      entry: await listEntry(),
      name: 'lib',
      fileName: (format, entry) => {
        console.log(format, entry)
        return `${entry}.${format}.js`
      }
    },
    rollupOptions: {
      external: [
        'vue'
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
})
