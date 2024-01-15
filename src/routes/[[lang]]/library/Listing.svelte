<script lang="ts">
	import type { PublishedFuiz } from '$lib';
	import OnlinePublised from './OnlinePublised.svelte';

	export let recentlyPublished: PublishedFuiz[], mostPlayed: PublishedFuiz[];
</script>

<div class="section">
	<h2>Recently Published</h2>
	<div class="grid">
		{#each recentlyPublished as fuiz}
			<a href="library/public/{fuiz.id}">
				<OnlinePublised data={fuiz} />
			</a>
		{/each}
	</div>
</div>
<div class="section">
	<h2>Most Played</h2>
	<div class="grid">
		{#each mostPlayed as fuiz}
			<a href="library/public/{fuiz.id}">
				<OnlinePublised data={fuiz} />
			</a>
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
