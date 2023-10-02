<script lang="ts">
	import type { FuizConfig } from '$lib';
	import Sidebar from './Sidebar.svelte';
	import SlideEditor from './SlideEditor.svelte';

	export let config: FuizConfig;

	let selected_slide_index = 0;

	$: active_slide = config.slides.at(selected_slide_index);
</script>

<div style:display="flex" style:flex="1">
	<Sidebar bind:slides={config.slides} bind:selected_slide_index />
	<div style:height="100%" style:flex="1" style:display="flex" style:flex-direction="column">
		<SlideEditor bind:slide={active_slide} />
	</div>
</div>
