<script lang="ts">
	import GalleryCreation from './GalleryCreation.svelte';

	import { type ExportedFuiz, type Creation } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import add from '$lib/assets/add.svg';
	import { goto } from '$app/navigation';
	import Icon from '$lib/Icon.svelte';
	import ghost from '$lib/assets/ghost.svg';
	import Header from '$lib/Header.svelte';

	export let creations: Creation[];

	export let db: IDBDatabase;

	$: sortedCreations = creations.sort((a, b) => b.lastEdited - a.lastEdited);

	function add_slide() {
		let newSlide: ExportedFuiz = {
			lastEdited: Date.now(),
			config: {
				title: 'Untitled',
				slides: []
			}
		};

		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');

		const request = creationsStore.put(newSlide);

		request.addEventListener('success', () => {
			const id = request.result;

			creations.push({
				id: parseInt(id.toString()),
				lastEdited: newSlide.lastEdited,
				title: newSlide.config.title,
				slidesCount: newSlide.config.slides.length
			});

			creations = creations;

			goto('?id=' + id.toString());
		});
	}

	function delete_slide(id: number) {
		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');

		const request = creationsStore.delete(id);

		request.addEventListener('success', () => {
			creations = creations.filter((c) => c.id != id);
		});
	}
</script>

<div>
	<NiceBackground>
		<div style:min-height="100vh" style:display="flex" style:flex-direction="column">
			<header style:margin="0.5em 0">
				<Header />
			</header>
			<div style:display="flex" style:justify-content="center">
				<div>
					<FancyButton on:click={add_slide}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Poppins"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon size="1.25em" src={add} alt="add a new one" />
							<div>Start Blank</div>
						</div>
					</FancyButton>
				</div>
			</div>
			<div style:flex="1" style:margin="0 0.4em">
				<div
					style:max-width="60ch"
					style:padding="0.5em"
					style:box-sizing="border-box"
					style:margin="1em auto"
					style:background="color-mix(in srgb, currentColor 20%, transparent)"
					style:border="0.1em solid color-mix(in srgb, currentColor 80%, transparent)"
					style:border-radius="0.7em"
				>
					<h2
						style:font-family="Poppins"
						style:line-height="1"
						style:margin="0 0 0.2em"
						style:border-bottom="0.05em solid color-mix(in srgb, currentColor 80%, transparent)"
					>
						Recent Fuizzes
					</h2>
					{#if sortedCreations.length}
						<div
							style:display="grid"
							style:grid-template-columns="repeat(auto-fit, minmax(15ch, 1fr))"
							style:grid-auto-rows="1fr"
							style:grid-gap="0.4em"
						>
							{#each sortedCreations as { id, title, lastEdited, slidesCount, media }}
								<GalleryCreation
									{id}
									{title}
									{lastEdited}
									{slidesCount}
									{media}
									on:delete={() => delete_slide(id)}
									on:play={() => goto('/host?id=' + id)}
								/>
							{/each}
						</div>
					{:else}
						<div
							style:display="flex"
							style:flex-direction="column"
							style:align-items="center"
							style:opacity="0.3"
						>
							<Icon src={ghost} size="min(20vh, 60vw)" alt="Nothing Here" />
							Nothing
						</div>
					{/if}
				</div>
			</div>
			<Footer />
		</div>
	</NiceBackground>
</div>
