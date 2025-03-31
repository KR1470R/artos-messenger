import react from '@vitejs/plugin-react'
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
		target: 'esnext',
		minify: 'esbuild',
		outDir: 'build',
		cssCodeSplit: true,
		sourcemap: false,
		chunkSizeWarningLimit: 1000,
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
