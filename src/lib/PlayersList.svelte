<script lang="ts">
	export let players: string[];
	let hide: boolean;
</script>

{#each players.slice(0, hide ? 50 : undefined) as player}
	<div
		style:padding="5px 10px"
		style:background="#000000C0"
		style:border-radius="5px"
		style:color="white"
	>
		{player}
	</div>
{/each}
{#if players.length > 50 && hide}
	<button
		on:click={() => (hide = false)}
		style:font="inherit"
		style:appearance="none"
		style:border="none"
		style:cursor="pointer"
		style:padding="5px 10px"
		style:background="#000000C0"
		style:border-radius="5px"
		style:color="white"
	>
		{players.length - 50} more...
	</button>
{/if}
