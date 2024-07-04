<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { createEventDispatcher } from 'svelte';
	import vote from '$lib/assets/vote.svg';
	import Icon from '$lib/Icon.svelte';

	export let userVotes: number;
	export let text: string;
	export let id: number;

	const dispatch = createEventDispatcher<{ index: number }>();
</script>

<button
	on:click={() => dispatch('index', id)}
	style:appearance="none"
	style:display="flex"
	style:font="inherit"
	style:color="inherit"
	style:justify-content="space-between"
	style:background="var(--background-color)"
	style:border="0.15em solid currentcolor"
	style:padding="0.15em 0.4em"
	style:border-radius="0.6em"
	style:cursor="pointer"
>
	<div style:flex="1">
		{text}
	</div>
	<div style:display="flex" style:align-items="center" style:gap="5px">
		<Icon src={vote} alt={m.vote()} size="1em" />
		<div>
			{userVotes}
		</div>
	</div>
</button>
