<script lang="ts">
	import * as m from '$paraglide/messages';

	import { getCreation, playConfig, type FuizConfig, type Slide } from '$lib';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Loading from '$lib/Loading.svelte';
	import Switch from '$lib/Switch.svelte';
	import TypicalPage from '$lib/TypicalPage.svelte';

	export let id: number;

	let loading = false;

	let errorMessage = '';

	export let randomizedNames = false,
		questionsOnPlayersDevices = false,
		shuffleAnswers = false,
		shuffleSlides = false;

	// https://stackoverflow.com/a/2450976
	function shuffleArray<T>(array: T[]): T[] {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex > 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}

	function conditionalShuffleAnswer(slide: Slide, shuffleAnswers: boolean): Slide {
		return {
			...slide,
			MultipleChoice: {
				...slide.MultipleChoice,
				answers: shuffleAnswers
					? shuffleArray(slide.MultipleChoice.answers)
					: slide.MultipleChoice.answers
			}
		};
	}

	function shuffle(
		config: FuizConfig,
		shuffleSlides: boolean,
		shuffleAnswers: boolean
	): FuizConfig {
		return {
			...config,
			slides: (shuffleSlides ? shuffleArray(config.slides) : config.slides).map((slide) =>
				conditionalShuffleAnswer(slide, shuffleAnswers)
			)
		};
	}

	$: creation = getCreation(id);
</script>

{#await creation}
	<Loading />
{:then [config]}
	<TypicalPage>
		<form
			on:submit|preventDefault={() => {
				errorMessage = '';
				loading = true;
				playConfig(shuffle(config, shuffleSlides, shuffleAnswers), {
					random_names: randomizedNames,
					show_answers: questionsOnPlayersDevices
				}).then((err) => {
					loading = false;
					if (err) {
						errorMessage = err;
					}
				});
			}}
		>
			<h2>{m.options()}</h2>
			<div id="options">
				<div class="switch">
					<Switch id="random" bind:checked={randomizedNames}>{m.randomized_names()}</Switch>
				</div>
				<hr />
				<div class="switch">
					<Switch id="players" bind:checked={questionsOnPlayersDevices}>
						{m.questions_on_players_devices()}
					</Switch>
				</div>
				<hr />
				<div class="switch">
					<Switch id="shuffle_slides" bind:checked={shuffleSlides}>{m.shuffle_slides()}</Switch>
				</div>
				<hr />
				<div class="switch">
					<Switch id="shuffle_answers" bind:checked={shuffleAnswers}>{m.shuffle_answers()}</Switch>
				</div>
			</div>
			<ErrorMessage {errorMessage} />
			<div>
				<FancyButton disabled={loading}>
					<div id="button">{m.start()}</div>
				</FancyButton>
			</div>
		</form>
	</TypicalPage>
{/await}

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 25ch;
		gap: 1em;
		padding: 0.5em;
		box-sizing: border-box;
		margin: auto;
	}

	#options {
		display: flex;
		flex-direction: column;
		border: 0.1em solid;
		gap: 0.5em;
		border-radius: 1em;
		padding: 0.5em;
	}

	hr {
		width: 100%;
		color: inherit;
		margin: 0;
	}

	h2 {
		margin: 0;
	}

	#button {
		padding: 0.1em 0.5em;
		font-family: Poppins;
	}
</style>
