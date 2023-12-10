<script lang="ts">
	import FancyButton from '$lib/FancyButton.svelte';
	import paint from '$lib/assets/paint.svg';
	import game from '$lib/assets/game.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import { goto } from '$app/navigation';
	import Footer from '$lib/Footer.svelte';
	import Icon from '$lib/Icon.svelte';
	import Header from '$lib/Header.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';

	const title = 'Fuiz | Host Live Quizzes Freely';
	const description = 'A free online platform for host and playing live quizzes';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href={PUBLIC_PLAY_URL} />
</svelte:head>

<NiceBackground>
	<div style:display="flex" style:flex-direction="column" style:height="100%">
		<div
			style:height="100%"
			style:display="flex"
			style:flex-direction="column"
			style:align-items="stretch"
			style:justify-content="center"
			style:padding="0 10px"
			style:gap="10px"
		>
			<Header />
			<div
				style:flex="1"
				style:display="flex"
				style:flex-direction="column"
				style:align-items="center"
				style:justify-content="center"
			>
				<div
					style:display="flex"
					style:gap="1em"
					style:flex-wrap="wrap"
					style:justify-content="center"
				>
					<div>
						<FancyButton
							on:click={() => {
								goto('/create');
							}}
						>
							<div
								style:display="flex"
								style:flex-direction="column"
								style:font-size="xx-large"
								style:align-items="center"
								style:min-width="8ch"
								style:padding="10px"
							>
								<Icon src={paint} alt="paint" size="2em" />
								<div style:font-family="Poppins">Create</div>
							</div>
						</FancyButton>
					</div>
					<div>
						<FancyButton
							on:click={() => {
								goto('/play');
							}}
						>
							<div
								style:display="flex"
								style:flex-direction="column"
								style:font-size="xx-large"
								style:align-items="center"
								style:min-width="8ch"
								style:padding="10px"
							>
								<Icon size="2em" src={game} alt="game" />
								<div style:font-family="Poppins">Play</div>
							</div>
						</FancyButton>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	</div>
</NiceBackground>
