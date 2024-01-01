<script lang="ts">
	import { getCreation, playConfig } from '$lib';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Loading from '$lib/Loading.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Switch from '$lib/Switch.svelte';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';

	export let id: number;

	let loading = false;

	let errorMessage = '';

	export let randomizedNames = false;

	$: creation = getCreation(id);
</script>

{#await creation}
	<Loading />
{:then [config]}
	<NiceBackground>
		<div id="container">
			<header style:margin="0.5em 0">
				<Header />
			</header>
			<form
				on:submit|preventDefault={() => {
					errorMessage = '';
					loading = true;
					playConfig(config, { random_names: randomizedNames }).then((err) => {
						loading = false;
						if (err) {
							errorMessage = err;
						}
					});
				}}
			>
				<h2>Few Options First:</h2>
				<div id="options">
					<div class="switch">
						<Switch id="random" bind:checked={randomizedNames}>Use randomized names</Switch>
					</div>
					<!-- <hr />
					<div class="switch">
						<Switch id="players" bind:checked={questionsOnPlayersDevices}>
							Show question and answers on players' devices
						</Switch>
					</div> -->
				</div>
				<ErrorMessage {errorMessage} />
				<div>
					<FancyButton disabled={loading}>
						<div id="button">Start Now!</div>
					</FancyButton>
				</div>
			</form>
			<Footer />
		</div>
	</NiceBackground>
{/await}

<style>
	#container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	form {
		flex: 1;
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

	/* hr {
		width: 100%;
		color: inherit;
		margin: 0;
	} */

	h2 {
		margin: 0;
	}

	#button {
		padding: 0.1em 0.5em;
		font-family: Poppins;
	}
</style>
