<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Waiting from '../Waiting.svelte';
	import Question from '../Question.svelte';
	import QuestionAnswers from '../QuestionAnswers.svelte';
	import QuestionStatistics from '../QuestionStatistics.svelte';
	import { zip, type ServerIncomingMessage } from '$lib';
	import Leaderboard from '../Leaderboard.svelte';
	import Loading from '$lib/Loading.svelte';
	import { PUBLIC_WS_URL } from '$env/static/public';

	let msg: ServerIncomingMessage | undefined = undefined;

	let socket: WebSocket;

	let timer = 0;

	setInterval(() => {
		timer = Math.max(0, timer - 1000);
	}, 1000);

	const code = $page.url.searchParams.get('code') || 'FOOBAR';

	onMount(() => {
		socket = new WebSocket(PUBLIC_WS_URL + '/watch/' + code);

		// Listen for messages
		socket.addEventListener('message', (event) => {
			let new_msg: ServerIncomingMessage = JSON.parse(event.data);

			if ('MultipleChoice' in new_msg && 'QuestionAnnouncment' in new_msg.MultipleChoice) {
				timer = new_msg.MultipleChoice.QuestionAnnouncment.duration;
			} else if ('MultipleChoice' in new_msg && 'AnswersAnnouncement' in new_msg.MultipleChoice) {
				timer = new_msg.MultipleChoice.AnswersAnnouncement.duration;
			}

			if ('MultipleChoice' in new_msg && msg && 'MultipleChoice' in msg) {
				if (
					'AnswersAnnouncement' in new_msg.MultipleChoice &&
					'QuestionAnnouncment' in msg.MultipleChoice
				) {
					new_msg.MultipleChoice.AnswersAnnouncement.question ||=
						msg.MultipleChoice.QuestionAnnouncment.question;
					new_msg.MultipleChoice.AnswersAnnouncement.index ||=
						msg.MultipleChoice.QuestionAnnouncment.index;
					new_msg.MultipleChoice.AnswersAnnouncement.count ||=
						msg.MultipleChoice.QuestionAnnouncment.count;
					new_msg.MultipleChoice.AnswersAnnouncement.media ||=
						msg.MultipleChoice.QuestionAnnouncment.media;
				}
				if (
					'AnswersCount' in new_msg.MultipleChoice &&
					'AnswersAnnouncement' in msg.MultipleChoice
				) {
					msg.MultipleChoice.AnswersAnnouncement.answered_count =
						new_msg.MultipleChoice.AnswersCount;
					return;
				}
				if (
					'AnswersResults' in new_msg.MultipleChoice &&
					'AnswersAnnouncement' in msg.MultipleChoice
				) {
					new_msg.MultipleChoice.AnswersResults.question ||=
						msg.MultipleChoice.AnswersAnnouncement.question;
					new_msg.MultipleChoice.AnswersResults.index ||=
						msg.MultipleChoice.AnswersAnnouncement.index;
					new_msg.MultipleChoice.AnswersResults.count ||=
						msg.MultipleChoice.AnswersAnnouncement.count;
					new_msg.MultipleChoice.AnswersResults.answers ||=
						msg.MultipleChoice.AnswersAnnouncement.answers;
				}
				if ('Leaderboard' in new_msg.MultipleChoice && 'AnswersResults' in msg.MultipleChoice) {
					new_msg.MultipleChoice.Leaderboard.index ||= msg.MultipleChoice.AnswersResults.index;
					new_msg.MultipleChoice.Leaderboard.count ||= msg.MultipleChoice.AnswersResults.count;
				}
			}

			msg = new_msg;
		});
	});

	function next() {
		socket.send(HOST_NEXT);
	}

	const HOST_NEXT = JSON.stringify({ Host: 'Next' });
</script>

{#if msg !== undefined}
	{#if 'Game' in msg}
		<Waiting on:next={next} {code} players={msg.Game.WaitingScreen} />
	{:else if 'MultipleChoice' in msg}
		{#if 'QuestionAnnouncment' in msg.MultipleChoice}
			<Question
				on:next={next}
				questionIndex={msg.MultipleChoice.QuestionAnnouncment.index}
				questionTotalCount={msg.MultipleChoice.QuestionAnnouncment.count}
				gameId={code}
				questionText={msg.MultipleChoice.QuestionAnnouncment.question}
			/>
		{:else if 'AnswersAnnouncement' in msg.MultipleChoice}
			<QuestionAnswers
				on:next={next}
				gameId={code}
				questionIndex={msg.MultipleChoice.AnswersAnnouncement.index || 0}
				questionTotalCount={msg.MultipleChoice.AnswersAnnouncement.count || 1}
				questionText={msg.MultipleChoice.AnswersAnnouncement.question || ''}
				answers={msg.MultipleChoice.AnswersAnnouncement.answers.map((x) => x.Text)}
				timeLeft={timer}
				answeredCount={msg.MultipleChoice.AnswersAnnouncement.answered_count || 0}
			>
				{#if msg.MultipleChoice.AnswersAnnouncement.media}
					<img
						src={msg.MultipleChoice.AnswersAnnouncement.media.Image.Internet.url}
						alt={msg.MultipleChoice.AnswersAnnouncement.media.Image.Internet.alt}
					/>
				{/if}
			</QuestionAnswers>
		{:else if 'AnswersResults' in msg.MultipleChoice}
			<QuestionStatistics
				on:next={next}
				gameId={code}
				questionIndex={msg.MultipleChoice.AnswersResults.index || 0}
				questionTotalCount={msg.MultipleChoice.AnswersResults.count || 1}
				questionText={msg.MultipleChoice.AnswersResults.question || ''}
				answers={zip(
					msg.MultipleChoice.AnswersResults.answers || [],
					msg.MultipleChoice.AnswersResults.results
				).map(([x, ar]) => ({
					text: x.Text,
					count: ar.count,
					correct: ar.correct
				}))}
			/>
		{:else if 'Leaderboard' in msg.MultipleChoice}
			<Leaderboard
				on:next={next}
				gameId={code}
				questionIndex={msg.MultipleChoice.Leaderboard.index || 0}
				questionTotalCount={msg.MultipleChoice.Leaderboard.count || 1}
				results={msg.MultipleChoice.Leaderboard.points}
				final={(msg.MultipleChoice.Leaderboard.index || 0) + 1 ===
					(msg.MultipleChoice.Leaderboard.count || 1)}
			/>
		{/if}
	{/if}
{:else}
	<Loading />
{/if}
