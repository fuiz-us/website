<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';

	export let name: string;
	export let score: number;
	export let questionText: string;
</script>

<div style:display="flex" style:flex-direction="column" style:height="100%">
	<Topbar {name} {score} />
	<NiceBackground>
		<div
			style:height="100%"
			style:display="flex"
			style:flex-direction="column"
			style:justify-content="center"
		>
			<TextBar text={questionText} topShadow={true} />
		</div>
	</NiceBackground>
</div>
