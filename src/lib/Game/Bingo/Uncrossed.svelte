<script lang="ts">
	import { palette_light } from '$lib';
	import { createEventDispatcher } from 'svelte';
	import vote from '$lib/assets/vote.svg';

	export let user_votes: number;
	export let text: string;
	export let id: number;

	const dispatch = createEventDispatcher<{ index: number }>();
</script>

<button
	on:click={() => dispatch('index', id)}
	style:appearance="none"
	style:border="none"
	style:display="flex"
	style:justify-content="space-between"
	style:padding="10px"
	style:background={'#000000c0'}
	style:color={palette_light}
	style:border-radius="5px"
	style:font-size="x-large"
	style:cursor="pointer"
>
	<div style:flex="1">
		{text}
	</div>
	<div style:display="flex" style:align-items="center" style:gap="5px">
		<img src={vote} alt="vote" style:height="1em" style:width="1em" style:filter="invert(1)" />
		<div>
			{user_votes}
		</div>
	</div>
</button>
