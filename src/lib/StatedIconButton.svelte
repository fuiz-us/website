<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IconButton from './IconButton.svelte';

	export let icons: [{ src: string; alt: string }, { src: string; alt: string }];
	export let size: string;

	export let state: boolean;

	$: icon = icons[state ? 1 : 0];

	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();
</script>

<IconButton
	src={icon.src}
	alt={icon.alt}
	{size}
	on:click={() => {
		state = !state;
		dispatch('change', state);
	}}
/>
