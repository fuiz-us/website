<script lang="ts">
	import RegularCheckbox from '$lib/regular-checkbox.svelte';
	import { subjects } from '$lib/types';

	interface Props {
		tags: string[];
	}

	let { tags = $bindable() }: Props = $props();

	let selectedOptions: [string, boolean][] = $state(subjects.map((o) => [o, false]));

	$effect.pre(() => {
		tags = selectedOptions.filter(([, selected]) => selected).map(([option]) => option);
	});
</script>

Subject:
<div id="container">
	{#each selectedOptions as [option, selected], index (option)}
		<label>
			<input type="checkbox" bind:checked={selectedOptions[index][1]} style:display="none" />
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
