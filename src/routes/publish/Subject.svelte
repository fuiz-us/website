<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import RegularCheckbox from '$lib/regular-checkbox.svelte';
	import { subjects } from '$lib/types';

	export let tags: string[];

	let selectedOptions: [string, boolean][] = subjects.map((o) => [o, false]);

	$: {
		tags = selectedOptions.filter(([, selected]) => selected).map(([option]) => option);
	}
</script>

Subject:
<div id="container">
	{#each selectedOptions as [option, selected] (option)}
		<label>
			<input type="checkbox" bind:checked={selected} style:display="none" />
			<RegularCheckbox checked={selected} />
			{option}
		</label>
	{/each}
</div>

<style>
	#container {
		display: grid;
		grid: auto-flow / repeat(auto-fill, minmax(10em, 1fr));
		row-gap: 0.25em;
	}

	label {
		display: flex;
		align-items: start;
		gap: 0.25em;
	}
</style>
