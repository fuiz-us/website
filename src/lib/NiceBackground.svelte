<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import strawberry from '$lib/assets/strawberry.svg';
	import carrot from '$lib/assets/carrot.svg';
	import broccoli from '$lib/assets/broccoli.svg';
	import grape from '$lib/assets/grape.svg';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div style:height="100%" style:position="relative">
	<div
		style:background-color="var(--background-color)"
		style:inset="0"
		style:position="absolute"
		style:overflow="hidden"
		style:z-index="-1"
	>
		<div style:height="100%" style:width="100%">
			<div style:display="flex" style:flex-wrap="wrap" style:opacity="20%" style:height="100%">
				<div class="card-container" style:transform="scale(1) translate(0%, 0%) rotate(0.0625turn)">
					<img src={strawberry} alt={m.strawberry()} />
				</div>
				<div
					class="card-container"
					style:transform="scale(1) translate(0%, -25%) rotate(-0.0625turn)"
				>
					<img src={grape} alt={m.grape()} />
				</div>
				<div
					class="card-container"
					style:transform="scale(1) translate(-25%, 12.5%) rotate(-0.0625turn)"
				>
					<img src={broccoli} alt={m.broccoli()} />
				</div>
				<div
					class="card-container"
					style:transform="scale(1) translate(12.5%, -25%) rotate(0.0625turn)"
				>
					<img src={carrot} alt={m.carrot()} />
				</div>
			</div>
		</div>
	</div>
	<div style:height="100%">
		{@render children?.()}
	</div>
</div>

<style>
	.card-container {
		height: 50%;
		width: 50%;
	}

	.card-container img {
		height: 100%;
		width: 100%;
	}
</style>
