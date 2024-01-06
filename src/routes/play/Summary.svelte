<script lang="ts">
	import type { IdlessFuizConfig } from '$lib';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import Icon from '$lib/Icon.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';

	export let score:
		| {
				points: number;
				position: number;
		  }
		| undefined;

	export let points: number[];

	export let config: IdlessFuizConfig;
</script>

<NiceBackground>
	<div
		style:height="100%"
		style:padding="0.5em"
		style:gap="0.5em"
		style:display="flex"
		style:box-sizing="border-box"
		style:flex-direction="column"
		style:align-items="center"
	>
		<header>
			<Header />
		</header>
		<div>
			{#if score}
				You placed #{score.position + 1} with {score.points} points.
			{:else}
				You are not on the leaderboard!
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
						<Icon src="$lib/assets/correct.svg" alt="Correct" size="1em" />
					{:else}
						<Icon src="$lib/assets/wrong.svg" alt="Wrong" size="1em" />
						<div class="answers">
							<div>Correct Answers:</div>
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
		<footer>
			<Footer />
		</footer>
	</div>
</NiceBackground>

<style>
	#summary {
		flex: 1;
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

	footer {
		width: 100%;
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
