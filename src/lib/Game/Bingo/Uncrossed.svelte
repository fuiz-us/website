<script lang="ts">
	import { palette_light } from '$lib';
	import { createEventDispatcher } from 'svelte';
	import vote from '$lib/assets/vote.svg';
	import Icon from '$lib/Icon.svelte';

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
		<Icon src={vote} alt="vote" size="1em" />
		<div>
			{user_votes}
		</div>
	</div>
</button>
