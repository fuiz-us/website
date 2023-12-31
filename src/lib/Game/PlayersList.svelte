<script lang="ts">
	export let players: string[];
	export let exactCount: number;
	export let truncated: boolean;
</script>

{#each players as player}
	<div
		style:background="var(--background-color)"
		style:border="0.15em solid currentcolor"
		style:padding="0.15em 0.4em"
		style:border-radius="0.6em"
		style:font-weight="bold"
		style:word-break="break-word"
	>
		{player}
	</div>
{/each}
{#if truncated}
	<div
		style:background="var(--background-color)"
		style:padding="0.5em 0.4em"
		style:border="0.15em solid currentcolor"
		style:border-radius="0.6em"
		style:font-weight="bold"
		style:word-break="break-word"
	>
		{players.length - exactCount} more...
	</div>
{/if}
