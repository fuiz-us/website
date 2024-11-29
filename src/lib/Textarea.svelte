<script lang="ts">
	interface Props {
		id: string;
		placeholder: string;
		required: boolean;
		disabled: boolean;
		value: string;
		maxHeight?: string;
		maxLength?: number | undefined;
	}

	let {
		id,
		placeholder,
		required,
		disabled,
		value = $bindable(),
		maxHeight = '4em',
		maxLength = undefined
	}: Props = $props();

	let editableElement: HTMLTextAreaElement | undefined = $state();

	$effect(() => {
		value = value;
		if (!editableElement) return;
		editableElement.style.height = '0';
		editableElement.style.height = (editableElement.scrollHeight + 4).toString() + 'px';
	});
</script>

<div style:position="relative">
	<textarea
		style:max-height={maxHeight}
		bind:this={editableElement}
		{id}
		name={id}
		{required}
		{disabled}
		oninput={(e) => {
			const target: EventTarget | undefined = e?.target ?? undefined;
			const inputtedValue = (target as HTMLTextAreaElement | null)?.value;
			value = inputtedValue?.replaceAll('\n', '').replaceAll('\r', '') ?? value;
		}}
		{value}
		placeholder=""
		maxlength={maxLength}
	></textarea>
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
		color: color-mix(in srgb, currentColor 50%, transparent);
		padding: 0 8px;
		position: absolute;
		pointer-events: none;
		border-radius: 5px 5px 0 0;
		top: 50%;
		transform: translateY(-50%);
		line-height: 1em;
		transform-origin: top;
		transition: all 100ms linear;
	}

	textarea:where(:global(:not(:placeholder-shown), :focus, :active)) + label {
		top: 0;
		scale: 0.75;
		background: var(--background-color);
		transform: translateY(-50%);
	}

	textarea:focus + label {
		color: var(--accent-color);
	}

	textarea {
		background: none;
		font: inherit;
		font-weight: bold;
		border: 2px solid #a9a8aa;
		border-radius: 10px;
		width: 100%;
		color: inherit;
		box-sizing: border-box;
		text-align: center;
		padding: 8px 5px;
		resize: none;
		transition: border-color 100ms linear;
	}

	textarea:focus {
		outline: none;
		border-color: var(--accent-color);
	}
</style>
