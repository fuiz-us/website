<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { page } from '$app/stores';
	import Loading from '$lib/Loading.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Header from '$lib/Header.svelte';
	import FancyAnchorButton from '$lib/FancyAnchorButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import Publish from './Publish.svelte';
	import { getAllCreations, getCreation, loadDatabase } from '$lib/storage';
	import type { PageData } from '../$types';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import { i18n } from '$lib/i18n';

	function parseInt(str: string | null): number | null {
		if (str === null) {
			return null;
		}
		try {
			return Number.parseInt(str);
		} catch {
			return null;
		}
	}

	export let data: PageData;

	$: id = parseInt($page.url.searchParams.get('id'));
	const title = m.publish_title();
	const description = m.publish_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{i18n.resolveRoute('/publish')}" />
</svelte:head>

{#if id}
	{@const filteredId = id}
	{#await loadDatabase(data.session !== null).then( async (db) => ({ db, creation: await getCreation(filteredId, db) }) )}
		<Loading />
	{:then { db, creation }}
		{#if creation}
			<Publish {creation} {id} {db} />
		{:else}
			<ErrorMessage errorMessage={m.missing_fuiz()} />
		{/if}
	{/await}
{:else}
	{#await loadDatabase(data.session !== null).then((db) => getAllCreations(db))}
		<Loading />
	{:then creations}
		{@const sortedCreations = creations.sort((a, b) => -b.lastEdited - a.lastEdited)}
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:flex-direction="column"
				style:align-items="center"
				style:padding="0.5em"
				style:box-sizing="border-box"
			>
				<header style:margin="0.5em 0">
					<Header />
				</header>
				<section>
					{#if creations.length > 0}
						<h2>{m.choose_local()}</h2>
						<ul id="creations-list">
							{#each sortedCreations as { title, id, slidesCount }, index}
								<li class="creation">
									<a href={'?id=' + id}>{title} · {m.slides_count({ count: slidesCount })}</a>
								</li>
								{#if index + 1 != creations.length}
									<hr />
								{/if}
							{/each}
						</ul>
					{:else}
						<div>
							<FancyAnchorButton href={'/create'}>
								<div class="create">{m.create()}</div>
							</FancyAnchorButton>
						</div>
					{/if}
				</section>
				<Footer />
			</div>
		</NiceBackground>
	{/await}
{/if}

<style>
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
