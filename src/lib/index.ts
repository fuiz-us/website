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
import type { OnlineFuiz } from '../routes/[[lang]]/admin/+page';
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
			allowedTimeLimits: [5000, 15000, 30000, 60000, 120000, 240000],
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

export function tomlifyConfig(config: IdlessFuizConfig): IdlessFuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide) =>
			Section({
				MultipleChoice: Section(slide.MultipleChoice)
			})
		)
	};
}

export function stringifyToml(obj: IdlessFuizConfig | OnlineFuiz): string {
	return stringify(obj, { newline: '\n', newlineAround: 'section', integer: 1000000 });
}

export async function downloadFuiz(configJson: IdlessFuizConfig) {
	const [urlified, images] = urlifyBase64(configJson);

	if (images.length > 0) {
		downloadBlob(
			[await createZip(stringifyToml(tomlifyConfig(urlified)), images)],
			configJson.title + '.zip'
		);
	} else {
		await downloadTomlString(stringifyToml(tomlifyConfig(urlified)), urlified.title);
	}
}

export function urlifyBase64(
	config: IdlessFuizConfig
): [IdlessFuizConfig, { name: string; base64: string }[]] {
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
		slides: config.slides.map((s) => ({
			MultipleChoice: {
				...s.MultipleChoice,
				...(s.MultipleChoice.media &&
					'Base64' in s.MultipleChoice.media.Image && {
						media: {
							Image: {
								Url: {
									alt: s.MultipleChoice.media.Image.Base64.alt,
									url: urlifyImage(s.MultipleChoice.media.Image.Base64)
								}
							}
						}
					})
			}
		}))
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

export function removeIds(config: IdlessFuizConfig): IdlessFuizConfig {
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
