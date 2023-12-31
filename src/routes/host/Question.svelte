<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let questionText: string;
	export let volumeOn: boolean;

	let fullscreenElement;
</script>

<div
	style:height="100%"
	bind:this={fullscreenElement}
	style:display="flex"
	style:flex-direction="column"
>
	<div style:border-bottom="0.15em solid currentcolor">
		<Topbar
			bind:volumeOn
			on:next
			{fullscreenElement}
			{questionIndex}
			{questionTotalCount}
			{gameId}
			showSkip={true}
		/>
	</div>
	<div style:flex="1">
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
</div>
