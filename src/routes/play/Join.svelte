<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { bring } from '$lib';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';
	import Logo from '$lib/Logo.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Textfield from '$lib/Textfield.svelte';

	let button = 'Join';
	let sending = false;
	$: placeholder = sending ? 'Loading' : 'Game Code';
	let gameCode = '';

	let errorMessage = '';

	async function submit() {
		sending = true;

		const res = await bring(PUBLIC_BACKEND_URL + '/alive/' + gameCode.toUpperCase(), {
			method: 'GET',
			mode: 'cors'
		});
		if (res === undefined) {
			errorMessage = 'Cannot connect to the server';
		} else {
			let text = await res.text();
			if (text === 'true') {
				goto('?code=' + gameCode.toUpperCase());
				return;
			} else {
				errorMessage = "Game code doesn't exist";
			}
		}

		sending = false;
	}
</script>

<NiceBackground>
	<div
		style:height="100%"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
		style:font-size="x-large"
	>
		<form on:submit|preventDefault={submit}>
			<a href="{base}/" style:height="65px" style:margin="10px 0 40px" style:overflow="hidden">
				<Logo />
			</a>
			<div
				style:flex="1"
				style:display="flex"
				style:flex-direction="column"
				style:justify-content="center"
				style:gap="5px"
			>
				{#if errorMessage}
					<div style:margin-bottom="10px">
						<ErrorMessage {errorMessage} />
					</div>
				{/if}
				<Textfield
					id="code"
					{placeholder}
					required={true}
					disabled={sending}
					bind:value={gameCode}
					text_transform="uppercase"
				/>
				<div>
					<FancyButton disabled={sending}>
						<div
							style:display="flex"
							style:align-items="center"
							style:justify-content="center"
							style:font-family="Poppins"
						>
							{#if sending}
								<div style:height="1em" style:aspect-ratio="1/1" style:margin="0 5px">
									<LoadingCircle />
								</div>
							{/if}
							{button}
						</div>
					</FancyButton>
				</div>
			</div>
		</form>
		<Footer />
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
</style>
