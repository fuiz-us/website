<script lang="ts">
	import { bring, type AnswerResult, type TextOrMedia, type Media } from '$lib';
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

	type GameState =
		| {
				WaitingScreen: {
					exact_count: number;
				};
		  }
		| {
				NameChoose: {
					sending: boolean;
					error: string;
				};
		  };

	type SlideState =
		| {
				MultipleChoice: 'QuestionAnnouncment' | 'AnswersAnnouncement' | 'AnswersResults';

				question?: string;
				media?: Media;
				answers?: TextOrMedia[];
				results?: AnswerResult[];
				answered?: number;
		  }
		| {
				Bingo: 'List' | 'Winners';

				all_statements?: {
					id: number;
					text: string;
				}[];
				assigned_statement?: number[];
				crossed?: number[];
				user_votes?: number[];

				winners?: string[];
		  }
		| {
				Score: {
					points: number;
					position: number | undefined;
				};
		  };

	type State =
		| {
				Game: GameState;
		  }
		| {
				index: number;
				count: number;
				score: number;
				Slide: SlideState;
		  }
		| {
				Error: string;
		  };

	type NamesError = 'Used' | 'Assigned' | 'Empty' | 'Sinful' | 'TooLong';

	type GameIncomingMessage =
		| {
				WaitingScreen: {
					exact_count: number;
				};
		  }
		| {
				Score: {
					index?: number;
					count?: number;
					score?: {
						points: number;
						position: number;
					};
				};
		  }
		| 'NameChoose'
		| {
				NameAssign: string;
		  }
		| {
				NameError: NamesError;
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

	let setName: string | undefined = undefined;

	export let code: string;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WS_URL + '/watch/' + code);
		setName = undefined;

		// // Listen for messages
		socket.addEventListener('message', (event) => {
			let new_msg: IncomingMessage = JSON.parse(event.data);

			let {
				index: previous_index = 0,
				count: previous_count = 1,
				score: previous_score = 0
			} = current_state && 'Slide' in current_state ? current_state : {};

			if ('Game' in new_msg) {
				if (new_msg.Game === 'NameChoose') {
					current_state = {
						Game: {
							NameChoose: {
								sending: false,
								error: ''
							}
						}
					};
				} else if ('NameAssign' in new_msg.Game) {
					current_state = undefined;
					setName = new_msg.Game.NameAssign;
				} else if ('NameError' in new_msg.Game) {
					let errorMessage = '';
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
					current_state = {
						Game: {
							NameChoose: {
								sending: false,
								error: errorMessage
							}
						}
					};
				} else if ('Score' in new_msg.Game) {
					let {
						index = previous_index,
						count = previous_count,
						score: { points, position } = {
							points: previous_score,
							position: undefined
						}
					} = new_msg.Game.Score;

					current_state = {
						index,
						count,
						score: points,
						Slide: {
							Score: {
								points,
								position
							}
						}
					};
				} else if ('WaitingScreen' in new_msg.Game) {
					let { exact_count } = new_msg.Game.WaitingScreen;
					current_state = {
						Game: {
							WaitingScreen: {
								exact_count
							}
						}
					};
				}
			} else if ('MultipleChoice' in new_msg) {
				let mc = new_msg.MultipleChoice;

				let previous_state =
					current_state && 'Slide' in current_state && 'MultipleChoice' in current_state.Slide
						? current_state.Slide
						: undefined;

				if ('QuestionAnnouncment' in mc) {
					let { index, count, question, media } = mc.QuestionAnnouncment;
					current_state = {
						index,
						count,
						score: previous_score,
						Slide: {
							MultipleChoice: 'QuestionAnnouncment',
							question,
							media
						}
					};
				} else if ('AnswersAnnouncement' in mc) {
					let {
						index = previous_index,
						count = previous_count,
						question = previous_state?.question,
						media = previous_state?.media,
						answers
					} = mc.AnswersAnnouncement;
					current_state = {
						index,
						count,
						score: previous_score,
						Slide: {
							MultipleChoice: 'AnswersAnnouncement',
							question,
							media,
							answers
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
						score: previous_score,
						Slide: {
							MultipleChoice: 'AnswersResults',
							question,
							media,
							answers,
							results,
							answered: previous_state?.answered
						}
					};
				}
			} else if ('Bingo' in new_msg) {
				let bingo = new_msg.Bingo;

				let previous_state =
					current_state && 'Slide' in current_state && 'Bingo' in current_state.Slide
						? current_state.Slide
						: undefined;

				if ('List' in bingo) {
					let { index, count, all_statements, assigned_statement, crossed, user_votes } =
						bingo.List;
					current_state = {
						index,
						count,
						score: previous_score,
						Slide: {
							Bingo: 'List',
							all_statements,
							assigned_statement,
							crossed,
							user_votes
						}
					};
				} else if ('Winners' in bingo) {
					let { index = previous_index, count = previous_count, winners } = bingo.Winners;
					current_state = {
						index,
						count,
						score: previous_score,
						Slide: {
							Bingo: 'Winners',
							winners
						}
					};
				} else if ('Cross' in bingo) {
					let { crossed } = bingo.Cross;
					current_state = {
						index: previous_index,
						count: previous_count,
						score: previous_score,
						Slide: {
							...previous_state,
							Bingo: 'List',
							crossed
						}
					};
				} else if ('Votes' in bingo) {
					let { user_votes } = bingo.Votes;
					current_state = {
						index: previous_index,
						count: previous_count,
						score: previous_score,
						Slide: {
							...previous_state,
							Bingo: 'List',
							user_votes
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
				Error: "Game Code doesn't exist"
			};
		});
	});

	$: name = setName || 'You';

	function requestName(name: string) {
		current_state = {
			Game: {
				NameChoose: {
					sending: true,
					error: ''
				}
			}
		};
		socket.send(JSON.stringify({ Unassigned: { NameRequest: name } }));
	}

	function sendAnswer(index: number) {
		if (current_state && 'Slide' in current_state && 'MultipleChoice' in current_state.Slide) {
			current_state = {
				...current_state,
				Slide: {
					...current_state.Slide,
					answered: index
				}
			};
		}

		socket.send(JSON.stringify({ Player: { IndexAnswer: index } }));
	}

	function sendVote(index: number) {
		socket.send(JSON.stringify({ Player: { IndexAnswer: index } }));
	}
</script>

{#if current_state === undefined}
	<Loading />
{:else if 'Error' in current_state}
	<ErrorPage errorMessage={current_state.Error} />
{:else if 'Game' in current_state}
	{#if 'NameChoose' in current_state.Game}
		<ChooseName
			on:setName={(x) => requestName(x.detail)}
			sending={current_state.Game.NameChoose.sending}
			errorMessage={current_state.Game.NameChoose.error}
		/>
	{:else if 'WaitingScreen' in current_state.Game}
		<WaitingMobile {name} gameCode={code} />
	{/if}
{:else if 'Slide' in current_state}
	{#if 'MultipleChoice' in current_state.Slide}
		{#if current_state.Slide.MultipleChoice === 'QuestionAnnouncment'}
			<Question
				{name}
				score={current_state.score}
				questionText={current_state.Slide.question || ''}
			/>
		{:else if current_state.Slide.MultipleChoice === 'AnswersAnnouncement'}
			{#if current_state.Slide.answered === undefined}
				<Answers
					on:answer={(e) => sendAnswer(e.detail)}
					{name}
					score={current_state.score}
					answersCount={current_state.Slide.answers?.length || 0}
				/>
			{:else}
				<WaitingOthers {name} score={current_state.score} />
			{/if}
		{:else if current_state.Slide.MultipleChoice === 'AnswersResults'}
			<Result
				{name}
				score={current_state.score}
				correct={current_state.Slide.answered === undefined
					? false
					: current_state.Slide.results?.at(current_state.Slide.answered)?.correct || false}
			/>
		{/if}
	{:else if 'Score' in current_state.Slide}
		<Leaderboard
			{name}
			score={current_state.Slide.Score.points}
			position={current_state.Slide.Score.position}
			final={current_state.index + 1 === current_state.count}
		/>
	{:else if 'Bingo' in current_state.Slide}
		{#if current_state.Slide.Bingo === 'List'}
			<Bingo
				{name}
				score={current_state.score}
				crossed={current_state.Slide.crossed || []}
				all_statements={current_state.Slide.all_statements || []}
				user_votes={current_state.Slide.user_votes || []}
				assigned_statements={current_state.Slide.assigned_statement || []}
				on:index={(e) => sendVote(e.detail)}
			/>
		{:else if current_state.Slide.Bingo === 'Winners'}
			<Winners
				{name}
				score={current_state.score}
				winners={current_state.Slide.winners || []}
				is_winner={current_state.Slide.winners?.includes(name) || false}
			/>
		{/if}
	{/if}
{/if}
