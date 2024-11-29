<script lang="ts">
	import FancyButton from '$lib/FancyButton.svelte';
	import { signIn } from '@auth/sveltekit/client';
	import type { PageData } from './$types';
	import MainHeader from '../MainHeader.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import { i18n } from '$lib/i18n';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<NiceBackground>
	<div style:height="100%" style:display="flex" style:flex-direction="column">
		<MainHeader />
		<div
			style:height="100%"
			style:display="flex"
			style:align-items="center"
			style:justify-content="center"
		>
			<div
				style:max-width="30ch"
				style:text-align="center"
				style:border="2px solid"
				style:border-radius="1em"
				style:padding="1em"
			>
				<h2 style:margin="0 0 0.8em 0">Log in</h2>
				<div>
					{#each data.providers as provider}
						<FancyButton
							onclick={() =>
								signIn(provider.id, {
									callbackUrl: i18n.resolveRoute('/create')
								})}
							backgroundColor="var(--background-color)"
							backgroundDeepColor="var(--color)"
							foregroundColor="var(--color)"
						>
							<div
								style:display="flex"
								style:padding="0.5em 1em"
								style:justify-content="center"
								style:gap="0.5em"
							>
								<img
									src="https://authjs.dev/img/providers/{provider.id}.svg"
									alt="provider logo"
									style:height="1.25em"
								/>
								Continue with {provider.name}
							</div>
						</FancyButton>
					{/each}
				</div>
			</div>
		</div>
	</div>
</NiceBackground>
