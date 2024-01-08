<script lang="ts">
	import * as m from '$paraglide/messages';

	import { page } from '$app/stores';
	import { getAllCreations, type Creation, type FuizConfig, getCreation } from '$lib';
	import Editor from './Editor.svelte';
	import Loading from '$lib/Loading.svelte';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Gallery from './Gallery.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import { browser } from '$app/environment';

	$: id_param = $page.url.searchParams.get('id');

	let status:
		| 'loading'
		| {
				creation:
					| 'failure'
					| {
							id: number;
							config: FuizConfig;
					  };
				db: IDBDatabase;
		  }
		| {
				creations: Creation[];
				db: IDBDatabase;
		  } = 'loading';

	async function getStatus(idParam: string | null) {
		if (idParam) {
			const id = parseInt(idParam);
			const [config, db] = await getCreation(id);
			status = {
				creation: {
					id,
					config
				},
				db
			};
		} else {
			const [creations, db] = await getAllCreations();
			status = {
				creations,
				db
			};
		}
	}

	$: browser && getStatus(id_param);

	const title = m.create_title();
	const description = m.create_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}/create" />
</svelte:head>

{#if status === 'loading'}
	<Loading />
{:else if 'creations' in status}
	<Gallery creations={status.creations} db={status.db} />
{:else if status.creation === 'failure'}
	<ErrorPage errorMessage={m.missing_fuiz()} />
{:else}
	<Editor id={status.creation.id} bind:config={status.creation.config} db={status.db} />
{/if}
