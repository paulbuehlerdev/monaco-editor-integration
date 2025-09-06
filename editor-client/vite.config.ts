/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import viteServerConfig from './utils/vite/config/vite-server-config';
import viteTestConfig from './utils/vite/config/vite-test-config';

export default defineConfig(() => ({
  ...viteServerConfig,
  test: viteTestConfig('nextrap-elements/nt-element-nav'),
  publicDir: './public/www',
  root: __dirname,

  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules'], // or custom paths
      },
    },
  },
  optimizeDeps: {
    exclude: ['monaco-editor'],
  },
}));
