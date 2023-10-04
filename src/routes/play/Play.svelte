<script lang="ts">
	import { bring, type IncomingMessage, type IncomingMessageState } from '$lib';
	import { onMount } from 'svelte';
	import ChooseName from './ChooseName.svelte';
	import WaitingMobile from './WaitingMobile.svelte';
	import Question from './Question.svelte';
	import Answers from './Answers.svelte';
	import Result from './Result.svelte';
	import WaitingOthers from './WaitingOthers.svelte';
	import Leaderboard from './Leaderboard.svelte';
	import Loading from '$lib/Loading.svelte';
	import { PUBLIC_BACKEND_URL, PUBLIC_WS_URL } from '$env/static/public';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Bingo from './Bingo.svelte';
	import Winners from './Winners.svelte';

	let socket: WebSocket;

	let msg: IncomingMessageState | undefined = undefined;

	let loading = true;

	let status: 'loading' | 'open' | 'error' = 'loading';

	let name: string | undefined = undefined;

	let errorMessage = '';

	let score = 0;

	let last_answered: number | undefined = undefined;

	let nameChooser: ChooseName;

	export let code: string;

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
					if (new_msg.Game.NameError === 'Used') {
						errorMessage = 'Nickname already in-use';
					} else if (new_msg.Game.NameError === 'Assigned') {
						errorMessage = 'You already have a nickname';
					} else if (new_msg.Game.NameError === 'Empty') {
						errorMessage = 'Nickname cannot be empty';
					} else if (new_msg.Game.NameError === 'Sinful') {
						errorMessage = 'Nickname is inappropriate';
					} else if (new_msg.Game.NameError === 'TooLong') {
						errorMessage = 'Nickname is too long';
					}
					nameChooser.reset();
					return;
				}
			} else if ('MultipleChoice' in new_msg) {
				if (msg) {
					if ('MultipleChoice' in msg) {
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
					} else if ('WaitingForOthers' in msg) {
						if ('AnswersResults' in new_msg.MultipleChoice) {
							new_msg.MultipleChoice.AnswersResults.index ||= msg.WaitingForOthers.index;
							new_msg.MultipleChoice.AnswersResults.count ||= msg.WaitingForOthers.count;
						}
					}

					if ('AnswersAnnouncement' in new_msg.MultipleChoice) {
						last_answered = undefined;
					} else if ('Leaderboard' in new_msg.MultipleChoice) {
						score = new_msg.MultipleChoice.Leaderboard.points.find(([x]) => x === name)?.[1] ?? 0;
					} else if ('AnswersCount' in new_msg.MultipleChoice) return;
				}
			} else if ('Bingo' in new_msg) {
				if (msg && 'Bingo' in msg) {
					if ('Cross' in new_msg.Bingo && 'List' in msg.Bingo) {
						msg.Bingo.List.crossed = new_msg.Bingo.Cross.crossed;
						return;
					}
					if ('Votes' in new_msg.Bingo && 'List' in msg.Bingo) {
						msg.Bingo.List.user_votes = new_msg.Bingo.Votes.user_votes;
						return;
					}
				}
			}

			msg = new_msg as IncomingMessageState;
		});

		socket.addEventListener('close', async () => {
			if (status !== 'error') {
				const res = await bring(PUBLIC_BACKEND_URL + '/alive/' + code, {
					method: 'GET',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});
				if (res === undefined) {
					status = 'error';
					errorMessage = 'Connection Closed';
				} else {
					let text = await res.text();
					if (text === 'true') {
						location.reload();
					} else {
						status = 'error';
						errorMessage = 'Game Ended';
					}
				}
			}
		});

		socket.addEventListener('open', () => {
			status = 'open';
			errorMessage = '';
		});

		socket.addEventListener('error', () => {
			status = 'error';
			errorMessage = "Game Code doesn't exist";
		});
	});

	function requestName(name: string) {
		errorMessage = '';
		socket.send(JSON.stringify({ Unassigned: { NameRequest: name } }));
	}

	function sendAnswer(index: number) {
		socket.send(JSON.stringify({ Player: { IndexAnswer: index } }));
		last_answered = index;
		msg = {
			WaitingForOthers:
				msg && 'MultipleChoice' in msg && 'AnswersAnnouncement' in msg.MultipleChoice
					? {
							count: msg.MultipleChoice.AnswersAnnouncement.count,
							index: msg.MultipleChoice.AnswersAnnouncement.index
					  }
					: {
							count: undefined,
							index: undefined
					  }
		};
	}

	function sendVote(index: number) {
		socket.send(JSON.stringify({ Player: { IndexAnswer: index } }));
	}
</script>

{#if status === 'loading'}
	<Loading />
{:else if status === 'error'}
	<ErrorPage {errorMessage} />
{:else if loading}
	<Loading />
{:else if name === undefined}
	<ChooseName bind:this={nameChooser} on:setName={(x) => requestName(x.detail)} {errorMessage} />
{:else if msg !== undefined}
	{#if 'WaitingForOthers' in msg}
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
	{:else if 'Bingo' in msg}
		{#if 'List' in msg.Bingo}
			<Bingo
				{name}
				{score}
				crossed={msg.Bingo.List.crossed}
				all_statements={msg.Bingo.List.all_statements}
				user_votes={msg.Bingo.List.user_votes}
				assigned_statements={msg.Bingo.List.assigned_statement}
				on:index={(e) => sendVote(e.detail)}
			/>
		{:else if 'Leaderboard' in msg.Bingo}
			<Winners
				{score}
				{name}
				winners={msg.Bingo.Leaderboard.winners}
				is_winner={msg.Bingo.Leaderboard.winners.includes(name)}
			/>
		{/if}
	{/if}
{/if}
