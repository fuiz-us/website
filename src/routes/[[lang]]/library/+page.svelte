<script lang="ts">
	import TypicalPage from '$lib/TypicalPage.svelte';
	import type { PageServerData } from './$types';
	import Listing from './Listing.svelte';

	export let data: PageServerData;
</script>

<TypicalPage>
	{@const { mostPlayed, recentlyPublished } = data}
	<Listing {mostPlayed} {recentlyPublished} />
</TypicalPage>
