<script lang="ts">
	export let players: string[];
	export let exact_count: number;
	export let truncated: boolean;
</script>

{#each players as player}
	<div
		style:padding="0.15em 0.4em"
		style:background="#000000C0"
		style:border-radius="10px"
		style:color="white"
		style:word-break="break-word"
	>
		{player}
	</div>
{/each}
{#if truncated}
	<div
		style:font="inherit"
		style:appearance="none"
		style:border="none"
		style:cursor="pointer"
		style:padding="0.5em 1em"
		style:background="#000000C0"
		style:border-radius="5px"
		style:color="white"
	>
		{players.length - exact_count} more...
	</div>
{/if}
