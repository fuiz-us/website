import { bring } from './util';
import { PUBLIC_CORKBOARD_URL } from '$env/static/public';
import type { IdlessFuizConfig, PublishedFuiz, PublishedFuizDB } from './types';
import type { AvailableLanguageTag } from '$lib/paraglide/runtime.js';

export function dataURIToBlob(dataURI: string): Blob {
	const [info, data] = dataURI.split(',');

	const mimeString = info.split(';')[0].split(':')[1];

	return new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))], {
		type: mimeString
	});
}

export async function getThumbnail(
	fuiz: IdlessFuizConfig
): Promise<{ thumbnail: ArrayBuffer; thumbnailAlt: string } | undefined> {
	return await fuiz.slides.reduce<
		Promise<{ thumbnail: ArrayBuffer; thumbnailAlt: string } | undefined> | undefined
	>(async (m, s) => {
		const prev = await m;
		if (prev) return prev;
		const media = s.MultipleChoice.media;
		if (!media) return undefined;
		if ('Corkboard' in media.Image) {
			const image = await bring(PUBLIC_CORKBOARD_URL + '/get/' + media.Image.Corkboard.id, {
				method: 'GET'
			});

			if (!image?.ok) return undefined;

			const blob = await image.blob();

			const formData = new FormData();
			formData.append('image', blob);

			const thumbnail = await bring(PUBLIC_CORKBOARD_URL + '/thumbnail', {
				method: 'POST',
				body: formData
			});

			if (!thumbnail?.ok) return undefined;

			return { thumbnail: await thumbnail.arrayBuffer(), thumbnailAlt: media.Image.Corkboard.alt };
		} else if ('Base64' in media.Image) {
			const blob = dataURIToBlob(media.Image.Base64.data);

			const formData = new FormData();
			formData.append('image', blob);

			const thumbnail = await bring(PUBLIC_CORKBOARD_URL + '/thumbnail', {
				method: 'POST',
				body: formData
			});

			if (!thumbnail?.ok) return undefined;

			return { thumbnail: await thumbnail.arrayBuffer(), thumbnailAlt: media.Image.Base64.alt };
		} else {
			return undefined;
		}
	}, undefined);
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
		subjects: p.subjects.split(' ~ '),
		grades: p.grades.split(' ~ '),
		published_at: new Date(p.published_at),
		language: p.language_code as AvailableLanguageTag
	};
}
