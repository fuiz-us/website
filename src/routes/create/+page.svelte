<script lang="ts">
	import { page } from '$app/stores';
	import type { ExportedFuiz, FuizConfig, Media } from '$lib';
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
				creations: {
					id: number;
					last_edited: number;
					title: string;
					slides_count: number;
				}[];
				db: IDBDatabase;
		  } = 'loading';

	function get_status(id_param: string | null) {
		const request = indexedDB.open('FuizDB', 1);
		request.addEventListener('upgradeneeded', () => {
			const db = request.result;
			db.createObjectStore('creations', { autoIncrement: true });
		});
		request.addEventListener('success', () => {
			const db = request.result;

			const creationsStore = db.transaction(['creations'], 'readonly').objectStore('creations');

			if (id_param) {
				const id = parseInt(id_param);

				const creationsTransaction = creationsStore.get(id);

				creationsTransaction.addEventListener('success', () => {
					const value: ExportedFuiz = creationsTransaction.result;

					if (value) {
						status = {
							creation: {
								id,
								config: value.config
							},
							db
						};
					} else {
						status = {
							creation: 'failure',
							db
						};
					}
				});
			} else {
				const creationsTransaction = creationsStore.openCursor();

				const creations: {
					id: number;
					title: string;
					last_edited: number;
					slides_count: number;
					media?: Media;
				}[] = [];

				creationsTransaction.addEventListener('success', () => {
					const cursor = creationsTransaction.result;
					if (cursor) {
						let value: ExportedFuiz = cursor.value;
						creations.push({
							id: parseInt(cursor.key.toString()),
							last_edited: value.last_edited,
							title: value.config.title,
							slides_count: value.config.slides.length,
							media: value.config.slides.reduce<Media | undefined>(
								(p, c) => p || c.MultipleChoice.media,
								undefined
							)
						});
						cursor.continue();
					} else {
						status = {
							creations,
							db
						};
					}
				});
			}
		});
	}

	$: browser && get_status(id_param);

	const title = 'Create Your Own Fuiz';
	const description = 'Create your own fuiz with beautiful images to play it with others';
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
	<ErrorPage errorMessage="o no! cannot find this fuiz!" />
{:else}
	<Editor id={status.creation.id} bind:config={status.creation.config} db={status.db} />
{/if}
