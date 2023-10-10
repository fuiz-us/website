<script lang="ts">
	import Crossed from '$lib/Game/Bingo/Crossed.svelte';
	import Uncrossed from '$lib/Game/Bingo/Uncrossed.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let all_statements: {
		id: number;
		text: string;
	}[];
	export let crossed: number[];
	export let volume_on: boolean;
	export let user_votes: number[];

	$: crossed_statements = all_statements
		.filter((s) => crossed.includes(s.id))
		.sort((a, b) => a.id - b.id);

	$: uncrossed_statements = all_statements.filter((s) => !crossed.includes(s.id));

	$: upvoted_uncrossed_statement = uncrossed_statements
		.sort((a, b) => user_votes[b.id] - user_votes[a.id])
		.at(0);

	$: filtered_uncrossed_statement = uncrossed_statements
		.filter(
			(s) => upvoted_uncrossed_statement === undefined || s.id != upvoted_uncrossed_statement.id
		)
		.sort((a, b) => a.id - b.id);
</script>

<NiceBackground>
	<div style:box-shadow="0 2px 2px #00000040">
		<Topbar bind:volume_on on:next {questionIndex} {questionTotalCount} {gameId} show_skip={true} />
	</div>
	<div
		style:max-width="50ch"
		style:margin="auto"
		style:padding="10px"
		style:font-size="x-large"
		style:box-sizing="border-box"
	>
		{#if upvoted_uncrossed_statement !== undefined}
			<div>
				<h2 style:margin-bottom="4px">Most Upvoted</h2>
				<div style:display="flex" style:flex-direction="column" style:gap="5px">
					<Uncrossed
						user_votes={user_votes.at(upvoted_uncrossed_statement.id) ?? 0}
						text={upvoted_uncrossed_statement.text}
						id={upvoted_uncrossed_statement.id}
						on:index
					/>
				</div>
			</div>
		{/if}

		{#if filtered_uncrossed_statement.length}
			<div>
				<h2 style:margin-bottom="4px">Uncrossed</h2>
				<div style:display="flex" style:flex-direction="column" style:gap="5px">
					{#each filtered_uncrossed_statement as { id, text } (id)}
						<Uncrossed user_votes={user_votes.at(id) ?? 0} {text} {id} on:index />
					{/each}
				</div>
			</div>
		{/if}

		{#if crossed_statements.length}
			<div>
				<h2 style:margin-bottom="4px">Crossed</h2>
				<div style:display="flex" style:flex-direction="column" style:gap="5px">
					{#each crossed_statements as { id, text } (id)}
						<Crossed {text} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</NiceBackground>
