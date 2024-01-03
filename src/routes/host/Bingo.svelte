<script lang="ts">
	import Crossed from '$lib/Game/Bingo/Crossed.svelte';
	import Uncrossed from '$lib/Game/Bingo/Uncrossed.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import Topbar from './Topbar.svelte';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let allStatements: {
		id: number;
		text: string;
	}[];
	export let crossed: number[];
	export let userVotes: number[];

	$: crossed_statements = allStatements
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

	let fullscreenElement;
</script>

<div style:height="100%" bind:this={fullscreenElement}>
	<NiceBackground>
		<div style:border-bottom="0.15em solid">
			<Topbar
				bind:bindableGameInfo
				{gameInfo}
				{fullscreenElement}
				on:next
				on:lock
				showSkip={true}
			/>
		</div>
		<div
			style:max-width="50ch"
			style:margin="auto"
			style:padding="0.4em"
			style:box-sizing="border-box"
		>
			{#if mostUpvotedUncrossedStatement !== undefined}
				<div>
					<h2 style:margin-bottom="0.2em" style:font-family="Poppins">Most Upvoted</h2>
					<div style:display="flex" style:flex-direction="column">
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
					<h2 style:margin-bottom="0.2em" style:font-family="Poppins">Uncrossed</h2>
					<div style:display="flex" style:flex-direction="column" style:gap="0.2em">
						{#each filteredUncrossedStatement as { id, text } (id)}
							<Uncrossed userVotes={userVotes.at(id) ?? 0} {text} {id} on:index />
						{/each}
					</div>
				</div>
			{/if}

			{#if crossed_statements.length}
				<div>
					<h2 style:margin-bottom="0.2em" style:font-family="Poppins">Crossed</h2>
					<div style:display="flex" style:flex-direction="column" style:gap="0.2em">
						{#each crossed_statements as { id, text } (id)}
							<Crossed {text} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</NiceBackground>
</div>
