<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { assertUnreachable, fixTimes, removeIds } from '$lib';
	import { updateCreation, type Database, type ExportedFuiz } from '$lib/storage';
	import type { FuizConfig } from '$lib/types';
	import { debounce } from '$lib/util';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';
	import { share } from './lib';
	import { page } from '$app/stores';

	export let id: number;
	export let exportedFuiz: ExportedFuiz;
	export let config: FuizConfig;
	export let db: Database;

	const updateStorage = debounce(() => {
		exportedFuiz = {
			...exportedFuiz,
			versionId: exportedFuiz.versionId + 1
		};
		updateCreation(
			id,
			{
				...exportedFuiz,
				config: fixTimes(removeIds(config)),
				lastEdited: Date.now()
			},
			db
		);
	}, 500);

	$: {
		config && updateStorage();
	}

	$: no_answer =
		config.slides.filter((s) => {
			switch (true) {
				case 'MultipleChoice' in s:
					return s.MultipleChoice.answers.length == 0;
				case 'TypeAnswer' in s:
					return s.TypeAnswer.answers.length == 0;
				case 'Order' in s:
					return s.Order.answers.length == 0;
				default:
					return assertUnreachable(s);
			}
		}).length > 0;

	$: no_correct_answer =
		config.slides.filter((s) => {
			switch (true) {
				case 'MultipleChoice' in s:
					return s.MultipleChoice.answers.filter((s) => s.correct).length == 0;
				case 'TypeAnswer' in s:
					return false;
				case 'Order' in s:
					return false;
				default:
					return assertUnreachable(s);
			}
		}).length > 0;
</script>

<div
	style:min-height="100dvh"
	style:background="var(--background-color)"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar
		bind:title={config.title}
		bind:id
		{db}
		on:share={async (e) => {
			await share(removeIds(config), $page.data.user ? exportedFuiz.uniqueId : undefined);
			e.detail.show();
		}}
		errorMessage={no_answer
			? m.missing_answers()
			: no_correct_answer
			? m.missing_correct()
			: undefined}
	/>
	<Main bind:config />
</div>
