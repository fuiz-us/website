<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from '../$types';
	import Create from './Create.svelte';
	import Host from './Host.svelte';
	import Options from './Options.svelte';

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

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let code = $derived(page.url.searchParams.get('code'));
	let id = $derived(parseInt(page.url.searchParams.get('id')));
</script>

{#if code !== null}
	<Host {code} />
{:else if id !== null}
	<Options {id} {data} />
{:else}
	<Create {data} />
{/if}
