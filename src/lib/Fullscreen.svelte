<script lang="ts">
	import fullscreenEnter from '$lib/assets/fullscreen_enter.svg';
	import fullscreenExit from '$lib/assets/fullscreen_exit.svg';
	import { onMount } from 'svelte';

	let fullscreen = false;

	onMount(() => {
		document.addEventListener('fullscreenchange', () => {
			fullscreen = document.fullscreenElement !== null;
		});

		fullscreen = document.fullscreenElement !== null;
	});

	async function toggle() {
		if (fullscreen) {
			await document.exitFullscreen();
		} else {
			await document.documentElement.requestFullscreen();
		}
	}
</script>

<button
	on:click={toggle}
	style:appearance="none"
	style:background="none"
	style:border="none"
	style:padding="0"
	style:display="flex"
	style:height="100%"
	style:width="100%"
	style:cursor="pointer"
>
	{#if fullscreen}
		<img
			src={fullscreenExit}
			alt="Exit fullscreen"
			height="32px"
			width="32px"
			style:height="100%"
		/>
	{:else}
		<img
			src={fullscreenEnter}
			alt="Enter fullscreen"
			height="32px"
			width="32px"
			style:height="100%"
		/>
	{/if}
</button>
