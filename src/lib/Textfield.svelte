<script lang="ts">
	export let id: string;
	export let placeholder: string;
	export let required: boolean;
	export let disabled: boolean;
	export let value: string;
	export let text_transform = '';
</script>

<div style:position="relative">
	<input {id} type="text" style:text-transform={text_transform} {required} {disabled} bind:value />
	<label for={id}>{placeholder}</label>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	label {
		text-align: center;
		color: #a9a8aa;
		padding: 0 8px;
		position: absolute;
		pointer-events: none;
		border-radius: 5px;
		top: 50%;
		transform: translateY(-50%);
		transition: all 100ms linear;
	}

	input:where(:valid, :focus) + label {
		top: 0;
		scale: 0.75;
		background: var(--palette-light);
		transform: translateY(-50%);
	}

	input:focus + label {
		color: var(--accent-color);
	}

	input {
		background: none;
		border: 2px solid #a9a8aa;
		border-radius: 10px;
		width: 100%;
		box-sizing: border-box;
		font: inherit;
		margin: 5px 0;
		box-sizing: border-box;
		text-align: center;
		padding: 6.5px 5px;
		resize: none;
		transition: border-color 100ms linear;
	}

	input:focus {
		outline: none;
		border-color: var(--accent-color);
	}
</style>
