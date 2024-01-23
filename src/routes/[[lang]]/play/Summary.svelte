<script lang="ts">
	import * as m from '$paraglide/messages';

	import Icon from '$lib/Icon.svelte';
	import type { IdlessFuizConfig } from '$lib/types';
	import TypicalPage from '$lib/TypicalPage.svelte';

	export let score:
		| {
				points: number;
				position: number;
		  }
		| undefined;

	export let points: number[];

	export let config: IdlessFuizConfig;
</script>

<TypicalPage>
	<div>
		<div style:margin-bottom="0.5em">
			{#if score}
				{m.placed_summary({
					position: score.position + 1,
					points: score.points
				})}
			{:else}
				{m.not_on_leaderboard()}
			{/if}
		</div>
		<div id="summary">
			{#each config.slides as slide, index}
				{@const correct = points.at(index) || 0 > 0}
				<div class="line">
					<div class="question-text" title={slide.MultipleChoice.title}>
						{slide.MultipleChoice.title}
					</div>
					{#if correct}
						<Icon src="$lib/assets/correct.svg" alt={m.correct()} size="1em" />
					{:else}
						<Icon src="$lib/assets/wrong.svg" alt={m.wrong()} size="1em" />
						<div class="answers">
							<div>{m.correct_answers()}</div>
							<ul>
								{#each slide.MultipleChoice.answers.filter((a) => a.correct) as answer}
									<li>
										{answer.content.Text}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</TypicalPage>

<style>
	#summary {
		display: flex;
		flex-direction: column;
		gap: 0.4em;
		width: 100%;
		max-width: min(40ch, 90vw);
	}

	.line {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		overflow: hidden;
		border: 0.15em solid;
		padding: 0.15em 0.5em;
		border-radius: 0.7em;
		background-color: var(--background-color);
		gap: 0.25em;
	}

	.question-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.answers {
		width: 100%;
	}

	ul {
		display: flex;
		flex-direction: column;
		margin: 0;
	}
</style>
