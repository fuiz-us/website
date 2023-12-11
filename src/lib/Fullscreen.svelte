<script lang="ts">
	import fullscreenEnter from '$lib/assets/fullscreen_enter.svg';
	import fullscreenExit from '$lib/assets/fullscreen_exit.svg';
	import { onMount } from 'svelte';
	import IconButton from './IconButton.svelte';

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

<IconButton
	on:click={toggle}
	src={fullscreen ? fullscreenExit : fullscreenEnter}
	alt={fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
	size="24px"
/>
