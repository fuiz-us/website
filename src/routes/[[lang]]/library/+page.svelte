<script lang="ts">
	import TypicalPage from '$lib/TypicalPage.svelte';
	import type { PageServerData } from './$types';
	import Listing from './Listing.svelte';

	export let data: PageServerData;
</script>

<TypicalPage>
	<Listing mostPlayed={data.published} recentlyPublished={data.published} />
</TypicalPage>
