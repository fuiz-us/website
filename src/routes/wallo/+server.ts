import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { IdlessFuizConfig, IdlessSlide, Media, OnlineFuiz } from '$lib/types';
import { isNotUndefined } from '$lib/util';
import { parse } from '@ltd/j-toml';
import { createFileInGit, updateFileInGit } from '$lib/gitlab';
import { getThumbnail } from '$lib/serverOnlyUtils';
import { env } from '$env/dynamic/private';
import type { Ai } from '@cloudflare/workers-types';
import { assertUnreachable } from '$lib';
import { timingSafeEqual } from 'crypto';

function timingSafeEqualString(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}

	const encoder = new TextEncoder();

	const aEncoded = encoder.encode(a);
	const bEncoded = encoder.encode(b);

	if (aEncoded.byteLength !== bEncoded.byteLength) return false;

	return timingSafeEqual(aEncoded, bEncoded);
}

async function extractKeywords(ai: Ai, config: IdlessFuizConfig): Promise<string[]> {
	const messages: { role: 'system' | 'user'; content: string }[] = [
		{
			role: 'system',
			content:
				'Give sixteen keywords of the following user content to aid users find it while searching, separated with commas and no other system text ever'
		},
		{
			role: 'user',
			content: config.slides
				.map((slide) => {
					switch (true) {
						case 'TypeAnswer' in slide:
							return slide.TypeAnswer.title;
						case 'Order' in slide:
							return slide.Order.title;
						case 'MultipleChoice' in slide:
							return slide.MultipleChoice.title;
						default:
							return assertUnreachable(slide);
					}
				})
				.join('\n')
		}
	];

	const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', { messages, stream: false });

	if (!response) {
		return [];
	}

	if ('getReader' in response) {
		return (await new Response(response as ReadableStream).text())?.split(',')?.slice(0, 16) ?? [];
	}
	return response.response?.split(',')?.slice(0, 16) ?? [];
}

type Response = {
	medias: WalloMedia[];
	possibleActions: PossibleAction[];
};

type PossibleAction = {
	id: string;
	display?: string;
	variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

type WalloMedia =
	| {
			kind: 'text';
			message: string;
			tag?: string;
	  }
	| {
			kind: 'image';
			url: string;
			alt?: string;
			tag?: string;
	  }
	| {
			kind: 'video';
			url: string;
			tag?: string;
	  };

export const POST: RequestHandler = async ({ request, platform }) => {
	function serializeMedia(media: Media | undefined): WalloMedia | undefined {
		if (!media) return undefined;
		if (!('Base64' in media.Image)) return undefined;
		return {
			kind: 'image',
			url: media.Image.Base64.data,
			alt: media.Image.Base64.alt,
			tag: 'Slide Image'
		};
	}

	function extractSlide(slide: IdlessSlide): WalloMedia[] {
		if ('TypeAnswer' in slide) {
			const medias: (WalloMedia | undefined)[] = [
				{
					kind: 'text',
					message: slide.TypeAnswer.title,
					tag: 'Slide Title'
				},
				{
					kind: 'text',
					message: slide.TypeAnswer.answers.join('\n'),
					tag: 'Slide Answers'
				},
				{
					kind: 'text',
					message: slide.TypeAnswer.time_limit.toString() + 'ms',
					tag: 'Time Limit'
				},
				{
					kind: 'text',
					message: slide.TypeAnswer.points_awarded.toString() + 'pts',
					tag: 'Points Awarded'
				},
				serializeMedia(slide.TypeAnswer.media)
			];

			return medias.filter(isNotUndefined);
		}
		if ('Order' in slide) {
			const medias: (WalloMedia | undefined)[] = [
				{
					kind: 'text',
					message: slide.Order.title,
					tag: 'Slide Title'
				},
				{
					kind: 'text',
					message: slide.Order.answers.map((a) => `- ${a}`).join('\n'),
					tag: 'Slide Answers'
				},
				{
					kind: 'text',
					message: slide.Order.introduce_question.toString() + 'ms',
					tag: 'Introduce Question'
				},
				{
					kind: 'text',
					message: slide.Order.time_limit.toString() + 'ms',
					tag: 'Time Limit'
				},
				{
					kind: 'text',
					message: slide.Order.points_awarded.toString() + 'pts',
					tag: 'Points Awarded'
				},
				serializeMedia(slide.Order.media)
			];

			return medias.filter(isNotUndefined);
		}
		const medias: (WalloMedia | undefined)[] = [
			{
				kind: 'text',
				message: slide.MultipleChoice.title,
				tag: 'Slide Title'
			},
			{
				kind: 'text',
				message: slide.MultipleChoice.answers
					.map((a) => `- ${a.content.Text}, ${a.correct ? 'correct' : 'wrong'}`)
					.join('\n'),
				tag: 'Slide Answers'
			},
			{
				kind: 'text',
				message: slide.MultipleChoice.introduce_question.toString() + 'ms',
				tag: 'Introduce Question'
			},
			{
				kind: 'text',
				message: slide.MultipleChoice.time_limit.toString() + 'ms',
				tag: 'Time Limit'
			},
			{
				kind: 'text',
				message: slide.MultipleChoice.points_awarded.toString() + 'pts',
				tag: 'Points Awarded'
			},
			serializeMedia(slide.MultipleChoice.media)
		];

		return medias.filter(isNotUndefined);
	}

	const auth = request.headers.get('Authorization')?.trim();
	if (!timingSafeEqualString(auth ?? '', `Basic ${env.WALLO_CLIENT_SECRET}`))
		return new Response(null, { status: 401 });

	const body = (await request.json()) as {
		kind: 'content';
		relevantId: string;
		action?: string;
	};

	console.log(body);

	if (body.action) {
		console.log(`Received action ${body.action} for ${body.relevantId}`);

		const { relevantId } = body;

		const pendingSubmission = await platform?.env.DATABASE.prepare(
			`SELECT * FROM pending_submissions WHERE storage_id = ?`
		)
			.bind(relevantId)
			.first();

		if (pendingSubmission) {
			const desiredId =
				(await platform?.env.DATABASE.prepare(
					`DELETE FROM pending_submissions WHERE storage_id = ? RETURNING desired_id`
				)
					.bind(relevantId)
					.first<string>('desired_id')) ?? null;

			if (!desiredId) return new Response('No subject found', { status: 404 });

			if (body.action === 'approve') {
				const fuizText = await (await platform?.env.BUCKET.get(relevantId))?.text();

				if (!fuizText)
					return new Response('Subject cannot be found in object storage', { status: 404 });

				let played_count = 0;

				let gitUrl: string;

				if (desiredId !== relevantId) {
					await platform?.env.BUCKET.delete(desiredId);
					await platform?.env.BUCKET.put(desiredId, fuizText);
					await platform?.env.BUCKET.delete(relevantId);
					played_count =
						(await platform?.env.DATABASE.prepare(
							`DELETE FROM approved_submissions WHERE storage_id = ? RETURNING played_count`
						)
							.bind(desiredId)
							.first<number>('played_count')) ?? 0;
					gitUrl = await updateFileInGit(desiredId + '.toml', fuizText);
				} else {
					gitUrl = await createFileInGit(desiredId + '.toml', fuizText);
				}

				const {
					author,
					subjects = [],
					grades = [],
					language,
					config: { title, slides }
				} = parse(fuizText, {
					bigint: false
				}) as OnlineFuiz;

				const keywords = platform?.env.AI
					? await extractKeywords(platform?.env.AI, { title, slides })
					: [];

				const { thumbnail, thumbnailAlt } = (await getThumbnail({ title, slides })) || {
					thumbnail: null,
					thumbnailAlt: null
				};

				await platform?.env.DATABASE.prepare(
					`INSERT INTO approved_submissions (
						storage_id,
						title,
						author,
						public_url,
						subjects,
						grades,
						keywords,
						slides_count,
						played_count,
						language_code,
						thumbnail_alt,
						thumbnail
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
				)
					.bind(
						desiredId,
						title,
						author,
						gitUrl,
						subjects.join(' ~ '),
						grades.join(' ~ '),
						keywords.join(' ~ '),
						slides.length,
						played_count,
						language,
						thumbnailAlt,
						thumbnail
					)
					.run();
			} else if (body.action === 'reject') {
				await platform?.env.DATABASE.prepare(
					`INSERT INTO denied_submissions (storage_id, desired_id) VALUES (?1, ?2)`
				)
					.bind(relevantId, desiredId)
					.run();
			} else {
				return new Response('Invalid action', { status: 400 });
			}

			return json({ success: true });
		}

		const approvedSubmission = await platform?.env.DATABASE.prepare(
			`SELECT * FROM approved_submissions WHERE storage_id = ?`
		)
			.bind(relevantId)
			.first();

		if (approvedSubmission) {
			if (body.action === 'unapprove') {
				await platform?.env.DATABASE.prepare(
					`DELETE FROM approved_submissions WHERE storage_id = ?`
				)
					.bind(relevantId)
					.run();

				await platform?.env.DATABASE.prepare(
					`INSERT INTO denied_submissions (storage_id, desired_id) VALUES (?1, ?1)`
				)
					.bind(relevantId)
					.run();

				return json({ success: true });
			} else {
				return new Response('Invalid action', { status: 400 });
			}
		}

		const deniedSubmission = await platform?.env.DATABASE.prepare(
			`SELECT * FROM denied_submissions WHERE storage_id = ?`
		)
			.bind(relevantId)
			.first();

		if (deniedSubmission) {
			if (body.action === 'reapprove') {
				const desiredId = await platform?.env.DATABASE.prepare(
					`DELETE FROM denied_submissions WHERE storage_id = ? RETURNING desired_id`
				)
					.bind(relevantId)
					.first<string>('desired_id');

				if (!desiredId) return new Response('No subject found', { status: 404 });

				const fuizText = await (await platform?.env.BUCKET.get(relevantId))?.text();

				if (!fuizText)
					return new Response('Subject cannot be found in object storage', { status: 404 });

				let played_count = 0;

				let gitUrl: string;

				if (desiredId !== relevantId) {
					await platform?.env.BUCKET.delete(desiredId);
					await platform?.env.BUCKET.put(desiredId, fuizText);
					await platform?.env.BUCKET.delete(relevantId);
					played_count =
						(await platform?.env.DATABASE.prepare(
							`DELETE FROM approved_submissions WHERE storage_id = ? RETURNING played_count`
						)
							.bind(desiredId)
							.first<number>('played_count')) ?? 0;
					gitUrl = await updateFileInGit(desiredId + '.toml', fuizText);
				} else {
					gitUrl = await createFileInGit(desiredId + '.toml', fuizText);
				}

				const {
					author,
					subjects = [],
					grades = [],
					language,
					config: { title, slides }
				} = parse(fuizText, {
					bigint: false
				}) as OnlineFuiz;

				const keywords = platform?.env.AI
					? await extractKeywords(platform?.env.AI, { title, slides })
					: [];

				const { thumbnail, thumbnailAlt } = (await getThumbnail({ title, slides })) || {
					thumbnail: null,
					thumbnailAlt: null
				};

				await platform?.env.DATABASE.prepare(
					`INSERT INTO approved_submissions (
							storage_id,
							title,
							author,
							public_url,
							subjects,
							grades,
							keywords,
							slides_count,
							played_count,
							language_code,
							thumbnail_alt,
							thumbnail
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
				)
					.bind(
						desiredId,
						title,
						author,
						gitUrl,
						subjects.join(' ~ '),
						grades.join(' ~ '),
						keywords.join(' ~ '),
						slides.length,
						played_count,
						language,
						thumbnailAlt,
						thumbnail
					)
					.run();
				return json({ success: true });
			} else {
				return new Response('Invalid action', { status: 400 });
			}
		}
	} else {
		const { relevantId } = body;

		const fuiz_str = await (await platform?.env.BUCKET.get(relevantId))?.text();

		if (!fuiz_str)
			return new Response('Subject cannot be found in object storage', { status: 404 });

		const fuiz = parse(fuiz_str, { bigint: false }) as OnlineFuiz;

		const originalMedias: WalloMedia[] = [
			{
				kind: 'text',
				message: fuiz.author,
				tag: 'Author'
			},
			{
				kind: 'text',
				message: fuiz.language,
				tag: 'Language'
			},
			{
				kind: 'text',
				message: fuiz.subjects?.join(', ') ?? '',
				tag: 'Subjects'
			},
			{
				kind: 'text',
				message: fuiz.grades?.join(', ') ?? '',
				tag: 'Grades'
			},
			{
				kind: 'text',
				message: fuiz.config.title,
				tag: 'Title'
			}
		];

		const medias: WalloMedia[] = originalMedias.concat(fuiz.config.slides.flatMap(extractSlide));

		const pendingSubmission = await platform?.env.DATABASE.prepare(
			`SELECT * FROM pending_submissions WHERE storage_id = ?`
		)
			.bind(relevantId)
			.first();

		if (pendingSubmission) {
			const response: Response = {
				possibleActions: [
					{
						id: 'approve',
						display: 'Approve'
					},
					{
						id: 'reject',
						display: 'Reject',
						variant: 'destructive'
					}
				],
				medias
			};

			return json(response);
		}

		const approvedSubmission = await platform?.env.DATABASE.prepare(
			`SELECT * FROM approved_submissions WHERE storage_id = ?`
		)
			.bind(relevantId)
			.first();

		if (approvedSubmission) {
			const response: Response = {
				possibleActions: [
					{
						id: 'unapprove',
						display: 'Unapprove',
						variant: 'destructive'
					}
				],
				medias
			};

			return json(response);
		}

		const deniedSubmission = await platform?.env.DATABASE.prepare(
			`SELECT * FROM denied_submissions WHERE storage_id = ?`
		)
			.bind(relevantId)
			.first();

		if (deniedSubmission) {
			const response: Response = {
				possibleActions: [
					{
						id: 'reapprove',
						display: 'Reapprove'
					}
				],
				medias
			};

			return json(response);
		}

		return new Response('No submission found', { status: 404 });
	}

	return new Response();
};
