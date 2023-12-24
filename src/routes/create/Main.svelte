<script lang="ts">
	import type { FuizConfig } from '$lib';
	import Sidebar from './Sidebar.svelte';
	import SlideEditor from './SlideEditor.svelte';

	export let config: FuizConfig;

	let selected_slide_index = 0;

	$: active_slide = config.slides.at(selected_slide_index);
</script>

<div
	id="editor"
	style:display="flex"
	style:flex="1"
	style:align-items="stretch"
	style:background="var(--background-color)"
>
	<Sidebar bind:slides={config.slides} bind:selected_slide_index />
	<div style:flex="1" style:display="flex" style:flex-direction="column">
		<SlideEditor bind:slide={active_slide} />
	</div>
</div>

<style>
	#editor {
		flex-direction: row;
	}

	@media only screen and (max-width: 600px) {
		#editor {
			flex-direction: column-reverse;
		}
	}
</style>
