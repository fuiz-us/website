<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime.js';
	import { page } from '$app/stores';
	import IconButton from './IconButton.svelte';
	import { createDialog } from 'svelte-headlessui';
	import { i18n } from './i18n';

	const dialog = createDialog();

	interface Props {
		up?: boolean;
	}

	let { up = false }: Props = $props();
</script>

<div>
	<IconButton
		onclick={() => {
			dialog.open();
		}}
		src="$lib/assets/language.svg"
		alt={m.language()}
		size="1em"
	/>

	{#if $dialog.expanded}
		<ul use:dialog.modal style:--y={up ? 'calc(-100% - 1.25em)' : '0'}>
			{#each availableLanguageTags as lang}
				<li>
					<!-- the hreflang attribute decides which language the link points to -->
					<a
						href={i18n.route($page.url.pathname + $page.url.search)}
						hreflang={lang}
						aria-current={lang === languageTag() ? 'page' : undefined}
					>
						{new Intl.DisplayNames([lang], {
							type: 'language'
						}).of(lang)}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
	}

	ul {
		position: absolute;
		background: var(--background-color);
		border: 0.1em solid;
		border-radius: 0.7em;
		transform-origin: top;
		padding: 0.3em;
		transform: translateX(calc(-100% + 1.25em)) translateY(var(--y));

		z-index: 100;
		margin: 0.15em 0;
	}

	ul:dir(rtl) {
		transform: translateX(calc(100% - 1.25em)) translateY(var(--y));
	}

	li {
		display: block;
		text-transform: capitalize;
		padding: 0.3em 0.3em;
		line-height: 1.25;
		white-space: nowrap;
	}

	a {
		color: inherit;
		text-decoration: none;
	}
</style>
