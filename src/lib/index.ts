import * as m from '$lib/paraglide/messages.js';

import heart from '$lib/assets/cards-heart.svg';
import club from '$lib/assets/cards-club.svg';
import spade from '$lib/assets/cards-spade.svg';
import diamond from '$lib/assets/cards-diamond.svg';
import { PUBLIC_BACKEND_URL, PUBLIC_CORKBOARD_URL } from '$env/static/public';
import { goto } from '$app/navigation';
import { Section, stringify } from '@ltd/j-toml';
import { bring } from './util';
import {
	mapIdlessMedia,
	type FuizConfig,
	type FuizOptions,
	type GenericFuizConfig,
	type GenericIdlessFuizConfig,
	type IdlessFuizConfig,
	type Media,
	type OnlineFuiz
} from './types';
import JSZip from 'jszip';
import objectHash from 'object-hash';

export const buttonColors = [
	['hsl(358, 84%, 45%)', 'hsl(358, 84%, 35%)'],
	['hsl(213, 76%, 44%)', 'hsl(213, 76%, 34%)'],
	['hsl(152, 62%, 32%)', 'hsl(152, 63%, 22%)'],
	['hsl(25, 100%, 43%)', 'hsl(25, 100%, 33%)']
] as const;

export const medalColors = ['#FEDD1E', '#D0D0D0', '#D7995A'] as const;

export const buttonSymbols = [
	[heart, m.heart()],
	[diamond, m.diamond()],
	[spade, m.spade()],
	[club, m.club()]
] as const;

// must be a subset of https://gitlab.com/opencode-mit/fuiz/game/-/raw/main/config.toml
export const limits = {
	fuiz: {
		maxSlidesCount: 100,
		maxTitleLength: 200,
		maxPlayerCount: 1000,
		multipleChoice: {
			maxTitleLength: 200,
			introduceQuestion: 5000,
			allowedIntroduceQuestion: [0, 3000, 5000, 7000, 10000, 15000],
			pointsAwarded: 1000,
			allowedPointsAwarded: [0, 500, 1000, 2000],
			allowedTimeLimits: [10000, 20000, 30000, 60000, 120000, 240000],
			defaultTimeLimit: 30000,
			maxAnswerCount: 8
		},
		typeAnswer: {
			maxTitleLength: 200,
			introduceQuestion: 5000,
			allowedIntroduceQuestion: [0, 3000, 5000, 7000, 10000, 15000],
			pointsAwarded: 1000,
			allowedPointsAwarded: [0, 500, 1000, 2000],
			allowedTimeLimits: [10000, 20000, 30000, 60000, 120000, 240000],
			defaultTimeLimit: 60000,
			maxAnswerCount: 16
		},
		order: {
			maxTitleLength: 200,
			introduceQuestion: 5000,
			allowedIntroduceQuestion: [0, 3000, 5000, 7000, 10000, 15000],
			pointsAwarded: 1000,
			allowedPointsAwarded: [0, 500, 1000, 2000],
			allowedTimeLimits: [10000, 20000, 30000, 60000, 120000, 240000],
			defaultTimeLimit: 60000,
			maxAnswerCount: 8
		},
		maxAnswerTextLength: 200
	}
} as const;

export async function getBackendMedia(media: Media | undefined | null): Promise<Media | undefined> {
	if (!media) {
		return undefined;
	}
	if ('Base64' in media.Image) {
		const { data, alt } = media.Image.Base64;

		const imageRes = await bring(data);
		if (!imageRes) return;

		const formData = new FormData();
		formData.append('image', await imageRes.blob());

		const res = await bring(PUBLIC_CORKBOARD_URL + '/upload', {
			method: 'POST',
			mode: 'cors',
			body: formData
		});

		const id = await res?.json();
		if (!id) return undefined;

		return {
			Image: {
				Corkboard: { id, alt }
			}
		};
	} else {
		return media;
	}
}

export function assertUnreachable(x: never): never {
	throw new Error("it's impossible to reach here");
}

export function tomlifyConfig(config: IdlessFuizConfig): IdlessFuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide) => {
			switch (true) {
				case 'MultipleChoice' in slide:
					return Section({
						MultipleChoice: Section(slide.MultipleChoice)
					});
				case 'TypeAnswer' in slide:
					return Section({
						TypeAnswer: Section(slide.TypeAnswer)
					});
				case 'Order' in slide:
					return Section({
						Order: Section(slide.Order)
					});
				default:
					return assertUnreachable(slide);
			}
		})
	};
}

export function stringifyToml(obj: IdlessFuizConfig | OnlineFuiz): string {
	return stringify(obj, { newline: '\n', newlineAround: 'section', integer: 1000000 });
}

export async function downloadFuiz(configJson: IdlessFuizConfig) {
	const [urlified, images] = await urlifyBase64(configJson);

	if (images.length > 0) {
		downloadBlob(
			[await createZip(stringifyToml(tomlifyConfig(urlified)), images)],
			configJson.title + '.zip'
		);
	} else {
		await downloadTomlString(stringifyToml(tomlifyConfig(urlified)), urlified.title);
	}
}

export async function urlifyBase64(
	config: IdlessFuizConfig
): Promise<[IdlessFuizConfig, { name: string; base64: string }[]]> {
	const mimetypes = new Map([
		['image/apng', 'apng'],
		['image/avif', 'avif'],
		['image/gif', 'gif'],
		['image/jpeg', 'jpg'],
		['image/png', 'png'],
		['image/svg+xml', 'svg'],
		['image/webp', 'webp']
	]);

	function getMimetype(base64string: string): string {
		return base64string.split(';')[0].split(':')[1];
	}

	const images: { name: string; base64: string }[] = [];

	function urlifyImage({ data, hash }: { data: string; hash?: string }): string {
		const name = (hash ?? objectHash(data)) + '.' + mimetypes.get(getMimetype(data));
		images.push({
			name,
			base64: data.split(',')[1]
		});
		return name;
	}

	const urlifiedConfig = {
		...config,
		slides: await Promise.all(
			config.slides.map(
				async (s) =>
					await mapIdlessMedia(s, async (media) => {
						if (media && 'Base64' in media.Image) {
							return {
								Image: {
									Url: {
										alt: media.Image.Base64.alt,
										url: urlifyImage(media.Image.Base64)
									}
								}
							};
						}
						return undefined;
					})
			)
		)
	};
	return [urlifiedConfig, images];
}

export async function createZip(fuizString: string, images: { name: string; base64: string }[]) {
	const archive = JSZip();
	archive.file('config.toml', fuizString);

	images.forEach(({ name, base64 }) => {
		archive.file(name, base64, { base64: true });
	});

	return await archive.generateAsync({ type: 'blob', compression: 'STORE' });
}

export function downloadTomlString(str: string, title: string) {
	downloadBlob([str], title + '.toml', { type: 'application/toml', endings: 'native' });
}

export function downloadBlob(blobs: BlobPart[], name: string, options?: FilePropertyBag) {
	const file = new File(blobs, name, options);
	const url = URL.createObjectURL(file);

	const link = document.createElement('a');
	link.style.display = 'none';
	link.href = url;
	link.download = file.name;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}

export function removeIds<T>(
	config: GenericIdlessFuizConfig<T> | GenericFuizConfig<T>
): GenericIdlessFuizConfig<T> {
	return {
		title: config.title,
		slides: config.slides.map((slide) => {
			switch (true) {
				case 'MultipleChoice' in slide:
					return {
						MultipleChoice: {
							...slide.MultipleChoice,
							answers: slide.MultipleChoice.answers.map(({ content, correct }) => ({
								content,
								correct
							}))
						}
					};
				case 'TypeAnswer' in slide:
					return {
						TypeAnswer: {
							...slide.TypeAnswer,
							answers: slide.TypeAnswer.answers.map((text) =>
								typeof text === 'string' ? text : text.text
							)
						}
					};
				case 'Order' in slide:
					return {
						Order: {
							...slide.Order,
							answers: slide.Order.answers.map((text) =>
								typeof text === 'string' ? text : text.text
							)
						}
					};
				default:
					return assertUnreachable(slide);
			}
		})
	};
}

export function addIds<T>(config: GenericIdlessFuizConfig<T>): GenericFuizConfig<T> {
	return {
		title: config.title,
		slides: config.slides.map((slide, id) => {
			switch (true) {
				case 'MultipleChoice' in slide:
					return {
						MultipleChoice: {
							...slide.MultipleChoice,
							answers: slide.MultipleChoice.answers.map(({ content, correct }, id) => ({
								content,
								correct,
								id
							}))
						},
						id
					};
				case 'TypeAnswer' in slide:
					return {
						TypeAnswer: {
							...slide.TypeAnswer,
							answers: slide.TypeAnswer.answers.map((text, id) => ({
								text,
								id
							}))
						},
						id
					};
				case 'Order' in slide:
					return {
						Order: {
							...slide.Order,
							answers: slide.Order.answers.map((text, id) => ({
								text,
								id
							}))
						},
						id
					};
				default:
					return assertUnreachable(slide);
			}
		})
	};
}

export async function getBackendConfig(config: IdlessFuizConfig): Promise<IdlessFuizConfig> {
	return {
		title: config.title,
		slides: await Promise.all(
			config.slides.map(
				async (slide) => await mapIdlessMedia(slide, async (media) => await getBackendMedia(media))
			)
		)
	};
}

export async function playJsonString(config: string): Promise<void | string> {
	const res = await bring(PUBLIC_BACKEND_URL + '/add', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: config
	});

	if (res === undefined) return 'Inaccessible Server';
	if (!res.ok) return await res.text();

	const { game_id, watcher_id } = await res.json();

	localStorage.setItem(game_id + '_host', watcher_id);

	await goto('host?code=' + game_id);
}

function fixTime(time: number): number {
	return time <= 1000 ? time * 1000 : time;
}

export function fixTimes(config: IdlessFuizConfig): IdlessFuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide) => {
			switch (true) {
				case 'MultipleChoice' in slide:
					return {
						MultipleChoice: {
							...slide.MultipleChoice,
							introduce_question: fixTime(slide.MultipleChoice.introduce_question),
							time_limit: fixTime(slide.MultipleChoice.time_limit)
						}
					};
				case 'TypeAnswer' in slide:
					return {
						TypeAnswer: {
							...slide.TypeAnswer,
							introduce_question: fixTime(slide.TypeAnswer.introduce_question),
							time_limit: fixTime(slide.TypeAnswer.time_limit)
						}
					};
				case 'Order' in slide:
					return {
						Order: {
							...slide.Order,
							introduce_question: fixTime(slide.Order.introduce_question),
							time_limit: fixTime(slide.Order.time_limit)
						}
					};
				default:
					return assertUnreachable(slide);
			}
		})
	};
}

export async function playIdlessConfig(
	config: IdlessFuizConfig,
	options: FuizOptions
): Promise<void | string> {
	try {
		const backendReadyConfig = await getBackendConfig(config);
		return await playJsonString(
			JSON.stringify({
				config: fixTimes(backendReadyConfig),
				options
			})
		);
	} catch (e) {
		return 'Failed to upload images';
	}
}

export async function playConfig(config: FuizConfig, options: FuizOptions): Promise<void | string> {
	return await playIdlessConfig(removeIds(config), options);
}
