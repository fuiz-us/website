<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import Create from './Create.svelte';
	import Host from './Host.svelte';
	import Options from './Options.svelte';
	import { browser } from '$app/environment';
	import OrderAnswers from './OrderAnswers.svelte';
	import OrderStatistics from './OrderStatistics.svelte';

	let code: string | null = null;
	let id: number | null = null;

	$: browser && ((c) => (code = c))($page.url.searchParams.get('code'));
	$: browser && ((i) => (id = i))(parseInt($page.url.searchParams.get('id')));

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
</script>

{#if code !== null}
	<Host {code} />
{:else if id !== null}
	<Options {id} {data} />
{:else}
	<Create {data} />
{/if}

