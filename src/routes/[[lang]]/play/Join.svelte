<script lang="ts">
	import * as m from '$paraglide/messages';

	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Textfield from '$lib/Textfield.svelte';
	import { bring } from '$lib/util';

	let sending = false;
	let gameCode = '';

	let errorMessage = '';

	async function submit() {
		sending = true;

		const res = await bring(PUBLIC_BACKEND_URL + '/alive/' + gameCode.toUpperCase(), {
			method: 'GET',
			mode: 'cors'
		});
		if (res === undefined) {
			errorMessage = m.cannot_connect();
		} else {
			let text = await res.text();
			if (text === 'true') {
				goto('?code=' + gameCode.toUpperCase());
				return;
			} else {
				errorMessage = m.code_not_exist();
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
	>
		<header style:margin="0.5em 0">
			<Header />
		</header>
		<form on:submit|preventDefault={submit}>
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
					placeholder={m.game_code()}
					required={true}
					disabled={sending}
					showInvalid={false}
					bind:value={gameCode}
					textTransform="uppercase"
					inputmode="numeric"
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
							{m.join()}
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
