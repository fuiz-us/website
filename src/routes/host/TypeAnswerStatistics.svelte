<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import factual from '$lib/assets/correct.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import Icon from '$lib/Icon.svelte';
	import { buttonColors } from '$lib';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;
	export let answers: string[];
	export let caseSensitive: boolean;
	export let results: [string, number][];
	export let timeLeft: number | undefined = undefined;
	export let timeStarted: number | undefined = undefined;

	$: allAnswers = results
		.concat(
			answers
				.filter(
					(possibleAnswer) =>
						!results.some(([correctAnswerText]) => correctAnswerText === possibleAnswer)
				)
				.map((wrongAnswer) => [wrongAnswer, 0])
		)
		.sort(([, frequencyA], [, frequencyB]) => frequencyB - frequencyA);

	$: maxCount = Math.max(...allAnswers.map(([, count]) => count), 1);

	function matches(answerA: string, answerB: string, caseSensitive: boolean): boolean {
		const trimmedA = answerA.trim();
		const trimmedB = answerB.trim();
		return caseSensitive
			? trimmedA === trimmedB
			: trimmedA.toLowerCase() === trimmedB.toLowerCase();
	}

	$: isCorrect = (text: string) => answers.some((answer) => matches(answer, text, caseSensitive));

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
						{@const correct = isCorrect(text)}
						<div style:text-align="end" style:font-family="Poppins">
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
								style:background={buttonColors[0][0]}
								style:border="0.15em solid {buttonColors[0][1]}"
								style:width="calc(0.5em + {(count / maxCount) * 100}%)"
								style:border-radius="0.6em"
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
