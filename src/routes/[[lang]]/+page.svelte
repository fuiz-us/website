<script lang="ts">
	import * as m from '$paraglide/messages';
	import warning from '$lib/assets/error.svg';

	import Icon from '$lib/Icon.svelte';
	import logo from '$lib/assets/same_color_logo.svg';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import Anchor from '$lib/Anchor.svelte';
	import QuestionAnswers from './host/QuestionAnswers.svelte';
	import { route } from '$lib/i18n-routing';
	import { languageTag } from '$paraglide/runtime';
	import AnchorMessage from '$lib/AnchorMessage.svelte';
	import MainHeader from './MainHeader.svelte';
	import Footer from '$lib/Footer.svelte';
	import QuestionStatistics from './host/QuestionStatistics.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	const title = m.main_title();
	const description = m.main_desc();

	let answered = false;

	onMount(() => {
		answered = (localStorage.getItem('answered') ?? '').length > 0;
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href={PUBLIC_PLAY_URL + route('/', languageTag())} />
</svelte:head>

<main>
	<MainHeader />
	<section>
		<div>
			<h2>{m.greeting()}<br />{m.create_with()}</h2>
			<div class="slide-container">
				<div class="slide">
					{#if answered}
						<QuestionStatistics
							questionText={m.which_feature()}
							answers={[
								{
									text: m.open_source(),
									count: data.stats.openSource,
									correct: true
								},
								{
									text: m.beautiful_design(),
									count: data.stats.design,
									correct: true
								},
								{
									text: m.lightweight(),
									count: data.stats.lightweight,
									correct: true
								},
								{
									text: m.privacy_friendly(),
									count: data.stats.privacy,
									correct: true
								}
							]}
							bindableGameInfo={{
								volumeOn: false,
								locked: false
							}}
							gameInfo={{
								gameCode: 'Survey',
								questionIndex: 0,
								questionTotalCount: 1
							}}
						/>
					{:else}
						<QuestionAnswers
							on:answer={async (e) => {
								const field = Object.keys(data.stats)[e.detail];

								let resp = await fetch('/increment', {
									method: 'POST',
									headers: {
										'content-type': 'application/json'
									},
									body: JSON.stringify(field)
								});

								localStorage.setItem('answered', 'true');

								let res = await resp.json();

								data.stats = res;

								answered = true;
							}}
							questionText={m.which_feature()}
							timeLeft={undefined}
							timeStarted={undefined}
							answers={[
								m.open_source(),
								m.beautiful_design(),
								m.lightweight(),
								m.privacy_friendly()
							]}
							answeredCount={data.stats.openSource +
								data.stats.design +
								data.stats.lightweight +
								data.stats.privacy}
							bindableGameInfo={{
								volumeOn: false,
								locked: false
							}}
							gameInfo={{
								gameCode: 'Survey',
								questionIndex: 0,
								questionTotalCount: 1
							}}
							media={{
								Image: {
									Url: {
										url: logo,
										alt: m.logo_alt()
									}
								}
							}}
						/>
					{/if}
				</div>
			</div>
		</div>
	</section>
	<section>
		<div>
			<AnchorMessage
				image={{
					src: warning,
					alt: m.warning()
				}}
				background="#23456740"
				message="Fuiz is an ongoing project. Your feedback is important."
				href="#ongoing"
			/>
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>{m.about_fuiz()}</h2>
				<p>
					{m.about_fuiz_desc()}
				</p>
			</div>
			<Icon src="$lib/assets/help.svg" size="7em" alt={m.about_fuiz()} />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>{m.free_of_charge()}</h2>
				<p>
					{m.free_of_charge_desc()}
				</p>
				<p>
					{m.number_of_participants()}
				</p>
			</div>
			<Icon src="$lib/assets/no_money.svg" size="7em" alt="Free of charge" />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>{m.well_translated()}</h2>
				<p>
					{m.well_translated_desc()}
				</p>
			</div>
			<Icon src="$lib/assets/language.svg" size="7em" alt={m.language()} />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2><Anchor href="posts/introducing-fuiz">{m.collab_over_comp()}</Anchor></h2>
				<p>
					{m.collab_over_comp_desc()}
				</p>
			</div>
			<Icon src="$lib/assets/collaboration.svg" size="7em" alt="Collaboration" />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>{m.community_made()}</h2>
				<p>
					{m.community_made_desc()}
				</p>
			</div>
			<Icon src="$lib/assets/diversity.svg" size="7em" alt={m.community_made()} />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>
					<Anchor href="https://gitlab.com/opencode-mit/fuiz-us">{m.always_open()}</Anchor>
				</h2>
				<p>
					{m.always_open_desc()}
				</p>
			</div>
			<Icon src="$lib/assets/code_blocks.svg" size="7em" alt="Peoeple's Choice" />
		</div>
	</section>
	<section id="ongoing">
		<div class="split">
			<div>
				<h2>Stay in Touch!</h2>
				<p>
					We value the feedback of every user. Please fill out this <Anchor
						href="https://forms.gle/orFqr1wnhm6dv7xY7">form</Anchor
					> and arrange a meeting with us! We are looking forward to meeting with you. You can also join
					our <Anchor
						href="https://join.slack.com/t/fuiz/shared_invite/zt-2enihgtpy-C1KxJ96pEQN707msi~vNRg"
						>Slack community</Anchor
					>.
				</p>
			</div>
			<Icon src="$lib/assets/email.svg" size="7em" alt="Email" />
		</div>
	</section>
	<footer>
		<Footer />
	</footer>
</main>

<style>
	main {
		background-color: var(--background-color);
		line-height: 1.25;
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
		margin: 0.5em 0;
	}

	.slide-container {
		border: 0.15em solid;
		border-radius: 0.9em;
		position: relative;
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
