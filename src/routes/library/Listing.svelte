<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import Icon from '$lib/Icon.svelte';
	import { grades, subjects, type PublishedFuiz } from '$lib/types';
	import OnlinePublised from './OnlinePublised.svelte';
	import LoadingCircle from '$lib/LoadingCircle.svelte';
	import Textfield from '$lib/Textfield.svelte';
	import { debounce } from '$lib/util';
	import RegularCheckbox from '$lib/regular-checkbox.svelte';
	import { availableLanguageTags } from '$lib/paraglide/runtime';

	export let recentlyPublished: PublishedFuiz[];

	let searchTerm = '';

	let results: Promise<PublishedFuiz[] | undefined> | undefined = undefined;

	const search = debounce(
		() =>
			(results = fetch('library/search', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					term: searchTerm,
					subjects: subjectsList,
					grades: gradesList,
					languages: languagesList
				})
			})
				.then((res) => (res.ok ? (res.json() as Promise<PublishedFuiz[]>) : undefined))
				.catch(() => undefined)),
		500
	);

	$: {
		subjectsList.length || gradesList.length || languagesList.length || searchTerm.length
			? search()
			: (results = undefined);
	}

	let subjectsSelected = subjects.map((subject) => ({ name: subject, selected: false }));

	$: subjectsList = subjectsSelected
		.filter((subject) => subject.selected)
		.map((subject) => subject.name);

	let gradesSelected = grades.map((grade) => ({ name: grade, selected: false }));

	$: gradesList = gradesSelected.filter((grade) => grade.selected).map((grade) => grade.name);

	let languagesSelected = availableLanguageTags.map((language) => ({
		name: language,
		display: new Intl.DisplayNames([language], { type: 'language' }).of(language),
		selected: false
	}));

	$: languagesList = languagesSelected
		.filter((language) => language.selected)
		.map((language) => language.name);
</script>

<Textfield
	id="search"
	required={false}
	disabled={false}
	bind:value={searchTerm}
	placeholder="Search"
/>

<div class="main-view">
	<div class="filters">
		<details>
			<summary>Grades</summary>
			<div class="checkbox-list">
				{#each gradesSelected as grade}
					<label>
						<input type="checkbox" bind:checked={grade.selected} style:display="none" />
						<RegularCheckbox checked={grade.selected} />
						{grade.name}
					</label>
				{/each}
			</div>
		</details>
		<details>
			<summary>Subjects</summary>
			<div class="checkbox-list">
				{#each subjectsSelected as subject}
					<label>
						<input type="checkbox" bind:checked={subject.selected} style:display="none" />
						<RegularCheckbox checked={subject.selected} />
						{subject.name}
					</label>
				{/each}
			</div>
		</details>
		<details>
			<summary>Language</summary>
			<div class="checkbox-list">
				{#each languagesSelected as language}
					<label>
						<input type="checkbox" bind:checked={language.selected} style:display="none" />
						<RegularCheckbox checked={language.selected} />
						{language.display}
					</label>
				{/each}
			</div>
		</details>
	</div>
	{#await results}
		<div
			style:display="flex"
			style:justify-content="center"
			style:align-items="center"
			style:flex="1"
		>
			<div style:height="1em" style:width="1em" style:margin="1em">
				<LoadingCircle />
			</div>
		</div>
	{:then res}
		{#if res && (searchTerm.length || subjectsList.length || gradesList.length || languagesList.length)}
			<div class="section">
				<h3>Search Results</h3>
				<div class="grid">
					{#each res as fuiz}
						<a href="library/public/{fuiz.storage_id}">
							<OnlinePublised data={fuiz} />
						</a>
					{:else}
						<div
							style:display="flex"
							style:flex-direction="column"
							style:opacity="0.7"
							style:align-items="center"
						>
							<Icon src="$lib/assets/ghost.svg" size="min(20vh, 60vw)" alt={m.nothing()} />
							{m.nothing()}
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="section">
				<h3>{m.recently_published()}</h3>
				<div class="grid">
					{#each recentlyPublished as fuiz}
						<a href="library/public/{fuiz.storage_id}">
							<OnlinePublised data={fuiz} />
						</a>
					{:else}
						<div
							style:display="flex"
							style:flex-direction="column"
							style:opacity="0.7"
							style:align-items="center"
						>
							<Icon src="$lib/assets/ghost.svg" size="min(20vh, 60vw)" alt={m.nothing()} />
							{m.nothing()}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/await}
</div>

<style>
	.main-view {
		display: flex;
		flex-wrap: wrap;
	}

	.filters {
		display: flex;
		flex-direction: column;
		gap: 0.8em;
		padding: 0.5em;
		min-width: 15ch;
	}

	.checkbox-list {
		display: flex;
		flex-direction: column;
		font-size: 0.8em;
		gap: 0.2em;

		& label {
			display: flex;
			gap: 0.2em;
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15ch, 1fr));
		grid-auto-rows: 1fr;
		grid-gap: 0.4em;
	}

	h3 {
		margin: 0.2em 0;
		font-family: 'Poppins';
	}

	.section {
		margin-bottom: 0.8em;
	}

	a {
		color: inherit;
		text-decoration: inherit;
	}
</style>
