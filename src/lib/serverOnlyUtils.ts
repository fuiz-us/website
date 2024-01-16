import { bring } from './util';
import { PUBLIC_CORKBOARD_URL } from '$env/static/public';
import type { IdlessFuizConfig, PublishedFuiz, PublishedFuizDB } from './types';
import type { AvailableLanguageTag } from '$paraglide/runtime';

export function dataURIToBlob(dataURI: string): Blob {
	const [info, data] = dataURI.split(',');

	const mimeString = info.split(';')[0].split(':')[1];

	return new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))], {
		type: mimeString
	});
}

export async function getThumbnail(
	fuiz: IdlessFuizConfig
): Promise<{ thumbnail: ArrayBuffer; alt: string } | undefined> {
	return await fuiz.slides.reduce<Promise<{ thumbnail: ArrayBuffer; alt: string } | undefined>>(
		async (m, s) => {
			const prev = await m;
			if (prev) return prev;
			const media = s.MultipleChoice.media;
			if (!media) return undefined;
			if ('Corkboard' in media.Image) {
				const thumbnail = await bring(
					PUBLIC_CORKBOARD_URL + '/thumbnail/' + media.Image.Corkboard.id,
					{
						method: 'GET'
					}
				);

				if (!thumbnail) return undefined;

				return { thumbnail: await thumbnail.arrayBuffer(), alt: media.Image.Corkboard.alt };
			} else if ('Base64' in media.Image) {
				const blob = dataURIToBlob(media.Image.Base64.data);

				const form_data = new FormData();

				form_data.append('image', blob);

				const res = await bring(PUBLIC_CORKBOARD_URL + '/upload', {
					method: 'POST',
					body: form_data
				});

				const id = await res?.json();

				if (!id) return undefined;

				const thumbnail = await bring(PUBLIC_CORKBOARD_URL + '/thumbnail/' + id, {
					method: 'GET'
				});

				if (!thumbnail?.ok) {
					return undefined;
				}

				return { thumbnail: await thumbnail.arrayBuffer(), alt: media.Image.Base64.alt };
			} else {
				return undefined;
			}
		},
		(async () => undefined)()
	);
}

export function encodeAsDataURL(array: ArrayBuffer): string {
	let binary = '';
	for (const byte of new Uint8Array(array)) {
		binary += String.fromCharCode(byte);
	}
	return 'data:image/png;base64,' + btoa(binary);
}

export function fixPublish(p: PublishedFuizDB): PublishedFuiz {
	return {
		...p,
		thumbnail: p.thumbnail ? encodeAsDataURL(p.thumbnail) : null,
		tags: p.tags.split(' ~ '),
		published: new Date(p.published),
		last_updated: new Date(p.last_updated),
		language: p.language as AvailableLanguageTag
	};
}
