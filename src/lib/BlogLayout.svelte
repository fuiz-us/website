<script lang="ts">
	import type { Metadata } from '../routes/posts/lib';
	import { languageTag } from '$lib/paraglide/runtime.js';

	interface Props {
		metadata: Metadata;
		children?: import('svelte').Snippet;
	}

	let { metadata, children }: Props = $props();
</script>

<svelte:head>
	<title>{metadata.title}</title>
	<meta property="og:title" content={metadata.title} />
	<meta name="description" content={metadata.description} />
	<meta property="og:description" content={metadata.description} />
</svelte:head>

<div>
	<hgroup>
		<h1>
			{metadata.title}
		</h1>
		<p class="desc">
			{metadata.description}
		</p>
		<p class="date">
			{metadata.date.toLocaleDateString(languageTag(), {
				year: 'numeric',
				day: 'numeric',
				month: 'short'
			})}
		</p>
		<div class="image-container">
			<img src={metadata.image} alt={metadata.imageAlt} />
		</div>
	</hgroup>
	<div class="article">
		{@render children?.()}
	</div>
</div>

<style>
	hgroup {
		text-align: center;
	}

	h1 {
		font-family: 'Poppins';
	}

	.date {
		margin: 0.25em 0;
		opacity: 0.7;
	}

	.image-container {
		margin: 0.5em;
		overflow: hidden;
	}

	img {
		border: 0.15em solid;
		border-radius: 0.7em;
		max-width: 100%;
		box-sizing: border-box;
	}

	.article {
		padding: 0.5em;
		max-width: 50ch;
		margin: 0 auto;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		margin: 0.5em 0;
		font-family: 'Poppins';
	}

	:global(p) {
		margin: 1em 0;
	}

	:global(a) {
		color: inherit;
	}
</style>
