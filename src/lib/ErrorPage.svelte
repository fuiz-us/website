<script lang="ts">
	import { scale } from 'svelte/transition';
	import ErrorMessage from './ErrorMessage.svelte';
	import { backOut } from 'svelte/easing';
	import TypicalPage from './TypicalPage.svelte';

	export let errorMessage: string;
</script>

<TypicalPage>
	<div
		style:height="100%"
		style:display="flex"
		style:align-items="center"
		style:max-width="40ch"
		style:margin="10px"
		transition:scale={{ delay: 500, duration: 150, easing: backOut }}
	>
		<div>
			<ErrorMessage {errorMessage} />
		</div>
	</div>
</TypicalPage>
