<script lang="ts">
	import { base } from '$app/paths';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';
	import Logo from '$lib/Logo.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Textfield from '$lib/Textfield.svelte';
	import { createEventDispatcher } from 'svelte';

	export let sending: boolean;

	$: button = sending ? 'Loading' : "I'm Ready!";
	let placeholder = 'Nickname';
	export let errorMessage = '';
	let name = '';

	const dispatch = createEventDispatcher<{
		setName: string;
	}>();

	async function submit() {
		button = 'Loading';

		dispatch('setName', name);
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
			<a href="{base}/" style:height="100px" style:margin="10px 0 40px" style:overflow="hidden">
				<Logo />
			</a>
			<ErrorMessage {errorMessage} />
			<Textfield id="name" {placeholder} required={true} disabled={sending} bind:value={name} />
			<div style:margin="5px 0" style:width="100%">
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
