<script lang="ts">
	import * as m from '$paraglide/messages';

	import Waiting from './Waiting.svelte';
	import Question from './Question.svelte';
	import QuestionAnswers from './QuestionAnswers.svelte';
	import QuestionStatistics from './QuestionStatistics.svelte';
	import {
		zip,
		bring,
		type Media,
		type TextOrMedia,
		type AnswerResult,
		type IdlessFuizConfig,
		type FuizOptions
	} from '$lib';
	import Leaderboard from './Leaderboard.svelte';
	import Loading from '$lib/Loading.svelte';
	import { PUBLIC_BACKEND_URL, PUBLIC_WS_URL } from '$env/static/public';
	import ErrorPage from '$lib/ErrorPage.svelte';
	import Bingo from './Bingo.svelte';
	import Winners from './Winners.svelte';
	import { browser } from '$app/environment';
	import type { BindableGameInfo, TruncatedList } from './+page';
	import Summary from './Summary.svelte';

	type GameState =
		| {
				WaitingScreen: TruncatedList<string>;
		  }
		| {
				Summary: {
					stats: [number, number][];
					player_count: number;
					config: IdlessFuizConfig;
					options: FuizOptions;
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
					current: TruncatedList<[string, number]>;
					prior: TruncatedList<[string, number]>;
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
				IdAssign: string;
		  }
		| {
				WaitingScreen: TruncatedList<string>;
		  }
		| {
				Leaderboard: {
					index?: number;
					count?: number;
					leaderboard: {
						current: TruncatedList<[string, number]>;
						prior: TruncatedList<[string, number]>;
					};
				};
		  }
		| {
				Metainfo: {
					Host: {
						locked: boolean;
					};
				};
		  }
		| {
				Summary: {
					Host: {
						stats: [number, number][];
						player_count: number;
						config: IdlessFuizConfig;
						options: FuizOptions;
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

	let timer = 0;
	let initialTimer = 0;

	const UPDATE_DURATION = 100;

	setInterval(() => {
		timer = Math.max(0, timer - UPDATE_DURATION);
	}, UPDATE_DURATION);

	export let code: string;

	let watcherId: string | undefined = undefined;

	let bindableGameInfo: BindableGameInfo = {
		volumeOn: true,
		locked: false
	};

	let finished = false;

	function connect_server(code: string) {
		socket = new WebSocket(PUBLIC_WS_URL + '/watch/' + code);
		currentState = undefined;
		bindableGameInfo = {
			volumeOn: bindableGameInfo.volumeOn,
			locked: false
		};
		finished = false;
		watcherId = localStorage.getItem(code + '_host') || undefined;

		// Listen for messages
		socket.addEventListener('message', (event) => {
			let new_msg: IncomingMessage = JSON.parse(event.data);

			if ('Game' in new_msg) {
				if ('WaitingScreen' in new_msg.Game) {
					currentState = {
						Game: {
							WaitingScreen: new_msg.Game.WaitingScreen
						}
					};
				} else if ('Leaderboard' in new_msg.Game) {
					let { index: previous_index = 0, count: previous_count = 1 } =
						currentState && 'Slide' in currentState ? currentState : {};

					currentState = {
						index: new_msg.Game.Leaderboard.index || previous_index,
						count: new_msg.Game.Leaderboard.count || previous_count,
						Slide: {
							Leaderboard: new_msg.Game.Leaderboard.leaderboard
						}
					};
				} else if ('IdAssign' in new_msg.Game) {
					watcherId = new_msg.Game.IdAssign;
					localStorage.setItem(code + '_host', watcherId);
				} else if ('Metainfo' in new_msg.Game) {
					bindableGameInfo.locked = new_msg.Game.Metainfo.Host.locked;
				} else if ('Summary' in new_msg.Game) {
					currentState = {
						Game: {
							Summary: new_msg.Game.Summary.Host
						}
					};
					finished = true;
					socket.close();
				}
			} else if ('MultipleChoice' in new_msg) {
				let mc = new_msg.MultipleChoice;

				let previous_state =
					currentState && 'Slide' in currentState && 'MultipleChoice' in currentState.Slide
						? currentState.Slide
						: undefined;

				let { index: previous_index = 0, count: previous_count = 1 } =
					currentState && 'Slide' in currentState ? currentState : {};

				if ('QuestionAnnouncment' in mc) {
					let { index, count, question, media, duration } = mc.QuestionAnnouncment;
					currentState = {
						index,
						count,
						Slide: {
							MultipleChoice: 'QuestionAnnouncment',
							question,
							media
						}
					};
					timer = duration;
					initialTimer = duration;
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
					currentState = {
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
					initialTimer = duration;
				} else if ('AnswersCount' in mc) {
					currentState = {
						...(currentState || { index: previous_index, count: previous_count }),
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
					currentState = {
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
					currentState && 'Slide' in currentState && 'Bingo' in currentState.Slide
						? currentState.Slide
						: undefined;

				let { index: previous_index = 0, count: previous_count = 1 } =
					currentState && 'Slide' in currentState ? currentState : {};

				if ('List' in bingo) {
					let {
						index = previous_index,
						count = previous_count,
						all_statements,
						crossed,
						user_votes
					} = bingo.List;
					currentState = {
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
					currentState = {
						...(currentState || { index: previous_index, count: previous_count }),
						Slide: {
							...previous_state,
							Bingo: 'List',
							crossed
						}
					};
				} else if ('Votes' in bingo) {
					let { user_votes } = bingo.Votes;
					currentState = {
						...(currentState || { index: previous_index, count: previous_count }),
						Slide: {
							...previous_state,
							Bingo: 'List',
							user_votes
						}
					};
				} else if ('Winners' in bingo) {
					let { index = previous_index, count = previous_count, winners } = bingo.Winners;
					currentState = {
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
			if (!(currentState && 'Error' in currentState) && !finished) {
				const res = await bring(PUBLIC_BACKEND_URL + '/alive/' + code, {
					method: 'GET',
					mode: 'cors'
				});
				if (res === undefined) {
					currentState = {
						Error: m.connection_closed()
					};
				} else {
					let text = await res.text();
					if (text === 'true') {
						location.reload();
					} else {
						currentState = {
							Error: m.game_ended()
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
				Error: m.code_not_exist()
			};
		});
	}

	$: browser && connect_server(code);

	function next() {
		socket.send(HOST_NEXT);
	}

	function sendIndex(u: number) {
		socket.send(JSON.stringify({ Host: { Index: u } }));
	}

	function receiveLock(e: CustomEvent<boolean>) {
		socket.send(JSON.stringify({ Host: { Lock: e.detail } }));
	}

	const HOST_NEXT = JSON.stringify({ Host: 'Next' });
</script>

{#if currentState === undefined}
	<Loading />
{:else if 'Error' in currentState}
	<ErrorPage errorMessage={currentState.Error} />
{:else if 'Game' in currentState}
	{#if 'WaitingScreen' in currentState.Game}
		<Waiting
			on:next={next}
			{code}
			players={currentState.Game.WaitingScreen.items}
			exact_count={currentState.Game.WaitingScreen.exact_count}
			bind:bindableGameInfo
			on:lock={receiveLock}
		/>
	{:else if 'Summary' in currentState.Game}
		{@const { stats, player_count, config, options } = currentState.Game.Summary}
		<Summary {stats} {player_count} {config} {options} />
	{/if}
{:else if 'Slide' in currentState}
	{@const { Slide: slide, index, count } = currentState}
	{@const gameInfo = {
		gameCode: code,
		questionIndex: index,
		questionTotalCount: count
	}}
	{#if 'Leaderboard' in slide}
		<Leaderboard
			on:next={next}
			on:lock={receiveLock}
			bind:bindableGameInfo
			{gameInfo}
			current={slide.Leaderboard.current}
			prior={slide.Leaderboard.prior}
			final={index + 1 === count}
		/>
	{:else if 'MultipleChoice' in slide}
		{@const {
			MultipleChoice: kind,
			question,
			media,
			answers,
			answered_count: answeredCount,
			results
		} = slide}
		{#if kind === 'QuestionAnnouncment'}
			<Question
				on:next={next}
				on:lock={receiveLock}
				bind:bindableGameInfo
				{media}
				{gameInfo}
				timeStarted={initialTimer}
				questionText={question || ''}
			/>
		{:else if kind === 'AnswersAnnouncement'}
			<QuestionAnswers
				on:next={next}
				on:lock={receiveLock}
				bind:bindableGameInfo
				{gameInfo}
				questionText={question || ''}
				answers={(answers || []).map((answerContent) => answerContent.Text)}
				timeLeft={timer}
				timeStarted={initialTimer}
				answeredCount={answeredCount || 0}
				{media}
			/>
		{:else if kind === 'AnswersResults'}
			<QuestionStatistics
				on:next={next}
				on:lock={receiveLock}
				bind:bindableGameInfo
				{gameInfo}
				questionText={question || ''}
				answers={zip(answers || [], results || []).map(([answerContent, answerResult]) => ({
					text: answerContent.Text,
					count: answerResult.count,
					correct: answerResult.correct
				}))}
			/>
		{/if}
	{:else if 'Bingo' in slide}
		{@const { all_statements: allStatements, crossed, user_votes: userVotes, winners } = slide}
		{#if slide.Bingo === 'List'}
			<Bingo
				on:lock={receiveLock}
				bind:bindableGameInfo
				{gameInfo}
				crossed={crossed || []}
				allStatements={allStatements || []}
				userVotes={userVotes || []}
				on:index={(e) => sendIndex(e.detail)}
			/>
		{:else if slide.Bingo === 'Winners'}
			<Winners
				on:lock={receiveLock}
				bind:bindableGameInfo
				{gameInfo}
				winners={winners || []}
				on:next={next}
			/>
		{/if}
	{/if}
{/if}
