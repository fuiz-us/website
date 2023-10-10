<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import QuestionText from '$lib/Game/QuestionText.svelte';
	import Topbar from './Topbar.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let questionText: string;
	export let volume_on: boolean;
</script>

<div style:box-shadow="0 2px 2px #00000040">
	<Topbar bind:volume_on on:next {questionIndex} {questionTotalCount} {gameId} show_skip={true} />
</div>
<NiceBackground>
	<div
		style:height="100%"
		style:display="flex"
		style:flex-direction="column"
		style:justify-content="center"
	>
		<QuestionText {questionText} topShadow={true} />
	</div>
</NiceBackground>
