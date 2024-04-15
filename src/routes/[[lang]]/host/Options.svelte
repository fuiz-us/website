<script lang="ts">
	import * as m from '$paraglide/messages';

	import { playIdlessConfig } from '$lib';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Loading from '$lib/Loading.svelte';
	import Switch from '$lib/Switch.svelte';
	import TypicalPage from '$lib/TypicalPage.svelte';
	import type { IdlessFuizConfig, IdlessSlide } from '$lib/types';
	import Slider from '$lib/Slider.svelte';
	import { getCreation, loadDatabase } from '$lib/storage';
	import type { PageData } from './$types';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';

	export let id: number;
	export let data: PageData;

	let loading = false;

	let errorMessage = '';

	let randomizedNames = false,
		questionsOnPlayersDevices = false,
		shuffleAnswers = false,
		shuffleSlides = false,
		leaderboard = true,
		teams = false,
		teamSize = 4,
		assignRandom = false;

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

	function conditionalShuffleAnswer(slide: IdlessSlide, shuffleAnswers: boolean): IdlessSlide {
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
		config: IdlessFuizConfig,
		shuffleSlides: boolean,
		shuffleAnswers: boolean
	): IdlessFuizConfig {
		return {
			...config,
			slides: (shuffleSlides ? shuffleArray(config.slides) : config.slides).map((slide) =>
				conditionalShuffleAnswer(slide, shuffleAnswers)
			)
		};
	}
</script>

{#await loadDatabase( { google: data.google, oauth: data.user !== null } ).then( (db) => getCreation(id, db) )}
	<Loading />
{:then fuiz}
	{#if !fuiz}
		<ErrorPage errorMessage={m.missing_fuiz()} />
	{:else}
		{@const { config } = fuiz}
		<TypicalPage>
			<form
				on:submit|preventDefault={() => {
					errorMessage = '';
					loading = true;
					playIdlessConfig(shuffle(config, shuffleSlides, shuffleAnswers), {
						random_names: randomizedNames,
						show_answers: questionsOnPlayersDevices || teams,
						no_leaderboard: !leaderboard,
						...(teams && { teams: { size: teamSize, assign_random: assignRandom } })
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
						<Switch id="teams" bind:checked={teams}>{m.teams()}</Switch>
					</div>
					{#if teams}
						<hr />
						<Slider id="team_size" bind:value={teamSize} min={2} max={5}
							>{m.optimal_team_size()}</Slider
						>
						<hr />
						<div class="switch">
							<Switch id="assign_random" bind:checked={assignRandom}>
								{m.assign_random()}
							</Switch>
						</div>
					{/if}
					<hr />
					<div class="switch">
						<Switch
							id="players"
							bind:checked={questionsOnPlayersDevices}
							stuck={teams ? true : undefined}
						>
							{m.questions_on_players_devices()}
						</Switch>
					</div>
					<hr />
					<div class="switch">
						<Switch id="random" bind:checked={randomizedNames}>{m.randomized_names()}</Switch>
					</div>
					<hr />
					<div class="switch">
						<Switch id="shuffle_slides" bind:checked={shuffleSlides}>{m.shuffle_slides()}</Switch>
					</div>
					<hr />
					<div class="switch">
						<Switch id="shuffle_answers" bind:checked={shuffleAnswers}>{m.shuffle_answers()}</Switch
						>
					</div>
					<hr />
					<div class="switch">
						<Switch id="leaderboard" bind:checked={leaderboard}>{m.leaderboard()}</Switch>
					</div>
				</div>
				<ErrorMessage {errorMessage} />
				<div>
					<FancyButton disabled={loading}>
						<div id="button">
							{#if loading}
								<div style:height="1em" style:width="1em">
									<LoadingCircle borderWidth={7} />
								</div>
							{/if}
							{m.start()}
						</div>
					</FancyButton>
				</div>
			</form>
		</TypicalPage>
	{/if}
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
		display: flex;
		align-items: center;
		gap: 0.5em;
		font-family: Poppins;
	}
</style>
