<script lang="ts">
	import factual from '$lib/assets/correct.svg';
	import wrong from '$lib/assets/wrong.svg';
	import { backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import Icon from './Icon.svelte';

	export let value: boolean;
	export let color: string | undefined = undefined;

	const duration = 150;
</script>

<svelte:head>
	<link rel="prefetch" as="image" href={factual} />
	<link rel="prefetch" as="image" href={wrong} />
</svelte:head>

<button
	style:height="100%"
	style:aspect-ratio="1/1"
	style:padding="0"
	style:background="transparent"
	style:width="auto"
	style:box-sizing="border-box"
	role="checkbox"
	aria-checked={value}
	style:font="inherit"
	style:color="var(--palette-light)"
	style:border="none"
	on:click={() => (value = !value)}
>
	<div
		style:height="100%"
		style:width="auto"
		style:aspect-ratio="1/1"
		style:background={color ?? 'var(--accent-color)'}
		style:transition="background 300ms linear"
		style:border="0.2em solid currentcolor"
		style:border-radius="0.5em"
		style:box-sizing="border-box"
	>
		{#if value}
			<div
				in:scale={{ easing: backOut, duration: duration, delay: duration }}
				out:scale={{ easing: backOut, duration: duration }}
			>
				<Icon src={factual} alt="Marked as Correct" size="100%" />
			</div>
		{:else}
			<div
				in:scale={{ easing: backOut, duration: duration, delay: duration }}
				out:scale={{ easing: backOut, duration: duration }}
			>
				<Icon src={wrong} alt="Marked as Wrong" size="100%" />
			</div>
		{/if}
	</div>
</button>
