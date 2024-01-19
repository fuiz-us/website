<script lang="ts">
	import Answers from '$lib/Game/Answers.svelte';
	import EmptyAnswers from '$lib/Game/EmptyAnswers.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import type { TextOrMedia } from '$lib/types';
	import Topbar from './Topbar.svelte';

	export let questionText: string;
	export let name: string;
	export let score: number;
	export let showAnswers: boolean;
	export let answers: (TextOrMedia | undefined)[];
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<div>
		<Topbar {name} {score} />
		{#if showAnswers}
			<TextBar text={questionText} />
		{/if}
	</div>
	<div style:flex="1">
		<NiceBackground>
			{#if !showAnswers}
				<EmptyAnswers answersCount={answers.length} on:answer />
			{:else}
				<div style:height="100%" style:font-size="1.5em">
					<Answers
						answers={answers.map((t) => ({ text: t?.Text || '?', correct: undefined }))}
						on:answer
					/>
				</div>
			{/if}
		</NiceBackground>
	</div>
</div>
