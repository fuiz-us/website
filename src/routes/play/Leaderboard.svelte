<script lang="ts">
	import { medal_colors } from '$lib';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import medal from '$lib/assets/medal.svg';
	import Icon from '$lib/Icon.svelte';

	export let name: string;
	export let score: number;
	export let position: number | undefined;
	export let final: boolean;
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar {name} {score} />
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:justify-content="center"
				style:align-items="center"
			>
				<div
					style:display="flex"
					style:gap="10px"
					style:flex-direction="column"
					style:align-items="center"
					style:font-size="xx-large"
				>
					{#if position !== undefined}
						{#if position < 3}
							<div
								style:height="100%"
								style:width="100%"
								style:display="flex"
								style:flex-direction="column"
								style:align-items="center"
								style:justify-content="center"
								style:background={medal_colors[position]}
								style:border-radius="5px"
								style:padding="12px"
								style:color="white"
								style:font-family="Poppins"
								style:box-sizing="border-box"
							>
								<div style:filter="drop-shadow(0 2px 2px rgb(0 0 0 / 0.25))">
									<Icon size="200px" src={medal} alt="medal" />
								</div>
								<div style:text-shadow="0 2px 2px rgb(0 0 0 / 0.25)">
									{#if position === 0}
										1st
									{:else if position === 1}
										2nd
									{:else}
										3rd
									{/if}
								</div>
							</div>
							{#if final}
								Great Job!
							{:else}
								Keep it up!
							{/if}
						{:else}
							<div
								style:display="flex"
								style:flex-direction="column"
								style:align-items="center"
								style:font-size="112px"
							>
								#{position + 1}
							</div>
							{#if final}
								Not bad!
							{:else}
								You can catch up!
							{/if}
						{/if}
					{:else}
						You are not there!
					{/if}
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
