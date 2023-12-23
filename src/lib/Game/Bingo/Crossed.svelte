<script lang="ts">
	export let text: string;
</script>

<div>
	{text}
</div>

<style>
	div {
		font-weight: bold;
		background: repeating-linear-gradient(
				-45deg,
				transparent,
				transparent 0.5em,
				color-mix(in srgb, currentColor 20%, transparent) 0.5em,
				color-mix(in srgb, currentColor 20%, transparent) 0.6em
			),
			var(--background-color);
		border: 0.15em solid currentColor;
		padding: 0.15em 0.4em;
		border-radius: 0.6em;
		text-align: center;
	}
</style>
