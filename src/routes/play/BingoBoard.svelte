<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let assignedStatements: { id: number; text: string; crossed: boolean }[];

	$: len = assignedStatements.length;

	$: columns = Math.ceil(Math.sqrt(len));

	const dispatch = createEventDispatcher<{ index: number }>();
</script>

<div
	style:display="grid"
	style:grid-template-columns="repeat({columns}, 1fr)"
	style:grid-template-rows="repeat({Math.ceil(len / columns)}, 1fr)"
	style:gap="0.15em"
	style:padding="0.15em"
	style:background="currentcolor"
	style:text-align="center"
	style:border-radius="0.2em"
>
	{#each assignedStatements as { id, text, crossed } (id)}
		{#if crossed}
			<div
				style:display="flex"
				style:align-items="center"
				style:justify-content="center"
				style:text-decoration="line-through"
				style:color="var(--background-color)"
			>
				{text}
			</div>
		{:else}
			<button
				style:appearance="none"
				style:border="none"
				style:color="inherit"
				style:font="inherit"
				style:cursor="pointer"
				style:background="var(--background-color)"
				on:click={() => dispatch('index', id)}
			>
				{text}
			</button>
		{/if}
	{/each}
</div>
