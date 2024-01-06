<script lang="ts">
	export let value: number;

	export let duration: number;
	export let delay: number;
</script>

<div style:--num={value} style:--duration="{duration}ms" style:--delay="{delay}ms" />

<style>
	@property --num {
		syntax: '<integer>';
		initial-value: 0;
		inherits: false;
	}

	div {
		transition: --num var(--duration) cubic-bezier(0.16, 1, 0.3, 1) var(--delay);
		counter-reset: num var(--num);
	}

	div::after {
		content: counter(num);
	}
</style>
