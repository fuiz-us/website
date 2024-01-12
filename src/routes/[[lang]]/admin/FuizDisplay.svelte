<script lang="ts">
	import * as m from '$paraglide/messages';

	import type { Media } from '$lib';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import type { OnlineFuiz } from './+page';

	function altFromImage(media: Media): string {
		if ('Base64' in media.Image) {
			return media.Image.Base64.alt;
		} else if ('Corkboard' in media.Image) {
			return media.Image.Corkboard.alt;
		} else if ('Url' in media.Image) {
			return media.Image.Url.alt;
		} else {
			return '';
		}
	}

	export let fuiz: OnlineFuiz;
</script>

<dl>
	<dt>{m.author()}</dt>
	<dd>{fuiz.author}</dd>
	<dt>{m.tags()}</dt>
	<dd>{fuiz.tags.join(', ')}</dd>
	<dt>{m.fuiz_title()}</dt>
	<dd>{fuiz.config.title}</dd>
	{#each fuiz.config.slides as slide}
		{@const { title, introduce_question, time_limit, media, answers } = slide.MultipleChoice}
		<dt>{m.multiple_choice()}</dt>
		<dd>
			<dl>
				<dt>{m.question_text()}</dt>
				<dd>{title}</dd>
				{#if media}
					<dt>{Object.getOwnPropertyNames(media.Image)} Image</dt>
					<dd style:height="5em" style:position="relative">
						<MediaContainer {media} />
					</dd>
					<dt>{m.image_alt()}</dt>
					<dd>{altFromImage(media)}</dd>
				{/if}
				<dt>{m.answers()}</dt>
				<dd>
					<ol>
						{#each answers as answer}
							<li>{answer.content.Text}, {answer.correct ? m.correct() : m.wrong()}</li>
						{/each}
					</ol>
				</dd>
				<dt>{m.time_before_answers()}</dt>
				<dd>{introduce_question}ms</dd>
				<dt>{m.time_limit()}</dt>
				<dd>{time_limit}ms</dd>
			</dl>
		</dd>
	{/each}
</dl>
