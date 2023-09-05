<script lang="ts">
	import FancyButton from '$lib/FancyButton.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import logo from '$lib/assets/logo.svg';

	let button = 'Join';
	let loading = false;
	let disabled = false;
	let placeholder = 'Game Code';
	let gameCode = '';

	async function submit() {
		disabled = true;
		loading = true;
		button = 'Loading';

		location.replace('/play/' + gameCode);
	}
</script>

<NiceBackground>
	<div
		style:height="100%"
		style:display="flex"
		style:justify-content="center"
		style:font-size="x-large"
	>
		<form on:submit|preventDefault={submit}>
			<img
				src={logo}
				alt="a deck of cards representing fuiz logo and the word fuiz"
				width="250px"
				height="100px"
				style:padding-right="24px"
				style:display="block"
				style:margin="10px 0 40px"
			/>
			<input type="text" {placeholder} required {disabled} bind:value={gameCode} />
			<div style:margin="5px 0" style:width="100%">
				<FancyButton bind:disabled>
					<div
						style:display="flex"
						style:align-items="center"
						style:justify-content="center"
						style:font-family="Poppins"
					>
						{#if loading}
							<div style:height="1em" style:aspect-ratio="1/1" style:margin="0 5px">
								<LoadingCircle />
							</div>
						{/if}
						{button}
					</div>
				</FancyButton>
			</div>
		</form>
	</div>
</NiceBackground>

<style>
	form {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		box-sizing: content-box;
		width: 300px;
		max-width: 300px;
	}

	input[type='text'] {
		border: 1px solid #a9a8aa;
		border-radius: 5px;
		width: 100%;
		box-sizing: border-box;
		font: inherit;
		margin: 5px 0;
		box-sizing: border-box;
		text-align: center;
		padding: 6.5px 5px;
		font-weight: bold;
		resize: none;
	}
</style>
