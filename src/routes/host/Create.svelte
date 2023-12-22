<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { bring } from '$lib';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Textarea from '$lib/Textarea.svelte';

	let button = 'Create';
	let loading = false;
	let disabled = false;
	let placeholder = 'Fuiz Config JSON';
	let fuizConfig = '';
	let errorMessage = '';

	function reset(error: string) {
		errorMessage = error;
		disabled = false;
		loading = false;
		button = 'Create';
	}

	async function submit() {
		disabled = true;
		loading = true;
		button = 'Loading';

		let res = await bring(PUBLIC_BACKEND_URL + '/add', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: fuizConfig
		});

		if (res === undefined) {
			return reset('Inaccessible Server');
		}

		if (!res.ok) {
			return reset('Malformed JSON');
		}

		goto('?code=' + (await res.text()));
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
		<header style:margin="5px 0">
			<Header />
		</header>
		<form on:submit|preventDefault={submit}>
			<ErrorMessage {errorMessage} />
			<Textarea id="config" {placeholder} required={true} {disabled} bind:value={fuizConfig} />
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
