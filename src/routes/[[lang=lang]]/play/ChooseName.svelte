<script lang="ts">
	import * as m from '$paraglide/messages';

	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Textfield from '$lib/Textfield.svelte';
	import { createEventDispatcher } from 'svelte';

	export let sending: boolean;

	let placeholder = m.nickname();
	export let errorMessage = '';
	let name = '';

	const dispatch = createEventDispatcher<{
		setName: string;
	}>();

	async function submit() {
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
		<header style:margin="0.5em 0">
			<Header />
		</header>
		<form on:submit|preventDefault={submit}>
			<ErrorMessage {errorMessage} />
			<Textfield
				id="name"
				{placeholder}
				autocomplete="nickname"
				required={true}
				showInvalid={false}
				disabled={sending}
				bind:value={name}
			/>
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
						{m.lets_start()}
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
