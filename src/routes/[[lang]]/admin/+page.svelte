<script lang="ts">
	import * as m from '$paraglide/messages';

	import type { PageServerData } from './$types';
	import FancyButton from '$lib/FancyButton.svelte';
	import Textarea from '$lib/Textarea.svelte';
	import FuizDisplay from './FuizDisplay.svelte';
	import TypicalPage from '$lib/TypicalPage.svelte';

	export let data: PageServerData;

	$: previous_fuiz = data.previous_fuiz;
	$: fuiz = data.fuiz;
</script>

<TypicalPage>
	{#if fuiz}
		<FuizDisplay {fuiz} />
		{#if previous_fuiz}
			<p>{m.this_replaces()}</p>
			<FuizDisplay fuiz={previous_fuiz} />
		{/if}
		<div style:display="flex" style:flex-direction="column" style:gap="0.5em">
			<form method="POST" action="?/approve">
				<FancyButton>{m.approve()}</FancyButton>
			</form>
			<form method="POST" action="?/reject">
				<Textarea id="reason" placeholder={m.reason()} required disabled={false} value="" />
				<div>
					<FancyButton>{m.reject()}</FancyButton>
				</div>
			</form>
		</div>
	{:else}
		{m.nothing()}
	{/if}
</TypicalPage>
