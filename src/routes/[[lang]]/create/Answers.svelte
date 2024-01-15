<script lang="ts">
	import * as m from '$paraglide/messages';

	import { buttonColors, limits } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Icon from '$lib/Icon.svelte';
	import variables from '$lib/assets/variables.svg';
	import { scale } from 'svelte/transition';
	import Answer from './Answer.svelte';
	import { backOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import type { MultipleChoiceAnswer } from '$lib/types';

	export let answers: MultipleChoiceAnswer[];
</script>

<div id="grid" style:display="grid" style:gap="0.2em" style:width="100%">
	{#each answers as { correct, content, id }, index (id)}
		<div transition:scale={{ easing: backOut, duration: 300 }} animate:flip={{ duration: 300 }}>
			<Answer
				bind:content
				bind:correct
				{index}
				on:click={() => {
					answers.splice(index, 1);
					answers = answers;
				}}
			/>
		</div>
	{/each}
	{#if answers.length < limits.fuiz.multipleChoice.maxAnswerCount}
		<div style:grid-column="1/ -1" transition:scale={{ easing: backOut, duration: 300 }}>
			<FancyButton
				backgroundColor={buttonColors.at(answers.length % buttonColors.length)?.[0]}
				backgroundDeepColor={buttonColors.at(answers.length % buttonColors.length)?.[1]}
				on:click={() => {
					answers.push({
						correct: false,
						content: {
							Text: ''
						},
						id: Date.now()
					});
					answers = answers;
				}}
			>
				<div
					style:height="100%"
					style:text-align="center"
					style:display="flex"
					style:align-items="center"
					style:justify-content="center"
					style:padding="0.2em 0.6em"
					style:gap="0.2em"
					style:box-sizing="border-box"
				>
					<Icon size="1.25em" src={variables} alt={m.add_answer()} />
					<div>{m.add_answer()}</div>
				</div>
			</FancyButton>
		</div>
	{/if}
</div>

<style>
	#grid {
		grid-template-columns: 1fr 1fr;
	}

	@media only screen and (max-width: 600px) {
		#grid {
			grid-template-columns: 1fr;
		}
	}
</style>
