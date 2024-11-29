<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import Create from './Create.svelte';
	import Host from './Host.svelte';
	import Options from './Options.svelte';
	import { derived } from 'svelte/store';

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

	const code = derived(page, ($page) => $page.url.searchParams.get('code'));
	const id = derived(page, ($page) => parseInt($page.url.searchParams.get('id')));
</script>

{#if $code !== null}
	<Host code={$code} />
{:else if $id !== null}
	<Options id={$id} {data} />
{:else}
	<Create {data} />
{/if}
