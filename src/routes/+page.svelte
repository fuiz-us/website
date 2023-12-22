<script lang="ts">
	import paint from '$lib/assets/paint.svg';
	import game from '$lib/assets/game.svg';

	import Icon from '$lib/Icon.svelte';
	import Header from '$lib/Header.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import FancyAnchorButton from '$lib/FancyAnchorButton.svelte';
	import Anchor from '$lib/Anchor.svelte';

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
						<Icon src={paint} alt="paint" size="40px" />
						<div>Create</div>
					</div>
				</FancyAnchorButton>
			</div>
			<div>
				<FancyAnchorButton href="/play">
					<div class="a">
						<Icon size="40px" src={game} alt="game" />
						<div>Play</div>
					</div>
				</FancyAnchorButton>
			</div>
		</nav>
	</header>
	<section>
		<div>
			<h2>Fun, Interactive, Engaging. Create with Fuiz.</h2>
			<enhanced:img
				class="img"
				src="./example.png"
				alt="Fuiz features include being open source, having beautiful design, being leightweight, and being privacy friendly"
				sizes="min(3000px, 90vw)"
			/>
		</div>
	</section>
	<section>
		<div>
			<h2>Community Made, and Community Driven</h2>
			<p>
				We did not create Fuiz for profit. We believe in privacy-focused open source solutions to
				provide a fairer education across the world.
			</p>
		</div>
	</section>
	<section>
		<div>
			<h2>Better Than The Rest</h2>
			<p>
				Fuiz provides a better experience because it is built to do so. Other platforms
				intentionally offer worse experience to force you into buying overly expensive plans.
			</p>
		</div>
	</section>
	<section>
		<div>
			<h2>Always Open Source</h2>
			<p>
				As per the AGPLv3 license, Fuiz will always be open source. You can modify and run the
				<Anchor href="https://gitlab.com/opencode-mit">source code</Anchor>
				as you please.
			</p>
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
		padding: 1em;

		@media (max-width: 600px) {
			flex-direction: column;
			align-items: stretch;
		}

		gap: 1em;
	}

	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}

	nav > div {
		flex: 1;
	}

	.a {
		display: flex;
		font-family: 'Poppins';
		align-items: center;
		justify-content: center;
		gap: 5px;
		font-size: 28px;
		padding: 5px;
	}

	section {
		& div {
			max-width: 45ch;
			margin: auto;
		}

		font-size: 32px;
		text-align: center;

		padding: 1em;
	}

	h2 {
		margin: 0 0 0.5em;
		font-family: 'Poppins';
	}

	p {
		margin: 0 0 0.5em;
	}

	.img {
		max-width: 100%;
		height: auto;
		border-radius: 5px;
		box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
	}

	section:nth-of-type(even) {
		background-color: var(--color);
		color: var(--background-color);
	}
</style>
