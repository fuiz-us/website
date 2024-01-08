<script lang="ts">
	import * as m from '$paraglide/messages';

	import fullscreenEnter from '$lib/assets/fullscreen_enter.svg';
	import fullscreenExit from '$lib/assets/fullscreen_exit.svg';
	import { onMount } from 'svelte';
	import IconButton from './IconButton.svelte';

	let fullscreen = false;
	export let fullscreenElement: HTMLElement | undefined = undefined;

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
			await (fullscreenElement || document.documentElement).requestFullscreen();
		}
	}
</script>

<IconButton
	on:click={toggle}
	src={fullscreen ? fullscreenExit : fullscreenEnter}
	alt={fullscreen ? m.exit_fullscreen() : m.enter_fullscreen()}
	size="1em"
/>
