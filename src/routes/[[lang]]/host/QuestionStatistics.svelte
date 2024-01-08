<script lang="ts">
	import Answers from '$lib/Game/Answers.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Statistics from '$lib/Game/Statistics.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import VerticalSplit from '$lib/Game/VerticalSplit.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;
	export let answers: { text: string; count: number; correct: boolean }[];
	export let timeLeft: number | undefined = undefined;
	export let timeStarted: number | undefined = undefined;

	let fullscreenElement;
</script>

<div
	bind:this={fullscreenElement}
	style:height="100%"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:bindableGameInfo {gameInfo} {fullscreenElement} on:lock />
	<TextBar on:next text={questionText} showNext={true} />
	<div style:flex="1">
		<NiceBackground>
			<VerticalSplit>
				<svelte:fragment slot="top">
					{#if timeLeft !== undefined && timeStarted !== undefined}
						<TimeLeft {timeLeft} {timeStarted} />
					{/if}
					<Statistics
						statistics={answers.map(({ count, correct }) => {
							return { count, correct };
						})}
					/>
				</svelte:fragment>
				<svelte:fragment slot="bottom">
					<Answers {answers} />
				</svelte:fragment>
			</VerticalSplit>
		</NiceBackground>
	</div>
</div>
