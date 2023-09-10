<script lang="ts">
	export let timeLeft: number;
</script>

<div
	style:position="absolute"
	style:margin="10px"
	style:top="0"
	style:left="0"
	style:font-family="Poppins"
	style:font-size="36px"
	style:z-index="1"
>
	<div
		style:padding="5px 10px"
		style:background="orange"
		style:border="2px solid darkorange"
		style:border-radius="5px"
		style:color="white"
	>
		{Math.ceil(timeLeft / 1000)}
	</div>
</div>
