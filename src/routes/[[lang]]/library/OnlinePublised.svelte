<script lang="ts">
	import type { PublishedFuiz } from '$lib/types';

	export let data: PublishedFuiz;
</script>

<div class="container">
	<div class="image-container">
		{#if data.thumbnail}
			<img src={data.thumbnail} alt={data.alt} />
		{/if}
	</div>
	<div class="info">
		{data.title}
		<div class="little">
			{data.author} • played {data.played_count} times
		</div>
	</div>
</div>

<style>
	.container {
		border: 0.15em solid;
		border-radius: 0.7em;
		max-width: 20ch;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background: var(--background-color);
		aspect-ratio: 4/3;
	}

	.image-container {
		flex: 1;
		overflow: hidden;
		display: flex;
		border-bottom: 0.15em solid;
	}

	img {
		width: 100%;
		height: auto;
		flex: 1;
		object-fit: cover;
	}

	.info {
		padding: 0.15em;
	}

	.little {
		font-size: 0.75em;
	}
</style>
