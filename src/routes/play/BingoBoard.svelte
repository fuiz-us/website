<script lang="ts">
	import { palette_light } from '$lib';
	import { createEventDispatcher } from 'svelte';

	export let assigned_statements: { id: number; text: string; crossed: boolean }[];

	$: len = assigned_statements.length;

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
	{#each assigned_statements as { id, text, crossed } (id)}
		{#if crossed}
			<div
				style:display="flex"
				style:align-items="center"
				style:justify-content="center"
				style:text-decoration="line-through"
				style:color={palette_light}
			>
				{text}
			</div>
		{:else}
			<button
				style:appearance="none"
				style:border="none"
				style:font="inherit"
				style:cursor="pointer"
				style:background={palette_light}
				on:click={() => dispatch('index', id)}
			>
				{text}
			</button>
		{/if}
	{/each}
</div>
