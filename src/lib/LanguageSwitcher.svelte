<script lang="ts">
	import * as m from '$paraglide/messages';

	import { availableLanguageTags } from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { route } from '$lib/i18n-routing';
	import IconButton from './IconButton.svelte';
	import { createDialog } from 'svelte-headlessui';

	const dialog = createDialog();

	export let up = false;
</script>

<div>
	<IconButton
		on:click={() => {
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
					<a href={route($page.url.pathname, lang)} hreflang={lang}
						>{new Intl.DisplayNames([lang], {
							type: 'language'
						}).of(lang)}</a
					>
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
	}

	a {
		color: inherit;
		text-decoration: none;
	}
</style>
