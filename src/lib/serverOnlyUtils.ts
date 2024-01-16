import { bring } from './util';
import { PUBLIC_CORKBOARD_URL } from '$env/static/public';
import type { IdlessFuizConfig } from './types';

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
						method: 'GET',
						mode: 'cors'
					}
				);

				if (!thumbnail) return undefined;

				return { thumbnail: await thumbnail.arrayBuffer(), alt: media.Image.Corkboard.alt };
			} else if ('Base64' in media.Image) {
				const blob = dataURIToBlob(media.Image.Base64.data);

				const form_data = new FormData();

				form_data.append('image', blob);

				console.log('got blob');

				const res = await bring(PUBLIC_CORKBOARD_URL + '/upload', {
					method: 'POST',
					mode: 'cors',
					body: form_data
				});

				console.log(await res?.text());

				return undefined;

				// const id = await res?.json();

				if (!id) return undefined;

				const thumbnail = await bring(PUBLIC_CORKBOARD_URL + '/thumbnail/' + id, {
					method: 'GET',
					mode: 'cors'
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
