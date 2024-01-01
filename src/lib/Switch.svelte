<script lang="ts">
	export let checked: boolean;
	export let id: string;
</script>

<div id="group" data-checked={checked}>
	<label for={id}><slot /></label>
	<input {id} type="checkbox" role="switch" bind:checked />
	<button on:click={() => (checked = !checked)} type="button">
		<div id="knob-container">
			<div id="start" />
			<div id="middle">
				<div id="middle-color">
					<div class="align">
						<div id="knob" />
					</div>
				</div>
			</div>
			<div id="end" />
		</div>
	</button>
</div>

<style>
	#group {
		display: flex;
		align-items: top;
	}

	label {
		flex: 1;
		padding-inline-end: 0.5em;
	}

	input {
		display: none;
	}

	button {
		appearance: none;
		background: none;
		cursor: pointer;
		margin: 0;
		padding: 0;
		font: inherit;
		color: inherit;
		border: none;
		padding: 0.1em;
		border: 0.1em solid currentColor;
		box-sizing: content-box;

		display: inline-flex;
		height: 0.8em;
		width: 1.6em;
		border-radius: 2em;
	}

	#knob-container {
		border-radius: 1em;
		background-size: 0%;
		flex: 1;
		display: flex;
	}

	#knob {
		display: block;
		position: absolute;
		background: currentColor;
		height: 100%;
		aspect-ratio: 1/1;
		border-radius: 100%;
	}

	#start {
		aspect-ratio: 1 / 2;
		border-start-start-radius: 1em;
		border-end-start-radius: 1em;
		background: var(--accent-color);
	}

	#end {
		aspect-ratio: 1 / 2;
	}

	#middle {
		flex: 1;
		display: flex;
	}

	#middle-color {
		background: var(--accent-color);
		transition: width 150ms ease-out;
		width: 0%;
		display: flex;
		justify-content: end;
	}

	.align {
		position: relative;
		display: flex;
		justify-content: center;
	}

	[data-checked='true'] #middle-color {
		width: 100%;
	}
</style>
