import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

async function sequential<O>(values: Array<PromiseLike<O>>): Promise<Array<O>> {
	const results: O[] = [];
	for (const value of values) {
		results.push(await value);
	}
	return results;
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function attempt(f: () => PromiseLike<void>) {
	try {
		await f();
	} catch {
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
	f: (file: File) => PromiseLike<T>
): Promise<T[]> {
	return await sequential<T>(
		(
			await db.prepare('SELECT * FROM user_creations WHERE creator = ?').bind(userId).all()
		).results.map((file) => f(file as File))
	);
}

export async function deleteFile(db: D1Database, userId: string, id: string) {
	return await db
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
