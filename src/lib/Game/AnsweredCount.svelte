<script lang="ts">
	export let answeredCount: number;
</script>

<div
	style:position="absolute"
	style:margin="10px"
	style:top="0"
	style:right="0"
	style:text-align="center"
	style:z-index="1"
>
	<div
		style:padding="5px 10px"
		style:background="white"
		style:border="2px solid darkgray"
		style:border-radius="5px"
	>
		<div style:font-size="36px" style:font-family="Poppins">
			{answeredCount}
		</div>
		<div style:font-weight="bold" style:font-size="24px">ANSWERS</div>
	</div>
</div>
