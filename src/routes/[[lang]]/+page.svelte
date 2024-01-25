<script lang="ts">
	import * as m from '$paraglide/messages';
	import { theme } from 'fractils';
	import warning from '$lib/assets/error.svg';

	import Icon from '$lib/Icon.svelte';
	import blackLogo from '$lib/assets/dark_logo.svg';
	import whiteLogo from '$lib/assets/white_logo.svg';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import Anchor from '$lib/Anchor.svelte';
	import QuestionAnswers from './host/QuestionAnswers.svelte';
	import { route } from '$lib/i18n-routing';
	import { languageTag } from '$paraglide/runtime';
	import AnchorMessage from '$lib/AnchorMessage.svelte';
	import MainHeader from './MainHeader.svelte';

	const title = m.main_title();
	const description = m.main_desc();
</script>

<svelte:head>
	<title>{title}</title>
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
					<QuestionAnswers
						questionText={m.what_are_features()}
						timeLeft={15000}
						timeStarted={30000}
						answers={[m.open_source(), m.beautiful_design(), m.lightweight(), m.privacy_friendly()]}
						answeredCount={0}
						bindableGameInfo={{
							volumeOn: false,
							locked: false
						}}
						gameInfo={{
							gameCode: '13213',
							questionIndex: 0,
							questionTotalCount: 1
						}}
						media={{
							Image: {
								Url: {
									url: $theme === 'dark' ? whiteLogo : blackLogo,
									alt: m.logo_alt()
								}
							}
						}}
					/>
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
				<h2>{m.peoples_choice()}</h2>
				<p>
					{m.peoples_choice_desc()}
				</p>
			</div>
			<Icon src="$lib/assets/editor_choice.svg" size="7em" alt={m.peoples_choice()} />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>{m.always_open()}</h2>
				<p>
					{m.always_open_desc()}
					<Anchor href="https://gitlab.com/opencode-mit">gitlab.com/opencode-mit</Anchor>
				</p>
			</div>
			<Icon src="$lib/assets/code_blocks.svg" size="7em" alt="Peoeple's Choice" />
		</div>
	</section>
	<section id="ongoing">
		<div>
			<h2>We Need Your Feedback!</h2>
			<p>
				Fuiz is an ongoing project. Your feedback is very crucial at this stage. Please feel free to
				submit this <Anchor href="https://forms.gle/erhsbRc4vqViWqFb8">form</Anchor>. You can also
				reach out at <Anchor href="info@fuiz.us">info@fuiz.us</Anchor>.
			</p>
		</div>
	</section>
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
