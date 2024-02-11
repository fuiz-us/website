<script lang="ts">
	import * as m from '$paraglide/messages';

	import { page } from '$app/stores';
	import Editor from './Editor.svelte';
	import Loading from '$lib/Loading.svelte';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Gallery from './Gallery.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import { languageTag } from '$paraglide/runtime';
	import { route } from '$lib/i18n-routing';
	import type { Creation } from '$lib/types';
	import {
		getAllCreations,
		getCreation,
		type Database,
		loadDatabase,
		type ExportedFuiz
	} from '$lib/storage';
	import { addIds } from '$lib';
	import type { PageData } from '../$types';
	import { browser } from '$app/environment';

	let status:
		| 'loading'
		| {
				creation:
					| 'failure'
					| {
							id: number;
							config: ExportedFuiz;
					  };
				db: Database;
		  }
		| {
				creations: Creation[];
				db: Database;
		  } = 'loading';

	async function getStatus(idParam: string | null) {
		const db = await loadDatabase({ google: data.google });
		if (idParam) {
			const id = parseInt(idParam);
			const config = await getCreation(id, db);
			status = config
				? {
						creation: {
							id,
							config
						},
						db
				  }
				: {
						creation: 'failure',
						db
				  };
		} else {
			const creations = await getAllCreations(db);
			status = {
				creations,
				db
			};
		}
	}

	$: browser && getStatus($page.url.searchParams.get('id'));

	export let data: PageData;

	const title = m.create_title();
	const description = m.create_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{route('/create', languageTag())}" />
</svelte:head>

{#if status === 'loading'}
	<Loading />
{:else if 'creations' in status}
	<Gallery creations={status.creations} db={status.db} {data} />
{:else if status.creation === 'failure'}
	<ErrorPage errorMessage={m.missing_fuiz()} />
{:else}
	{@const config = addIds(status.creation.config.config)}
	<Editor id={status.creation.id} exportedFuiz={status.creation.config} {config} db={status.db} />
{/if}
