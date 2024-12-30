<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { page } from '$app/state';
	import Editor from './Editor.svelte';
	import Loading from '$lib/Loading.svelte';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Gallery from './Gallery.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import type { Creation, FuizConfig } from '$lib/types';
	import {
		getAllCreations,
		getCreation,
		type Database,
		loadDatabase,
		type ExportedFuiz
	} from '$lib/storage';
	import { addIds } from '$lib';
	import type { PageData } from '../$types';
	import { i18n } from '$lib/i18n';

	let status:
		| 'loading'
		| {
				creation:
					| 'failure'
					| {
							id: number;
							exportedFuiz: ExportedFuiz;
							config: FuizConfig;
					  };
				db: Database;
		  }
		| {
				creations: Creation[];
				db: Database;
		  } = $state('loading');

	async function getStatus(idParam: string | null) {
		const db = await loadDatabase(data.session !== null);
		if (idParam) {
			const id = parseInt(idParam);
			const exportedFuiz = await getCreation(id, db);
			if (!exportedFuiz) {
				status = {
					creation: 'failure',
					db
				};
				return;
			}
			const config = addIds(exportedFuiz.config);
			status = config
				? {
						creation: {
							id,
							exportedFuiz,
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

	let creationId = $derived(page.url.searchParams.get('id'));

	$effect(() => {
		getStatus(creationId);
	});

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const title = m.create_title();
	const description = m.create_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{i18n.resolveRoute('/create')}" />
</svelte:head>

{#if status === 'loading'}
	<Loading />
{:else if 'creations' in status}
	<Gallery creations={status.creations} db={status.db} {data} />
{:else if status.creation === 'failure'}
	<ErrorPage errorMessage={m.missing_fuiz()} />
{:else}
	<Editor
		bind:id={status.creation.id}
		bind:exportedFuiz={status.creation.exportedFuiz}
		bind:config={status.creation.config}
		db={status.db}
	/>
{/if}
