<script lang="ts">
	import GalleryCreation from './GalleryCreation.svelte';
	import { createDialog } from 'svelte-headlessui';

	import {
		type ExportedFuiz,
		type Creation,
		getCreation,
		getLocalConfig,
		downloadJsonString,
		isNotUndefined,
		type IdlessFuizConfig,
		getConfigFromLocal,
		type Media
	} from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import { goto } from '$app/navigation';
	import Icon from '$lib/Icon.svelte';
	import ghost from '$lib/assets/ghost.svg';
	import Header from '$lib/Header.svelte';
	import { parse } from '@ltd/j-toml';

	export let creations: Creation[];

	export let db: IDBDatabase;

	$: sortedCreations = creations.sort((a, b) => b.lastEdited - a.lastEdited);

	function addSlide() {
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

	function deleteSlide(id: number) {
		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');

		const request = creationsStore.delete(id);

		request.addEventListener('success', () => {
			creations = creations.filter((c) => c.id != id);
		});
	}

	const dialog = createDialog();
	let selectedToDeletion = 0;

	let fileInput: HTMLInputElement;

	function load_from_input() {
		const target = document.querySelector('input[type=file]');
		if (!target) {
			return;
		}
		const input_image = target as HTMLInputElement;
		const filesList = input_image.files;
		if (!filesList) {
			return;
		}
		const files = [];
		for (let i = 0; i < filesList.length; i += 1) {
			const file = filesList.item(i);
			if (file) {
				files.push(file);
			}
		}
		load_file(files);
	}

	async function load_file(files: File[]) {
		const exportedFuizzesWithFailures = await Promise.all(
			files.map((file) => {
				return new Promise<IdlessFuizConfig | undefined>((resolve) => {
					const reader = new FileReader();
					reader.readAsText(file);
					reader.addEventListener('load', () => {
						const str = reader.result?.toString();
						if (str) {
							const detomlified = parse(str, { bigint: false }) as IdlessFuizConfig;
							resolve(detomlified);
						} else {
							resolve(undefined);
						}
					});
				});
			})
		);

		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');

		exportedFuizzesWithFailures.filter(isNotUndefined).forEach((config) => {
			const idedConfig = getConfigFromLocal(config);

			const fuiz = {
				config: idedConfig,
				lastEdited: Date.now()
			};

			const request = creationsStore.put(fuiz);

			request.addEventListener('success', () => {
				const id = request.result;

				creations.push({
					id: parseInt(id.toString()),
					lastEdited: fuiz.lastEdited,
					title: idedConfig.title,
					slidesCount: idedConfig.slides.length,
					media: idedConfig.slides.reduce<Media | undefined>(
						(p, c) => p || c.MultipleChoice.media,
						undefined
					)
				});

				creations = creations;
			});
		});
	}
</script>

<div>
	<NiceBackground>
		<div style:min-height="100vh" style:display="flex" style:flex-direction="column">
			<header style:margin="0.5em 0">
				<Header />
			</header>
			<div
				style:display="flex"
				style:justify-content="center"
				style:gap="0.5em"
				style:flex-wrap="wrap"
				style:padding="0 0.5em"
			>
				<div>
					<FancyButton on:click={addSlide}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Poppins"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon size="1.25em" src="$lib/assets/file_new.svg" alt="add a new one" />
							<div>Start Blank</div>
						</div>
					</FancyButton>
				</div>
				<div>
					<input
						bind:this={fileInput}
						style:display="none"
						type="file"
						id="config"
						accept="application/toml, .toml"
						name="config"
						multiple
						on:change={load_from_input}
					/>
					<FancyButton on:click={() => fileInput.click()}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Poppins"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon size="1.25em" src="$lib/assets/file_open.svg" alt="add a new one" />
							<div>Open File</div>
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
							style:grid-template-columns="repeat(auto-fit, minmax(12ch, 1fr))"
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
									on:delete={() => {
										selectedToDeletion = id;
										dialog.open();
									}}
									on:play={() => goto('/host?id=' + id)}
									on:download={async () => {
										const [creation] = await getCreation(id);
										const configJson = await getLocalConfig(creation);

										downloadJsonString(JSON.stringify(configJson), configJson.title);
									}}
								/>
							{/each}
							{#if $dialog.expanded}
								<div
									style:position="fixed"
									style:background="color-mix(in srgb, var(--background-color) 80%, transparent)"
									style:display="flex"
									style:padding="0.5em"
									style:inset="0"
									style:z-index="1"
								>
									<div
										style:margin="auto"
										style:background="var(--background-color)"
										style:padding="0.5em"
										style:border="0.2em solid"
										style:border-radius="0.7em"
										use:dialog.modal
									>
										<h3 style:margin="0 0 0.4em">Delete Forever?</h3>
										<div style:display="flex" style:gap="0.5em" style:flex-wrap="wrap">
											<div style:flex="1">
												<FancyButton
													backgroundColor="var(--background-color)"
													backgroundDeepColor="currentcolor"
													on:click={dialog.close}
												>
													<div style:padding="0.2em 0.4em">Cancel</div>
												</FancyButton>
											</div>
											<div style:flex="1">
												<FancyButton
													on:click={() => {
														deleteSlide(selectedToDeletion);
														dialog.close();
													}}
												>
													<div style:padding="0.2em 0.4em">Delete</div>
												</FancyButton>
											</div>
										</div>
									</div>
								</div>
							{/if}
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
