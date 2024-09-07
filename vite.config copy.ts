import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		minify: false
	},
	esbuild: {
		keepNames: true
	},
	ssr: {
		external: ['reflect-metadata'],
	},
	plugins: [sveltekit()]
});
