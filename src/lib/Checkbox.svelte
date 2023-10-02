<script lang="ts">
	import factual from '$lib/assets/correct.svg';
	import { backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let value: boolean;
	export let color: string | undefined = undefined;
</script>

<button
	style:height="1.25em"
	style:aspect-ratio="1/1"
	style:width="auto"
	style:padding="4px"
	style:background="white"
	style:border-radius="100%"
	role="checkbox"
	aria-checked={value}
	style:font="inherit"
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
			<img
				src={factual}
				height="100%"
				width="100%"
				alt="correct"
				style:display="flex"
				style:filter="invert(1)"
			/>
		</div>
	{/if}
</button>
