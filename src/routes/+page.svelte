<script lang="ts">
	import FancyButton from '$lib/FancyButton.svelte';
	import Logo from '$lib/Logo.svelte';
	import paint from '$lib/assets/paint.svg';
	import game from '$lib/assets/game.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import { goto } from '$app/navigation';
	import Footer from '$lib/Footer.svelte';
</script>

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
			<div
				style:display="flex"
				style:flex-direction="column"
				style:align-items="center"
				style:justify-content="end"
				style:gap="20px"
				style:flex="1"
			>
				<a href="/" style:height="100px" style:overflow="hidden">
					<Logo />
				</a>
				<div
					style:text-align="center"
					style:font-family="Poppins"
					style:font-size="xx-large"
					style:margin-bottom="40px"
				>
					Host live quizzes freely
				</div>
			</div>
			<div
				style:flex="1"
				style:display="flex"
				style:flex-direction="column"
				style:align-items="center"
				style:justify-content="start"
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
								<img
									src={paint}
									alt="paint"
									style:height="2em"
									style:aspect-ratio="1/1"
									style:display="flex"
									style:filter="invert(1)"
								/>
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
								<img
									src={game}
									alt="game"
									style:height="2em"
									style:aspect-ratio="1/1"
									style:display="flex"
									style:filter="invert(1)"
								/>
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
