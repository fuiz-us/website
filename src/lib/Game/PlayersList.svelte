<script lang="ts">
	import * as m from '$paraglide/messages';

	import { backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let players: [string, boolean][];
	export let selectable = false;
	export let max: undefined | number = undefined;
	export let exactCount: number;
</script>

{#each players as [player, selected] (player)}
	<button
		style:background="var(--background-color)"
		style:border="0.15em solid currentColor"
		style:padding="0.15em 0.4em"
		style:border-radius="0.6em"
		style:font-family="inherit"
		style:font-size="inherit"
		style:color={selected ? 'var(--accent-color)' : 'inherit'}
		style:font-weight="bold"
		style:transition="color 100ms linear"
		style:word-break="break-word"
		disabled={!selectable}
		style:cursor={selectable ? 'pointer' : 'normal'}
		on:click={() => {
			if (!selected && players.filter(([, s]) => s).length >= (max ?? players.length)) {
				return;
			}
			selected = !selected;
		}}
		transition:scale={{ duration: 300, easing: backOut }}
	>
		{player}
	</button>
{/each}
{#if players.length < exactCount}
	<div
		style:background="var(--background-color)"
		style:padding="0.5em 0.4em"
		style:border="0.15em solid currentcolor"
		style:border-radius="0.6em"
		style:font-weight="bold"
		style:word-break="break-word"
	>
		{m.more({
			count: players.length - exactCount
		})}
	</div>
{/if}
