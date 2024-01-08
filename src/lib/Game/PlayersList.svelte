<script lang="ts">
	import * as m from '$paraglide/messages';

	import { backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let players: string[];
	export let exactCount: number;
</script>

{#each players as player (player)}
	<div
		style:background="var(--background-color)"
		style:border="0.15em solid currentcolor"
		style:padding="0.15em 0.4em"
		style:border-radius="0.6em"
		style:font-weight="bold"
		style:word-break="break-word"
		transition:scale={{ duration: 300, easing: backOut }}
	>
		{player}
	</div>
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
