<script lang="ts">
	import FancyButton from './FancyButton.svelte';
	import { createListbox } from 'svelte-headlessui';

	export let options: string[] | number[];
	export let selected: string | number;

	const listbox = createListbox({ label: 'Actions', selected });

	function onSelect(e: Event) {
		selected = (e as CustomEvent).detail.selected;
	}
</script>

<FancyButton action={listbox.button} on:select={onSelect}>
	<div style:display="flex" style:align-items="center" style:padding="5px">
		<slot />
		<div style:padding="0 5px">
			{$listbox.selected}
		</div>
	</div>
</FancyButton>

{#if $listbox.expanded}
	<div id="container">
		<ul use:listbox.items>
			{#each options as value}
				<li>
					<FancyButton action={(n) => listbox.item(n, { value })}>
						<div style:padding="0.25em 0.5em">{value}</div>
					</FancyButton>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	#container {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #ffffffa0;

		display: flex;
		align-items: center;
		justify-content: center;

		& ul {
			margin: 0;
			padding: 10px;
			display: grid;
			grid-gap: 10px;
			grid-template-columns: repeat(2, 1fr);
			width: min(80vw, 50vh);
			flex-wrap: wrap;

			& li {
				display: block;
				font-size: 10vmin;
			}
		}
	}
</style>
