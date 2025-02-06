<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { assertUnreachable, playIdlessConfig } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Icon from '$lib/Icon.svelte';
	import type { FuizOptions, IdlessFuizConfig } from '$lib/types';
	import TypicalPage from '$lib/TypicalPage.svelte';

	interface Props {
		stats: [number, number][];
		player_count: number;
		config: IdlessFuizConfig;
		options: FuizOptions;
	}

	let { stats, player_count, config, options }: Props = $props();
</script>

<TypicalPage>
	<div id="summary">
		<div>
			<FancyButton onclick={async () => await playIdlessConfig(config, options)}>
				<div style:padding="0 0.3em">{m.play_again()}</div>
			</FancyButton>
		</div>
		{#each config.slides as slide, index}
			{@const [correct, wrong] = stats.at(index) || [0, 0]}
			{@const unanswered = player_count - correct - wrong}
			{@const title = ((slide) => {
				switch (true) {
					case 'MultipleChoice' in slide:
						return slide.MultipleChoice.title;
					case 'Order' in slide:
						return slide.Order.title;
					case 'TypeAnswer' in slide:
						return slide.TypeAnswer.title;
					default:
						return assertUnreachable(slide);
				}
			})(slide)}
			<div class="line">
				<div class="question-text" {title}>
					{title}
				</div>
				<div class="stat">
					{correct}
					<Icon src="$lib/assets/correct.svg" alt={m.correct()} size="1em" />
				</div>

				<div class="stat">
					{wrong}
					<Icon src="$lib/assets/wrong.svg" alt={m.wrong()} size="1em" />
				</div>
				<div class="stat">
					{unanswered}
					<Icon src="$lib/assets/timer_off.svg" alt={m.unanswered()} size="1em" />
				</div>
			</div>
		{/each}
	</div>
</TypicalPage>

<style>
	#summary {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		gap: 0.2em;
		width: 100%;
		max-width: min(40ch, 90vw);
	}

	.line {
		display: flex;
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

	.stat {
		display: flex;
		align-items: center;
	}
</style>
