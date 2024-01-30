<script lang="ts">
	import * as m from '$paraglide/messages';

	import { page } from '$app/stores';
	import { getAllCreations, getFullCreation } from '$lib';
	import Loading from '$lib/Loading.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Header from '$lib/Header.svelte';
	import FancyAnchorButton from '$lib/FancyAnchorButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import { route } from '$lib/i18n-routing';
	import { languageTag } from '$paraglide/runtime';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import Publish from './Publish.svelte';

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

	$: id = parseInt($page.url.searchParams.get('id'));
	const title = m.publish_title();
	const description = m.publish_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{route('/publish', languageTag())}" />
</svelte:head>

{#if id}
	{@const creation = getFullCreation(id)}
	{#await creation}
		<Loading />
	{:then [creation, idb]}
		<Publish {creation} {id} {idb} />
	{/await}
{:else}
	{@const creations = getAllCreations()}
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
							<FancyAnchorButton href={route('/create', languageTag())}>
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
