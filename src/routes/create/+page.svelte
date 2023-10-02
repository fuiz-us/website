<script lang="ts">
	import { page } from '$app/stores';
	import { is_not_undefined, type FuizConfig, get_slide } from '$lib';
	import Editor from './Editor.svelte';
	import Loading from '$lib/Loading.svelte';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Gallery from './Gallery.svelte';

	$: id_param = $page.url.searchParams.get('id');

	function get_creations_ids(): number[] {
		let creations_string = localStorage.getItem('creations');
		if (creations_string !== null) {
			return JSON.parse(creations_string);
		} else {
			let empty: number[] = [];
			localStorage.setItem('creations', JSON.stringify(empty));
			return empty;
		}
	}

	function get_param_id(id_param: string | null): number | undefined {
		if (id_param !== null) {
			return Number(id_param);
		} else {
			return undefined;
		}
	}

	function get_create(id: number):
		| {
				id: number;
				last_edited: number;
				slides_count: number;
				title: string;
		  }
		| undefined {
		let slide = get_slide(id);
		if (slide !== undefined) {
			return {
				id,
				last_edited: slide.last_edited,
				title: slide.config.title,
				slides_count: slide.config.slides.length
			};
		} else {
			return undefined;
		}
	}

	$: given_id = get_param_id(id_param);

	function get_status(given_id: number | undefined):
		| 'loading'
		| {
				creation:
					| 'failure'
					| {
							id: number;
							config: FuizConfig;
					  };
		  }
		| {
				creations: {
					id: number;
					last_edited: number;
					title: string;
					slides_count: number;
				}[];
		  } {
		if (given_id !== undefined) {
			let slide = get_slide(given_id);
			if (slide !== undefined) {
				return {
					creation: {
						id: given_id,
						config: slide.config
					}
				};
			} else {
				return {
					creation: 'failure'
				};
			}
		} else {
			let ids = get_creations_ids();

			return {
				creations: ids.map(get_create).filter(is_not_undefined)
			};
		}
	}

	$: status = get_status(given_id);
</script>

{#if status === 'loading'}
	<Loading />
{:else if 'creations' in status}
	<Gallery creations={status.creations} />
{:else if status.creation === 'failure'}
	<ErrorPage errorMessage="o no! cannot find this fuiz!" />
{:else}
	<Editor id={status.creation.id} bind:config={status.creation.config} />
{/if}
