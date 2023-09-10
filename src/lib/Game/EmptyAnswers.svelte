<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import EmptyAnswerButton from './EmptyAnswerButton.svelte';

	export let answersCount: number;

	const dispatch = createEventDispatcher<{
		answer: number;
	}>();
</script>

<div
	style:display="grid"
	style:height="100%"
	style:box-sizing="border-box"
	style:grid-template-columns="1fr 1fr"
	style:grid-template-rows="repeat({Math.ceil(answersCount / 2)}, 1fr)"
	style:gap="5px"
	style:padding="5px"
>
	{#each Array(answersCount).keys() as index}
		<EmptyAnswerButton {index} on:click={() => dispatch('answer', index)} />
	{/each}
</div>
