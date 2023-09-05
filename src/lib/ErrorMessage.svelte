<script lang="ts">
	import warning from '$lib/assets/warning.svg';

	export let errorMessage: string;
</script>

{#if errorMessage}
	<div
		style:width="100%"
		style:display="flex"
		style:align-items="center"
		style:background="#e01b2430"
		style:padding="5px"
		style:box-sizing="border-box"
		style:border-radius="5px"
		style:gap="5px"
		style:color="#e01b24"
		style:font-weight="bold"
	>
		<img src={warning} alt="error" style:height="1em" style:width="1em" />
		<div style:flex="1" style:text-align="center">
			{errorMessage}
		</div>
	</div>
{/if}
