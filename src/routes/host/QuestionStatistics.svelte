<script lang="ts">
	import Answers from '$lib/Game/Answers.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Statistics from '$lib/Game/Statistics.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import VerticalSplit from '$lib/Game/VerticalSplit.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';

	interface Props {
		bindableGameInfo: BindableGameInfo;
		gameInfo: SharedGameInfo;
		questionText: string;
		answers: { text: string; count: number; correct: boolean }[];
		timeLeft?: number | undefined;
		timeStarted?: number | undefined;
		onlock?: (locked: boolean) => void;
		onnext?: () => void;
	}

	let {
		bindableGameInfo = $bindable(),
		gameInfo,
		questionText,
		answers,
		timeLeft = undefined,
		timeStarted = undefined,
		onlock,
		onnext
	}: Props = $props();

	let fullscreenElement: HTMLElement | undefined = $state();
</script>

<div
	bind:this={fullscreenElement}
	style:height="100%"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:bindableGameInfo {gameInfo} {fullscreenElement} {onlock} />
	<TextBar {onnext} text={questionText} showNext={true} />
	<div style:flex="1">
		<NiceBackground>
			<VerticalSplit>
				{#snippet top()}
					{#if timeLeft !== undefined && timeStarted !== undefined}
						<TimeLeft {timeLeft} {timeStarted} />
					{/if}
					<Statistics
						statistics={answers.map(({ count, correct }) => {
							return { count, correct };
						})}
					/>
				{/snippet}
				{#snippet bottom()}
					<Answers {answers} />
				{/snippet}
			</VerticalSplit>
		</NiceBackground>
	</div>
</div>
