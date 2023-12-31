<script lang="ts">
	import Crossed from '$lib/Game/Bingo/Crossed.svelte';
	import Uncrossed from '$lib/Game/Bingo/Uncrossed.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import BingoBoard from './BingoBoard.svelte';

	export let name: string;
	export let score: number;
	export let allStatements: {
		id: number;
		text: string;
	}[];
	export let assignedStatements: number[];
	export let crossed: number[];
	export let userVotes: number[];

	$: crossedStatements = allStatements
		.filter((s) => crossed.includes(s.id))
		.sort((a, b) => a.id - b.id);

	$: uncrossedStatements = allStatements.filter((s) => !crossed.includes(s.id));

	$: mostUpvotedUncrossedStatement = uncrossedStatements
		.sort((a, b) => userVotes[b.id] - userVotes[a.id])
		.at(0);

	$: filteredUncrossedStatement = uncrossedStatements
		.filter(
			(s) => mostUpvotedUncrossedStatement === undefined || s.id != mostUpvotedUncrossedStatement.id
		)
		.sort((a, b) => a.id - b.id);
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar {name} {score} />
	<div style:flex="1">
		<NiceBackground>
			<div
				style:max-width="50ch"
				style:margin="auto"
				style:padding="10px"
				style:box-sizing="border-box"
			>
				<BingoBoard
					assignedStatements={assignedStatements.map((id) => ({
						id,
						text: allStatements.at(id)?.text ?? '',
						crossed: crossed.includes(id)
					}))}
					on:index
				/>
				{#if mostUpvotedUncrossedStatement !== undefined}
					<div>
						<h2 style:margin-bottom="4px" style:font-family="Poppins">Most Upvoted</h2>
						<div style:display="flex" style:flex-direction="column" style:gap="5px">
							<Uncrossed
								userVotes={userVotes.at(mostUpvotedUncrossedStatement.id) ?? 0}
								text={mostUpvotedUncrossedStatement.text}
								id={mostUpvotedUncrossedStatement.id}
								on:index
							/>
						</div>
					</div>
				{/if}

				{#if filteredUncrossedStatement.length}
					<div>
						<h2 style:margin-bottom="4px" style:font-family="Poppins">Uncrossed</h2>
						<div style:display="flex" style:flex-direction="column" style:gap="5px">
							{#each filteredUncrossedStatement as { id, text } (id)}
								<Uncrossed userVotes={userVotes.at(id) ?? 0} {text} {id} on:index />
							{/each}
						</div>
					</div>
				{/if}

				{#if crossedStatements.length}
					<div>
						<h2 style:margin-bottom="4px" style:font-family="Poppins">Crossed</h2>
						<div style:display="flex" style:flex-direction="column" style:gap="5px">
							{#each crossedStatements as { id, text } (id)}
								<Crossed {text} />
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</NiceBackground>
	</div>
</div>
