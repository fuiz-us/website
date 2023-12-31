<script lang="ts">
	import { theme, initTheme } from 'fractils';
	import { onMount } from 'svelte';

	onMount(() => initTheme());
	import paint from '$lib/assets/paint.svg';
	import game from '$lib/assets/game.svg';

	import Icon from '$lib/Icon.svelte';
	import Header from '$lib/Header.svelte';
	import blackLogo from '$lib/assets/dark_logo.svg';
	import whiteLogo from '$lib/assets/white_logo.svg';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import FancyAnchorButton from '$lib/FancyAnchorButton.svelte';
	import Anchor from '$lib/Anchor.svelte';
	import QuestionAnswers from './host/QuestionAnswers.svelte';

	const title = 'Fuiz | Host Live Quizzes Freely';
	const description = 'A free online platform for host and playing live quizzes';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href={PUBLIC_PLAY_URL} />
</svelte:head>

<main>
	<header>
		<Header />
		<nav>
			<div>
				<FancyAnchorButton href="/create">
					<div class="a">
						<Icon src={paint} alt="paint" size="1.2em" />
						<div>Create</div>
					</div>
				</FancyAnchorButton>
			</div>
			<div>
				<FancyAnchorButton href="/play">
					<div class="a">
						<Icon size="1.2em" src={game} alt="game" />
						<div>Play</div>
					</div>
				</FancyAnchorButton>
			</div>
		</nav>
	</header>
	<section>
		<div>
			<h2>Fun, Interactive, Engaging.<br />Create with Fuiz.</h2>
			<div class="slide-container">
				<div class="slide">
					<QuestionAnswers
						questionIndex={0}
						questionText="What are Fuiz features?"
						gameId="21345"
						questionTotalCount={1}
						timeLeft={15000}
						timeStarted={30000}
						answers={['Open Source', 'Beautiful Design', 'Lightweight', 'Privacy Friendly']}
						answeredCount={0}
						volumeOn={false}
						media={{
							Image: {
								Url: {
									url: $theme === 'dark' ? whiteLogo : blackLogo,
									alt: 'Fuiz logo in all black'
								}
							}
						}}
					/>
				</div>
			</div>
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>Community Made, and Community Driven</h2>
				<p>
					We did not create Fuiz for profit. We believe in privacy-focused open source solutions to
					provide a fairer education across the world.
				</p>
			</div>
			<Icon src="$lib/assets/diversity.svg" size="7em" alt="Community" />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>People's Choice</h2>
				<p>
					Fuiz provides a better experience because it is built to do so. Other platforms
					intentionally offer worse experience to force you into buying overly expensive plans.
				</p>
			</div>
			<Icon src="$lib/assets/editor_choice.svg" size="7em" alt="Peoeple's Choice" />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>Always Open Source</h2>
				<p>
					As per the AGPLv3 license, Fuiz will always be open source. You can modify and run the
					<Anchor href="https://gitlab.com/opencode-mit">source code</Anchor>
					as you please.
				</p>
			</div>
			<Icon src="$lib/assets/code_blocks.svg" size="7em" alt="Peoeple's Choice" />
		</div>
	</section>
</main>

<style>
	main {
		background-color: var(--background-color);
		line-height: 1.2;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.3em 0.6em;

		@media (max-width: 600px) {
			flex-direction: column;
			align-items: stretch;
		}

		gap: 0.3em;
	}

	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.3em;
	}

	nav > div {
		flex: 1;
	}

	.a {
		display: flex;
		font-family: 'Poppins';
		align-items: center;
		justify-content: center;
		gap: 0.2em;
		padding: 0.2em;
	}

	section {
		& > div {
			max-width: 45ch;
			margin: auto;
		}

		text-align: center;

		padding: 1em;
	}

	h2 {
		margin: 0 0 0.5em;
		font-family: 'Poppins';
	}

	p {
		margin: 0;
	}

	.slide-container {
		border: 0.15em solid;
		border-radius: 0.9em;
		overflow: hidden;
	}

	.slide {
		position: relative;
		font-size: min(1em, 3vw);
		aspect-ratio: 90 / 72;
		z-index: 1;
	}

	.split {
		& div:first-child {
			flex: 1;
		}
		flex-wrap: wrap-reverse;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1em;
	}
</style>
