<script lang="ts">
	import TypicalPage from '$lib/TypicalPage.svelte';
	import type { PageData } from '../[id]/$types';

	export let data: PageData;

	$: fuiz = data.fuiz;
</script>

<TypicalPage>
	<div id="page">
		<div id="summary">
			<div class="image-container">
				{#if fuiz.thumbnail}
					<img src={fuiz.thumbnail} alt={fuiz.alt} />
				{/if}
			</div>
			<div class="info">
				{fuiz.title}
				<div class="little">
					{fuiz.author} • played {fuiz.played_count} times
				</div>
			</div>
		</div>
		<div>
			<!-- {#each fuiz. as slide}
				
			{/each} -->
		</div>
	</div>
</TypicalPage>

<style>
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

	#summary {
		display: flex;
		flex-direction: column;
		max-width: 20ch;
		border: 0.15em solid;
		border-radius: 0.7em;
		overflow: hidden;
	}

	.info {
		padding: 0.5em;
	}

	#page {
		display: flex;
	}
</style>
