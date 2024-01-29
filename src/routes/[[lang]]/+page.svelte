<script lang="ts">
	import * as m from '$paraglide/messages';
	import { theme } from '@jill64/svelte-dark-theme';
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
	import Footer from '$lib/Footer.svelte';

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
				<h2>About Fuiz</h2>
				<p>
					The alternative to Kahoot with enhanced collaboration and problem-solving. Fuiz is a
					privacy-focused, open-source learning platform hosting user-generated quizzes. Instead of
					competition and memorization, we are committed to providing an accessible classroom tool
					that encourages teamwork and discussions.
				</p>
			</div>
			<Icon src="$lib/assets/help.svg" size="7em" alt="About" />
		</div>
	</section>
	<section>
		<div class="split">
			<div>
				<h2>Collaboration Over Competition</h2>
				<p>
					In addition to Kahoot's basic functionality, the <strong>collaboration mode</strong> incorporates
					special features to encourage teamwork. Options are distributed among students in a team, prompting
					interaction to gather all possible answers. Each team member has access to a full list of options.
					Teams are randomly assigned at the beginning of the game.
				</p>
				<p>
					For instance, a student may receive an incomplete list of options for a problem. To
					explore additional options, they communicate with another student in the same group to
					learn about possible alternatives. Subsequently, they engage in conversation to
					collaborate on finding the answer. This approach fosters small group discussions and
					promotes teamwork.
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
				<p>
					We encourage teachers to share their knowledge with each other and create better
					educational resources for everyone. You can publish the Fuiz you created so that anyone
					can access it. We have created a <Anchor
						href="https://join.slack.com/t/fuiz/shared_invite/zt-2bli7h700-uhE9fOkcepKJUm01JLPsfA"
						>Slack workspace</Anchor
					> for every teacher to join, connecting them with other teachers worldwide.
				</p>
			</div>
			<Icon src="$lib/assets/diversity.svg" size="7em" alt={m.community_made()} />
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
		<div class="split">
			<div>
				<h2>Stay in Touch!</h2>
				<p>
					We value the feedback of every user. Please fill out this <Anchor
						href="https://forms.gle/orFqr1wnhm6dv7xY7">form</Anchor
					> and arrange a meeting with us! We are looking forward to meeting with you.
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
