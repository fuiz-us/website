<script lang="ts">
	import { getAllCreations, playJsonString } from '$lib';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import FancyAnchorButton from '$lib/FancyAnchorButton.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import Loading from '$lib/Loading.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Textarea from '$lib/Textarea.svelte';

	let loading = false;
	let placeholder = 'Fuiz Config JSON';
	let fuizConfig = '';
	let errorMessage = '';

	function reset(error: string) {
		errorMessage = error;
		loading = false;
	}

	async function submit() {
		loading = true;

		let value = await playJsonString(fuizConfig);

		if (value) {
			reset(value);
		}
	}

	const creations = getAllCreations();
</script>

{#await creations}
	<Loading />
{:then [creations]}
	{@const sortedCreations = creations.sort((a, b) => -b.lastEdited - a.lastEdited)}
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
			<section>
				{#if creations.length > 0}
					<h2>Choose from Local Fuizzes:</h2>
					<ul id="creations-list">
						{#each sortedCreations as { title, id, slidesCount }, index}
							<li class="creation"><a href={'?id=' + id}>{title} · {slidesCount} slides</a></li>
							{#if index + 1 != creations.length}
								<hr />
							{/if}
						{/each}
					</ul>
				{:else}
					<div>
						<FancyAnchorButton href="/create">
							<div class="create">Create New Fuiz</div>
						</FancyAnchorButton>
					</div>
				{/if}
			</section>

			<form on:submit|preventDefault={submit}>
				<h2>Or Paste a JSON Config:</h2>
				<ErrorMessage {errorMessage} />
				<Textarea
					id="config"
					{placeholder}
					required={true}
					disabled={loading}
					bind:value={fuizConfig}
				/>
				<div style:margin="5px 0" style:width="100%">
					<FancyButton disabled={loading}>
						<div
							style:display="flex"
							style:align-items="center"
							style:justify-content="center"
							style:font-family="Poppins"
						>
							Host
						</div>
					</FancyButton>
				</div>
			</form>
			<Footer />
		</div>
	</NiceBackground>
{/await}

<style>
	form {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		box-sizing: content-box;
		max-width: 25ch;
		padding: 0.5em;
		width: 100%;
	}

	section {
		flex: 1;
		display: flex;
		max-width: 25ch;
		flex-direction: column;
		justify-content: center;
		padding: 0.5em;
		width: 100%;
	}

	#creations-list {
		display: flex;
		flex-direction: column;
		border: 0.2em solid;
		border-radius: 0.5em;
		padding: 0;
		margin: 0;
	}

	.creation {
		display: flex;
	}

	hr {
		appearance: none;
		width: 100%;
		color: inherit;
		border-top: 0.2em solid;
		margin: 0;
	}

	h2 {
		margin: 0 0 0.5em;
		font-size: 1.25em;
	}

	.creation a {
		flex: 1;
		text-decoration: inherit;
		color: inherit;
		padding: 0.4em;
		margin: 0;
	}

	.create {
		font-family: Poppins;
		text-align: center;
	}
</style>
