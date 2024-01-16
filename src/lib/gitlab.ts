import { env } from '$env/dynamic/private';
import { PUBLIC_CORKBOARD_URL } from '$env/static/public';
import type { IdlessFuizConfig } from './types';
import { bring, dataURIToBlob } from './util';

export async function createFileInGit(file_path: string, file_content: string): Promise<string> {
	await fetch(
		`https://gitlab.com/api/v4/projects/${
			env.GITLAB_PROJECT_ID
		}/repository/files/${encodeURIComponent(file_path)}`,
		{
			method: 'POST',
			headers: {
				'PRIVATE-TOKEN': env.GITLAB_PERSONAL_API,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				branch: 'main',
				content: file_content,
				commit_message: `add ${file_path}`
			})
		}
	);

	return `${env.GITLAB_PUBLIC_LINK}/-/raw/main/${file_path}`;
}

export async function updateFileInGit(file_path: string, file_content: string) {
	await fetch(
		`https://gitlab.com/api/v4/projects/${
			env.GITLAB_PROJECT_ID
		}/repository/files/${encodeURIComponent(file_path)}`,
		{
			method: 'PUT',
			headers: {
				'PRIVATE-TOKEN': env.GITLAB_PERSONAL_API,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				branch: 'main',
				content: file_content,
				commit_message: `update ${file_path}`
			})
		}
	);
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

				const res = await bring(PUBLIC_CORKBOARD_URL + '/upload', {
					method: 'POST',
					mode: 'cors',
					body: form_data
				});

				const id = await res?.json();

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
