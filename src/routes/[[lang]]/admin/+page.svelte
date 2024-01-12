<script lang="ts">
	import * as m from '$paraglide/messages';

	import Footer from '$lib/Footer.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Header from '$lib/Header.svelte';
	import type { PageServerData } from './$types';
	import FancyButton from '$lib/FancyButton.svelte';
	import Textarea from '$lib/Textarea.svelte';
	import FuizDisplay from './FuizDisplay.svelte';

	export let data: PageServerData;

	$: previous_fuiz = data.previous_fuiz;
	$: fuiz = data.fuiz;
</script>

<NiceBackground>
	<div
		style:height="100%"
		style:display="flex"
		style:align-items="center"
		style:gap="0.5em"
		style:flex-direction="column"
		style:padding="0.5em"
		style:box-sizing="border-box"
	>
		<header style:margin="0.5em 0">
			<Header />
		</header>

		<div style:flex="1">
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
		</div>
		<footer style:width="100%">
			<Footer />
		</footer>
	</div>
</NiceBackground>
