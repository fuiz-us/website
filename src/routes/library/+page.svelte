<script lang="ts">
	import TypicalPage from '$lib/TypicalPage.svelte';
	import type { PageServerData } from './$types';
	import Listing from './Listing.svelte';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
</script>

<TypicalPage>
	<Listing recentlyPublished={data.recentlyPublished} />
</TypicalPage>
