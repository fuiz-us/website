<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;

	let fullscreenElement;
</script>

<div
	style:height="100%"
	bind:this={fullscreenElement}
	style:display="flex"
	style:flex-direction="column"
>
	<div style:border-bottom="0.15em solid currentcolor">
		<Topbar on:lock on:next {fullscreenElement} bind:bindableGameInfo {gameInfo} showSkip={true} />
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
