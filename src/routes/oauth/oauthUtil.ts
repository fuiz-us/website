import { env } from '$env/dynamic/private';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { error, type Cookies } from '@sveltejs/kit';
import { OAuth2Client } from 'oslo/oauth2';

export const options = () =>
	({
		clientId: env.OAUTH_CLIENT_ID,
		clientSecret: env.OAUTH_CLIENT_SECRET,
		redirectUri: env.OAUTH_REDIRECT_URI
	} as const);

export const scope = 'email account' as const;

export function getToken(cookies: Cookies): string {
	const credintials = cookies.get('oauth');
	if (!credintials) error(401, 'no oauth cookie');
	return credintials;
}

export function initClient() {
	const oauth2Client = new OAuth2Client(
		env.OAUTH_CLIENT_ID,
		env.OAUTH_AUTHORIZE_URL,
		env.OAUTH_TOKEN_URL,
		{
			redirectURI: env.OAUTH_REDIRECT_URI
		}
	);
	return oauth2Client;
}

async function sequential<O>(values: Array<Awaited<O>>): Promise<Array<O>> {
	const results: O[] = [];
	for (const value of values) {
		results.push(await value);
	}
	return results;
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function attempt(f: () => Awaited<void>) {
	try {
		await f();
	} catch (e) {
		return undefined;
	}
}

export type File = {
	id: string;
	lastEdited: number;
	versionId: number;
	creator: string;
};

export async function getCreations<T>(
	db: D1Database,
	userId: string,
	f: (file: File) => Awaited<T>
): Promise<T[]> {
	return await sequential<T>(
		(
			await db.prepare('SELECT * FROM user_creations WHERE creator = ?').bind(userId).all()
		).results.map((file) => f(file as File))
	);
}

export async function deleteFile(db: D1Database, userId: string, id: string) {
	return await await db
		.prepare('DELETE FROM user_creations WHERE id = ? AND creator = ?')
		.bind(id, userId)
		.run();
}

export async function content(name: string, storage: R2Bucket): Promise<string | undefined> {
	return await (await storage.get(name))?.text();
}

export async function update(file: File, data: string, db: D1Database, storage: R2Bucket) {
	await await db
		.prepare('UPDATE user_creations SET lastEdited = ?, versionId = ? WHERE id = ? AND creator = ?')
		.bind(file.lastEdited, file.versionId, file.id, file.creator)
		.run();

	await storage.put(file.id, data);
}

export async function create(file: File, data: string, db: D1Database, storage: R2Bucket) {
	await await db
		.prepare('INSERT INTO user_creations (id, lastEdited, versionId, creator) VALUES (?, ?, ?, ?)')
		.bind(file.id, file.lastEdited, file.versionId, file.creator)
		.run();

	await storage.put(file.id, data);
}
