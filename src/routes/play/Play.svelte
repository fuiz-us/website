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
	import { browser } from '$app/environment';

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
				assigned_statements?: number[];
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
		| { IdAssign: string }
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
		  }
		| {
				Metainfo: {
					score: number;
					show_answers: boolean;
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
					assigned_statements: number[];
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

	let currentState: State | undefined = undefined;

	let socket: WebSocket;

	let setName: string | undefined = undefined;

	let points: number | undefined = undefined;

	export let code: string;

	let showAnswers = false;

	let watcherId = (browser && localStorage.getItem(code + '_play')) || undefined;

	onMount(() => {
		socket = new WebSocket(PUBLIC_WS_URL + '/watch/' + code);
		setName = undefined;

		// // Listen for messages
		socket.addEventListener('message', (event) => {
			let new_msg: IncomingMessage = JSON.parse(event.data);

			let {
				index: previous_index = 0,
				count: previous_count = 1,
				score: previous_score = points || 0
			} = currentState && 'Slide' in currentState ? currentState : {};

			if ('Game' in new_msg) {
				if (new_msg.Game === 'NameChoose') {
					currentState = {
						Game: {
							NameChoose: {
								sending: false,
								error: ''
							}
						}
					};
				} else if ('NameAssign' in new_msg.Game) {
					currentState = undefined;
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
					currentState = {
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

					currentState = {
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
					currentState = {
						Game: {
							WaitingScreen: {
								exact_count
							}
						}
					};
				} else if ('IdAssign' in new_msg.Game) {
					watcherId = new_msg.Game.IdAssign;
					localStorage.setItem(code + '_play', watcherId);
				} else if ('Metainfo' in new_msg.Game) {
					let { score, show_answers } = new_msg.Game.Metainfo;
					points = score;
					showAnswers = show_answers;
				}
			} else if ('MultipleChoice' in new_msg) {
				let mc = new_msg.MultipleChoice;

				let previous_state =
					currentState && 'Slide' in currentState && 'MultipleChoice' in currentState.Slide
						? currentState.Slide
						: undefined;

				if ('QuestionAnnouncment' in mc) {
					let { index, count, question, media } = mc.QuestionAnnouncment;
					currentState = {
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
					currentState = {
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
					currentState = {
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
					currentState && 'Slide' in currentState && 'Bingo' in currentState.Slide
						? currentState.Slide
						: undefined;

				if ('List' in bingo) {
					let { index, count, all_statements, assigned_statements, crossed, user_votes } =
						bingo.List;
					currentState = {
						index,
						count,
						score: previous_score,
						Slide: {
							Bingo: 'List',
							all_statements,
							assigned_statements,
							crossed,
							user_votes
						}
					};
				} else if ('Winners' in bingo) {
					let { index = previous_index, count = previous_count, winners } = bingo.Winners;
					currentState = {
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
					currentState = {
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
					currentState = {
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
			if (!(currentState && 'Error' in currentState)) {
				const res = await bring(PUBLIC_BACKEND_URL + '/alive/' + code, {
					method: 'GET',
					mode: 'cors'
				});
				if (res === undefined) {
					currentState = {
						Error: 'Connection Closed'
					};
				} else {
					let text = await res.text();
					if (text === 'true') {
						location.reload();
					} else {
						currentState = {
							Error: 'Game Ended'
						};
					}
				}
			}
		});

		socket.addEventListener('open', () => {
			if (watcherId === undefined) {
				socket.send(JSON.stringify({ Ghost: 'DemandId' }));
			} else {
				socket.send(JSON.stringify({ Ghost: { ClaimId: watcherId } }));
			}
		});

		socket.addEventListener('error', () => {
			currentState = {
				Error: "Game Code doesn't exist"
			};
		});
	});

	$: name = setName || 'You';

	function requestName(name: string) {
		currentState = {
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
		if (currentState && 'Slide' in currentState && 'MultipleChoice' in currentState.Slide) {
			currentState = {
				...currentState,
				Slide: {
					...currentState.Slide,
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

{#if currentState === undefined}
	<Loading />
{:else if 'Error' in currentState}
	<ErrorPage errorMessage={currentState.Error} />
{:else if 'Game' in currentState}
	{@const game = currentState.Game}
	{#if 'NameChoose' in game}
		{@const { sending, error: errorMessage } = game.NameChoose}
		<ChooseName on:setName={(x) => requestName(x.detail)} {sending} {errorMessage} />
	{:else if 'WaitingScreen' in game}
		<WaitingMobile {name} gameCode={code} />
	{/if}
{:else if 'Slide' in currentState}
	{@const { Slide: slide, index, count, score } = currentState}
	{#if 'MultipleChoice' in slide}
		{@const { MultipleChoice: kind, question, answers, results, answered } = slide}
		{#if kind === 'QuestionAnnouncment'}
			<Question {name} {score} questionText={question || ''} />
		{:else if kind === 'AnswersAnnouncement'}
			{#if answered === undefined}
				<Answers
					on:answer={(e) => sendAnswer(e.detail)}
					questionText={question || ''}
					{name}
					{score}
					{showAnswers}
					answers={answers || []}
				/>
			{:else}
				<WaitingOthers {name} {score} />
			{/if}
		{:else if kind === 'AnswersResults'}
			<Result
				{name}
				{score}
				correct={answered === undefined ? false : results?.at(answered)?.correct || false}
			/>
		{/if}
	{:else if 'Score' in slide}
		{@const { points, position } = slide.Score}
		<Leaderboard {name} score={points} {position} final={index + 1 === count} />
	{:else if 'Bingo' in slide}
		{@const {
			Bingo: kind,
			all_statements: allStatements,
			assigned_statements: assignedStatements,
			crossed,
			user_votes: userVotes,
			winners
		} = slide}
		{#if kind === 'List'}
			<Bingo
				{name}
				{score}
				crossed={crossed || []}
				allStatements={allStatements || []}
				userVotes={userVotes || []}
				assignedStatements={assignedStatements || []}
				on:index={(e) => sendVote(e.detail)}
			/>
		{:else if kind === 'Winners'}
			<Winners {name} {score} winners={winners || []} isWinner={winners?.includes(name) || false} />
		{/if}
	{/if}
{/if}
