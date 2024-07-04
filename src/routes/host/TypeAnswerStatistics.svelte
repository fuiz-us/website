<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import factual from '$lib/assets/correct.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import Icon from '$lib/Icon.svelte';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;
	export let answers: string[];
	export let results: [string, number][];
	export let timeLeft: number | undefined = undefined;
	export let timeStarted: number | undefined = undefined;

	$: allAnswers = results
		.concat(answers.filter((a) => !results.some((r) => r[0] === a)).map((a) => [a, 0]))
		.sort(([, a], [, b]) => b - a);

	$: maxCount = Math.max(...allAnswers.map(([, count]) => count), 1);

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
			{#if timeLeft !== undefined && timeStarted !== undefined}
				<TimeLeft {timeLeft} {timeStarted} />
			{/if}
			<div style:display="flex" style:justify-content="center">
				<div
					style:display="grid"
					style:grid-template-columns="auto 1fr"
					style:padding="0.5em"
					style:align-items="center"
					style:gap="0.5em"
				>
					{#each allAnswers as [text, count]}
						{@const correct = answers.includes(text)}
						<div style:text-align="end">
							{text}
						</div>
						<div
							style:width="min(20em, 80vw)"
							style:height="100%"
							style:display="flex"
							style:gap="0.4em"
							style:opacity={correct ? 1 : 0.5}
						>
							<div
								style:background="var(--accent-color)"
								style:width="max({(count / maxCount) * 100}%, 0.5em)"
								style:border-radius="0.4em"
								style:height="100%"
							/>
							<div style:font-family="Poppins" style:display="flex" style:gap="0.2em">
								{count}
								{#if correct}
									<div style:display="flex" style:padding="0.2em 0">
										<Icon src={factual} alt={m.correct()} size="1.2em" />
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
