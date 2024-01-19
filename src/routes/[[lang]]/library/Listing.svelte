<script lang="ts">
	import * as m from '$paraglide/messages';

	import Icon from '$lib/Icon.svelte';
	import type { PublishedFuiz } from '$lib/types';
	import OnlinePublised from './OnlinePublised.svelte';

	export let recentlyPublished: PublishedFuiz[], mostPlayed: PublishedFuiz[];
</script>

<div class="section">
	<h2>{m.recently_published()}</h2>
	<div class="grid">
		{#each recentlyPublished as fuiz}
			<a href="library/public/{fuiz.id}">
				<OnlinePublised data={fuiz} />
			</a>
		{:else}
			<div
				style:display="flex"
				style:flex-direction="column"
				style:opacity="0.7"
				style:align-items="center"
			>
				<Icon src="$lib/assets/ghost.svg" size="min(20vh, 60vw)" alt={m.nothing()} />
				{m.nothing()}
			</div>
		{/each}
	</div>
</div>
<div class="section">
	<h2>{m.most_published()}</h2>
	<div class="grid">
		{#each mostPlayed as fuiz}
			<a href="library/public/{fuiz.id}">
				<OnlinePublised data={fuiz} />
			</a>
		{:else}
			<div
				style:display="flex"
				style:flex-direction="column"
				style:opacity="0.7"
				style:align-items="center"
			>
				<Icon src="$lib/assets/ghost.svg" size="min(20vh, 60vw)" alt={m.nothing()} />
				{m.nothing()}
			</div>
		{/each}
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15ch, 1fr));
		grid-auto-rows: 1fr;
		grid-gap: 0.4em;
	}

	h2 {
		margin: 0.2em 0;
		font-family: 'Poppins';
	}

	.section {
		margin-bottom: 0.8em;
	}

	a {
		color: inherit;
		text-decoration: inherit;
	}
</style>
