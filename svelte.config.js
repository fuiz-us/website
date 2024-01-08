import adapter from '@sveltejs/adapter-cloudflare';
import { importAssets } from 'svelte-preprocess-import-assets';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		importAssets({
			sources: (defaultSources) => {
				return [
					...defaultSources,
					{
						tag: 'Icon',
						srcAttributes: ['src']
					},
					{
						tag: 'IconButton',
						srcAttributes: ['src']
					}
				];
			}
		}),
		vitePreprocess()
	],

	kit: {
		adapter: adapter(),

		paths: {
			relative: false
		},

		alias: {
			$paraglide: './src/paraglide'
		}
	}
};

export default config;
