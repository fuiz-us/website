<script lang="ts">
	import { page } from '$app/stores';
	import type { IncomingMessage, IncomingMessageState } from '$lib';
	import { onMount } from 'svelte';
	import ChooseName from './ChooseName.svelte';
	import WaitingMobile from './WaitingMobile.svelte';
	import Question from './Question.svelte';
	import Answers from './Answers.svelte';
	import Result from './Result.svelte';
	import WaitingOthers from './WaitingOthers.svelte';
	import Leaderboard from './Leaderboard.svelte';
	import Loading from '$lib/Loading.svelte';
	import { PUBLIC_WS_URL } from '$env/static/public';

	let socket: WebSocket;

	let msg: IncomingMessageState | undefined = undefined;

	let loading = true;

	let name: string | undefined = undefined;

	let errorMessage = '';

	let score = 0;

	let last_answered: number | undefined = undefined;

	let nameChooser: ChooseName;

	const code = $page.url.searchParams.get('code') || 'FOOBAR';

	onMount(() => {
		socket = new WebSocket(PUBLIC_WS_URL + '/watch/' + code);

		// // Listen for messages
		socket.addEventListener('message', (event) => {
			let new_msg: IncomingMessage = JSON.parse(event.data);

			if ('Game' in new_msg) {
				if (new_msg.Game === 'NameChoose') {
					loading = false;
					return;
				} else if ('NameAssign' in new_msg.Game) {
					loading = false;
					name = new_msg.Game.NameAssign;
					return;
				} else if ('NameError' in new_msg.Game) {
					if (new_msg.Game.NameError == 'Used') {
						errorMessage = 'Nickname already in-use';
					} else if (new_msg.Game.NameError == 'Assigned') {
						errorMessage = 'You already have a nickname';
					}
					nameChooser.reset();
					return;
				}
			} else if ('MultipleChoice' in new_msg) {
				if (msg && msg !== 'WaitingForOthers' && 'MultipleChoice' in msg) {
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

				if ('AnswersAnnouncement' in new_msg.MultipleChoice) {
					last_answered = undefined;
				} else if ('Leaderboard' in new_msg.MultipleChoice) {
					score = new_msg.MultipleChoice.Leaderboard.points.find(([x]) => x === name)?.[1] ?? 0;
				} else if ('AnswersCount' in new_msg.MultipleChoice) return;
			}

			msg = new_msg as IncomingMessageState;
		});
	});

	function requestName(name: string) {
		errorMessage = '';
		socket.send(JSON.stringify({ Unassigned: { NameRequest: name } }));
	}

	function sendAnswer(index: number) {
		socket.send(JSON.stringify({ Player: { IndexAnswer: index } }));
		last_answered = index;
		msg = 'WaitingForOthers';
	}
</script>

{#if loading}
	<Loading />
{:else if name === undefined}
	<ChooseName bind:this={nameChooser} on:setName={(x) => requestName(x.detail)} {errorMessage} />
{:else if msg !== undefined}
	{#if 'WaitingForOthers' === msg}
		<WaitingOthers {name} {score} />
	{:else if 'Game' in msg}
		{#if 'WaitingScreen' in msg.Game}
			<WaitingMobile {name} gameCode={code} />
		{/if}
	{:else if 'MultipleChoice' in msg}
		{#if 'QuestionAnnouncment' in msg.MultipleChoice}
			<Question {name} {score} questionText={msg.MultipleChoice.QuestionAnnouncment.question} />
		{:else if 'AnswersAnnouncement' in msg.MultipleChoice}
			<Answers
				on:answer={(e) => sendAnswer(e.detail)}
				{name}
				{score}
				answersCount={msg.MultipleChoice.AnswersAnnouncement.answers.length}
			/>
		{:else if 'AnswersResults' in msg.MultipleChoice}
			<Result
				{name}
				{score}
				correct={last_answered === undefined
					? false
					: msg.MultipleChoice.AnswersResults.results[last_answered].correct}
			/>
		{:else if 'Leaderboard' in msg.MultipleChoice}
			<Leaderboard
				{name}
				{score}
				position={msg.MultipleChoice.Leaderboard.points.findIndex(([x]) => x === name)}
				final={msg.MultipleChoice.Leaderboard.index !== undefined &&
					msg.MultipleChoice.Leaderboard.index + 1 === msg.MultipleChoice.Leaderboard.count}
			/>
		{/if}
	{/if}
{/if}
