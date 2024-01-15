<script lang="ts">
	import * as m from '$paraglide/messages';

	import { buttonColors, limits } from '$lib';
	import Checkbox from '$lib/Checkbox.svelte';
	import deleteAnswer from '$lib/assets/delete.svg';
	import FancyButton from '$lib/FancyButton.svelte';
	import Textbox from '$lib/Textbox.svelte';
	import IconButton from '$lib/IconButton.svelte';
	import type { TextOrMedia } from '$lib/types';

	export let correct: boolean;
	export let content: TextOrMedia;
	export let index: number;
</script>

<FancyButton
	backgroundColor={buttonColors.at(index % buttonColors.length)?.[0]}
	backgroundDeepColor={buttonColors.at(index % buttonColors.length)?.[1]}
	active={false}
>
	<div
		style:display="flex"
		style:align-items="center"
		style:padding="0.15em 0.3em"
		style:gap="0.3em"
		style:color="var(--palette-light)"
	>
		<div style:height="1.5em" style:display="flex">
			<Checkbox bind:value={correct} color={buttonColors.at(index % buttonColors.length)?.[0]} />
		</div>
		<Textbox
			bind:value={content.Text}
			placeholder={m.answer_text()}
			textAlign="start"
			lightText
			maxLength={limits.fuiz.maxAnswerTextLength}
		/>
		<IconButton src={deleteAnswer} alt={m.delete_answer()} size="1.25em" on:click />
	</div>
</FancyButton>
