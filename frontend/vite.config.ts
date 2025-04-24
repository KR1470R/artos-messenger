import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
	cacheDir: './node_modules/.vite_cache',
	publicDir: 'public',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		target: 'es2017',
		minify: 'esbuild',
		outDir: 'build',
		cssCodeSplit: false,
		sourcemap: false,
		chunkSizeWarningLimit: 1000,
		reportCompressedSize: false,
		rollupOptions: {
			input: 'index.html',
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor'
					}
				},
			},
		},
	},
})
