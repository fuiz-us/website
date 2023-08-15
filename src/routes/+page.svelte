<script>
	import FancyButton from '$lib/FancyButton.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';

	let button = 'Join';
	let placeholder = 'Game ID';

	function submit() {
		return;
	}
</script>

<NiceBackground>
	<div class="centered" style:font-size="x-large">
		<form on:submit|preventDefault={submit}>
			<input type="text" {placeholder} required />
			<div style:margin="5px 0">
				<FancyButton>{button}</FancyButton>
			</div>
		</form>
	</div>
</NiceBackground>

<style>
	.centered {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	form {
		background: white;
		border-radius: 5px;
		box-sizing: content-box;
		padding: 4px 9px;
		margin: 4px;
	}

	input[type='text'] {
		border: 1px solid #a9a8aa;
		border-radius: 5px;
		width: 100%;
		box-sizing: border-box;
		font: inherit;
		margin: 5px 0;
		text-align: center;
		padding: 6.5px 0;
		font-weight: bold;
		text-transform: uppercase;
	}
</style>
