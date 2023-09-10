<script lang="ts">
	import EmptyAnswers from '$lib/Game/EmptyAnswers.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';

	export let name: string;
	export let score: number;
	export let answersCount: number;
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<div>
		<Topbar {name} {score} />
	</div>
	<div style:flex="1">
		<NiceBackground>
			<EmptyAnswers {answersCount} on:answer />
		</NiceBackground>
	</div>
</div>
