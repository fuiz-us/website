<script lang="ts">
	import { palette_dark } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import assignmentTurned from '$lib/assets/answer_turned.svg';

	export let answeredCount: number;
</script>

<div
	style:position="absolute"
	style:margin="10px"
	style:top="0"
	style:right="0"
	style:z-index="1"
	style:padding="5px 20px"
	style:display="flex"
	style:gap="10px"
	style:align-items="center"
	style:background="var(--background-color)"
	style:border="3px solid {palette_dark}"
	style:border-radius="200px"
>
	<Icon src={assignmentTurned} alt="people who answered" size="40px" />
	<div style:font-size="36px" style:font-family="Poppins">
		{answeredCount}
	</div>
</div>
