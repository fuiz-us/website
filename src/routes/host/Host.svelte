<script lang="ts">
	import { onMount } from 'svelte';
	import Waiting from './Waiting.svelte';
	import Question from './Question.svelte';
	import QuestionAnswers from './QuestionAnswers.svelte';
	import QuestionStatistics from './QuestionStatistics.svelte';
	import { zip, bring, type Media, type TextOrMedia, type AnswerResult } from '$lib';
	import Leaderboard from './Leaderboard.svelte';
	import Loading from '$lib/Loading.svelte';
	import { PUBLIC_BACKEND_URL, PUBLIC_WS_URL } from '$env/static/public';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Bingo from './Bingo.svelte';
	import Winners from './Winners.svelte';

	type GameState = {
		WaitingScreen: {
			exact_count: number;
			players: string[];
			truncated: boolean;
		};
	};

	type SlideState =
		| {
				MultipleChoice: 'QuestionAnnouncment' | 'AnswersAnnouncement' | 'AnswersResults';

				question?: string;
				media?: Media;
				answers?: TextOrMedia[];
				answered_count?: number;
				results?: AnswerResult[];
		  }
		| {
				Bingo: 'List' | 'Winners';

				all_statements?: {
					id: number;
					text: string;
				}[];
				crossed?: number[];
				user_votes?: number[];

				winners?: string[];
		  }
		| {
				Leaderboard: {
					exact_count: number;
					points: [string, number][];
				};
		  };

	type State =
		| {
				Game: GameState;
		  }
		| {
				index: number;
				count: number;
				Slide: SlideState;
		  }
		| {
				Error: string;
		  };

	type GameIncomingMessage =
		| {
				WaitingScreen: {
					exact_count: number;
					players: string[];
					truncated: boolean;
				};
		  }
		| {
				Leaderboard: {
					index?: number;
					count?: number;
					leaderboard: {
						exact_count: number;
						points: [string, number][];
					};
				};
		  };

	type MultipleChoiceIncomingMessage =
		| {
				QuestionAnnouncment: {
					index: number;
					count: number;
					question: string;
					media?: Media;
					duration: number;
				};
		  }
		| {
				AnswersAnnouncement: {
					index?: number;
					count?: number;
					question?: string;
					media?: Media;
					answers: Array<TextOrMedia>;
					answered_count?: number;
					duration: number;
				};
		  }
		| {
				AnswersCount: number;
		  }
		| {
				AnswersResults: {
					index?: number;
					count?: number;
					question?: string;
					media?: Media;
					answers?: Array<TextOrMedia>;
					results: Array<AnswerResult>;
				};
		  };

	type BingoIncomingMessage =
		| {
				List: {
					index: number;
					count: number;
					all_statements: {
						id: number;
						text: string;
					}[];
					assigned_statement: number[];
					crossed: number[];
					user_votes: number[];
				};
		  }
		| {
				Cross: {
					crossed: number[];
				};
		  }
		| {
				Votes: {
					user_votes: number[];
				};
		  }
		| {
				Winners: {
					index?: number;
					count?: number;
					winners: string[];
				};
		  };

	type IncomingMessage =
		| {
				Game: GameIncomingMessage;
		  }
		| {
				MultipleChoice: MultipleChoiceIncomingMessage;
		  }
		| {
				Bingo: BingoIncomingMessage;
		  };

	let current_state: State | undefined = undefined;

	let socket: WebSocket;

	let volume_on = true;

	let timer = 0;

	const UPDATE_DURATION = 100;

	setInterval(() => {
		timer = Math.max(0, timer - UPDATE_DURATION);
	}, UPDATE_DURATION);

	export let code: string;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WS_URL + '/watch/' + code);

		// Listen for messages
		socket.addEventListener('message', (event) => {
			let new_msg: IncomingMessage = JSON.parse(event.data);

			if ('Game' in new_msg) {
				if ('WaitingScreen' in new_msg.Game) {
					current_state = {
						Game: {
							WaitingScreen: new_msg.Game.WaitingScreen
						}
					};
				} else if ('Leaderboard' in new_msg.Game) {
					let { index: previous_index = 0, count: previous_count = 1 } =
						current_state && 'Slide' in current_state ? current_state : {};

					current_state = {
						index: new_msg.Game.Leaderboard.index || previous_index,
						count: new_msg.Game.Leaderboard.count || previous_count,
						Slide: {
							Leaderboard: new_msg.Game.Leaderboard.leaderboard
						}
					};
				}
			} else if ('MultipleChoice' in new_msg) {
				let mc = new_msg.MultipleChoice;

				let previous_state =
					current_state && 'Slide' in current_state && 'MultipleChoice' in current_state.Slide
						? current_state.Slide
						: undefined;

				let { index: previous_index = 0, count: previous_count = 1 } =
					current_state && 'Slide' in current_state ? current_state : {};

				if ('QuestionAnnouncment' in mc) {
					let { index, count, question, media, duration } = mc.QuestionAnnouncment;
					current_state = {
						index,
						count,
						Slide: {
							MultipleChoice: 'QuestionAnnouncment',
							question,
							media
						}
					};
					timer = duration;
				} else if ('AnswersAnnouncement' in mc) {
					let {
						index = previous_index,
						count = previous_count,
						question = previous_state?.question,
						media = previous_state?.media,
						duration,
						answers,
						answered_count
					} = mc.AnswersAnnouncement;
					current_state = {
						index,
						count,
						Slide: {
							MultipleChoice: 'AnswersAnnouncement',
							question,
							media,
							answers,
							answered_count
						}
					};
					timer = duration;
				} else if ('AnswersCount' in mc) {
					current_state = {
						...(current_state || { index: previous_index, count: previous_count }),
						Slide: {
							...previous_state,
							MultipleChoice: 'AnswersAnnouncement',
							answered_count: mc.AnswersCount
						}
					};
				} else if ('AnswersResults' in mc) {
					let {
						index = previous_index,
						count = previous_count,
						question = previous_state?.question,
						media = previous_state?.media,
						answers = previous_state?.answers,
						results
					} = mc.AnswersResults;
					current_state = {
						index,
						count,
						Slide: {
							MultipleChoice: 'AnswersResults',
							question,
							media,
							answers,
							results
						}
					};
				}
			} else if ('Bingo' in new_msg) {
				let bingo = new_msg.Bingo;

				let previous_state =
					current_state && 'Slide' in current_state && 'Bingo' in current_state.Slide
						? current_state.Slide
						: undefined;

				let { index: previous_index = 0, count: previous_count = 1 } =
					current_state && 'Slide' in current_state ? current_state : {};

				if ('List' in bingo) {
					let {
						index = previous_index,
						count = previous_count,
						all_statements,
						crossed,
						user_votes
					} = bingo.List;
					current_state = {
						index,
						count,
						Slide: {
							Bingo: 'List',
							all_statements,
							crossed,
							user_votes
						}
					};
				} else if ('Cross' in bingo) {
					let { crossed } = bingo.Cross;
					current_state = {
						...(current_state || { index: previous_index, count: previous_count }),
						Slide: {
							...previous_state,
							Bingo: 'List',
							crossed
						}
					};
				} else if ('Votes' in bingo) {
					let { user_votes } = bingo.Votes;
					current_state = {
						...(current_state || { index: previous_index, count: previous_count }),
						Slide: {
							...previous_state,
							Bingo: 'List',
							user_votes
						}
					};
				} else if ('Winners' in bingo) {
					let { index = previous_index, count = previous_count, winners } = bingo.Winners;
					current_state = {
						index,
						count,
						Slide: {
							Bingo: 'Winners',
							winners
						}
					};
				}
			}
		});

		socket.addEventListener('close', async () => {
			if (!(current_state && 'Error' in current_state)) {
				const res = await bring(PUBLIC_BACKEND_URL + '/alive/' + code, {
					method: 'GET',
					mode: 'cors'
				});
				if (res === undefined) {
					current_state = {
						Error: 'Connection Closed'
					};
				} else {
					let text = await res.text();
					if (text === 'true') {
						location.reload();
					} else {
						current_state = {
							Error: 'Game Ended'
						};
					}
				}
			}
		});

		socket.addEventListener('error', () => {
			current_state = {
				Error: "Game Code Doesn't Exist"
			};
		});
	});

	function next() {
		socket.send(HOST_NEXT);
	}

	function sendIndex(u: number) {
		socket.send(JSON.stringify({ Host: { Index: u } }));
	}

	const HOST_NEXT = JSON.stringify({ Host: 'Next' });
</script>

{#if current_state === undefined}
	<Loading />
{:else if 'Error' in current_state}
	<ErrorPage errorMessage={current_state.Error} />
{:else if 'Game' in current_state}
	<Waiting
		on:next={next}
		{code}
		players={current_state.Game.WaitingScreen.players}
		exact_count={current_state.Game.WaitingScreen.exact_count}
		truncated={current_state.Game.WaitingScreen.truncated}
		bind:volume_on
	/>
{:else if 'Slide' in current_state}
	{#if 'Leaderboard' in current_state.Slide}
		<Leaderboard
			on:next={next}
			gameId={code}
			questionIndex={current_state.index}
			questionTotalCount={current_state.count}
			results={current_state.Slide.Leaderboard.points}
			final={current_state.index + 1 === current_state.count}
			bind:volume_on
		/>
	{:else if 'MultipleChoice' in current_state.Slide}
		{#if current_state.Slide.MultipleChoice === 'QuestionAnnouncment'}
			<Question
				on:next={next}
				questionIndex={current_state.index}
				questionTotalCount={current_state.count}
				gameId={code}
				questionText={current_state.Slide.question || ''}
				bind:volume_on
			/>
		{:else if current_state.Slide.MultipleChoice === 'AnswersAnnouncement'}
			<QuestionAnswers
				on:next={next}
				gameId={code}
				questionIndex={current_state.index}
				questionTotalCount={current_state.count}
				questionText={current_state.Slide.question || ''}
				answers={(current_state.Slide.answers || []).map((answer_content) => answer_content.Text)}
				timeLeft={timer}
				answeredCount={current_state.Slide.answered_count || 0}
				media={current_state.Slide.media}
				bind:volume_on
			/>
		{:else if current_state.Slide.MultipleChoice === 'AnswersResults'}
			<QuestionStatistics
				on:next={next}
				gameId={code}
				questionIndex={current_state.index}
				questionTotalCount={current_state.count}
				questionText={current_state.Slide.question || ''}
				answers={zip(current_state.Slide.answers || [], current_state.Slide.results || []).map(
					([answer_content, answer_result]) => ({
						text: answer_content.Text,
						count: answer_result.count,
						correct: answer_result.correct
					})
				)}
				bind:volume_on
			/>
		{/if}
	{:else if 'Bingo' in current_state}
		{#if current_state.Bingo === 'List'}
			<Bingo
				questionIndex={current_state.index}
				questionTotalCount={current_state.count}
				crossed={current_state.Slide.crossed || []}
				all_statements={current_state.Slide.all_statements || []}
				user_votes={current_state.Slide.user_votes || []}
				gameId={code}
				bind:volume_on
				on:index={(e) => sendIndex(e.detail)}
			/>
		{:else if current_state.Bingo === 'Winners'}
			<Winners
				questionIndex={current_state.index}
				questionTotalCount={current_state.count}
				winners={current_state.Slide.winners || []}
				gameId={code}
				on:next={next}
				bind:volume_on
			/>
		{/if}
	{/if}
{/if}
