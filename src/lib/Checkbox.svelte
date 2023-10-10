<script lang="ts">
	import factual from '$lib/assets/correct.svg';
	import { backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import Icon from './Icon.svelte';

	export let value: boolean;
	export let color: string | undefined = undefined;
</script>

<button
	style:height="100%"
	style:aspect-ratio="1/1"
	style:width="auto"
	style:padding="4px"
	style:box-sizing="border-box"
	style:background="white"
	style:border-radius="100%"
	role="checkbox"
	aria-checked={value}
	style:font="inherit"
	style:color="inherit"
	style:border="none"
	on:click={() => (value = !value)}
>
	{#if value}
		<div
			style:height="100%"
			style:width="auto"
			style:border-radius="100%"
			style:background={color ?? '#D4131B'}
			style:padding="4px"
			style:box-sizing="border-box"
			transition:scale={{ easing: backOut, duration: 250 }}
		>
			<Icon src={factual} alt="Marked as Correct" size="100%" />
		</div>
	{/if}
</button>
