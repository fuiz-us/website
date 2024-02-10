import * as m from '$paraglide/messages';

import heart from '$lib/assets/cards-heart.svg';
import club from '$lib/assets/cards-club.svg';
import spade from '$lib/assets/cards-spade.svg';
import diamond from '$lib/assets/cards-diamond.svg';
import { PUBLIC_BACKEND_URL, PUBLIC_CORKBOARD_URL } from '$env/static/public';
import { goto } from '$app/navigation';
import { Section, stringify } from '@ltd/j-toml';
import { bring } from './util';
import type { FuizConfig, FuizOptions, IdlessFuizConfig, Media } from './types';

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

// must be a subset of https://gitlab.com/opencode-mit/fuiz/-/raw/main/config.toml
export const limits = {
	fuiz: {
		maxSlidesCount: 100,
		maxTitleLength: 100,
		maxPlayerCount: 1000,
		multipleChoice: {
			maxTitleLength: 100,
			introduceQuestion: 3000,
			pointsAwarded: 1000,
			allowedTimeLimits: [5000, 10000, 30000, 60000, 120000, 240000],
			defaultTimeLimit: 30000,
			maxAnswerCount: 8
		},
		maxAnswerTextLength: 100
	}
} as const;

export async function getBackendMedia(media: Media | undefined | null): Promise<Media | undefined> {
	if (!media) {
		return undefined;
	}
	if ('Base64' in media.Image) {
		const image_res = await bring(media.Image.Base64.data);

		if (image_res === undefined) {
			return undefined;
		}

		const blob = await image_res.blob();

		const form_data = new FormData();

		form_data.append('image', blob);

		const res = await bring(PUBLIC_CORKBOARD_URL + '/upload', {
			method: 'POST',
			mode: 'cors',
			body: form_data
		});

		const v = await res?.json();

		if (v === undefined) {
			return undefined;
		}

		return {
			Image: {
				Corkboard: {
					id: v,
					alt: media.Image.Base64.alt
				}
			}
		};
	} else {
		return media;
	}
}

export function tomlifyConfig(config: IdlessFuizConfig) {
	return {
		title: config.title,
		slides: config.slides.map((slide) =>
			Section({
				MultipleChoice: Section(slide.MultipleChoice)
			})
		)
	};
}

/* eslint-disable */
export function stringifyToml(obj: any): string {
	return stringify(obj, { newline: '\n', newlineAround: 'section', integer: 1000000 });
}

export function downloadTomlString(str: string, title: string) {
	const file = new File([str], title + '.toml', { type: 'application/toml', endings: 'native' });
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

export function removeIds(config: FuizConfig): IdlessFuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide) => ({
			MultipleChoice: {
				title: slide.MultipleChoice.title,
				points_awarded: slide.MultipleChoice.points_awarded,
				...(slide.MultipleChoice.media && { media: slide.MultipleChoice.media }),
				introduce_question: slide.MultipleChoice.introduce_question,
				time_limit: slide.MultipleChoice.time_limit,
				answers: slide.MultipleChoice.answers.map(({ content, correct }) => ({
					content,
					correct
				}))
			}
		}))
	};
}

export function addIds(config: IdlessFuizConfig): FuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide, id) => ({
			MultipleChoice: {
				...slide.MultipleChoice,
				answers: slide.MultipleChoice.answers.map(({ content, correct }, id) => ({
					content,
					correct,
					id
				}))
			},
			id
		}))
	};
}

export async function getBackendConfig(config: IdlessFuizConfig): Promise<IdlessFuizConfig> {
	return {
		title: config.title,
		slides: await Promise.all(
			config.slides.map(async (slide) => ({
				MultipleChoice: {
					...slide.MultipleChoice,
					media: await getBackendMedia(slide.MultipleChoice.media)
				}
			}))
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

	if (res === undefined) {
		return 'Inaccessible Server';
	}

	if (!res.ok) {
		return await res.text();
	}

	const { game_id, watcher_id } = await res.json();

	localStorage.setItem(game_id + '_host', watcher_id);

	await goto('host?code=' + game_id);
}

function fixTime(time: number): number {
	return time <= 1000 ? time * 1000 : time;
}

function fixTimes(config: IdlessFuizConfig): IdlessFuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide) => ({
			MultipleChoice: {
				...slide.MultipleChoice,
				introduce_question: fixTime(slide.MultipleChoice.introduce_question),
				time_limit: fixTime(slide.MultipleChoice.time_limit)
			}
		}))
	};
}

export async function playIdlessConfig(
	config: IdlessFuizConfig,
	options: FuizOptions
): Promise<void | string> {
	return await playJsonString(
		JSON.stringify({
			config: fixTimes(await getBackendConfig(config)),
			options
		})
	);
}

export async function playConfig(config: FuizConfig, options: FuizOptions): Promise<void | string> {
	return await playIdlessConfig(await getBackendConfig(removeIds(config)), options);
}
