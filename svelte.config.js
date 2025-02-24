import adapter from '@sveltejs/adapter-cloudflare';
import { importAssets } from 'svelte-preprocess-import-assets';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
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
		vitePreprocess(),
		mdsvex({
			extensions: ['.md']
		})
	],

	compilerOptions: {
		warningFilter: (warning) => {
			if (warning.code === 'attribute_quoted') {
				return false;
			}
			return true;
		}
	},

	kit: {
		adapter: adapter(),

		paths: {
			relative: false
		},

		prerender: {
			origin: 'https://fuiz.org'
		}
	}
};

export default config;
