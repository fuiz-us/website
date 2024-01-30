import type { FuizConfig, Media } from './types';

export type Database = IDBDatabase;

export type Creation = {
	id: number;
	title: string;
	lastEdited: number;
	slidesCount: number;
	media?: Media | undefined;
};

export type ExportedFuiz = {
	config: FuizConfig;
	lastEdited: number;
	publish?: {
		released_r2_key?: string;
		pending_r2_key?: string;
	};
};

export async function loadDatabase(): Promise<Database> {
	return await new Promise((resolve, reject) => {
		const request = indexedDB.open('FuizDB', 1);
		request.addEventListener('upgradeneeded', () => {
			const db = request.result;
			db.createObjectStore('creations', { autoIncrement: true });
		});
		request.addEventListener('success', () => {
			const db = request.result;

			resolve(db);
		});
		request.addEventListener('error', reject);
	});
}

export async function getAllCreations(givenDatabase?: Database): Promise<[Creation[], Database]> {
	const database = givenDatabase ?? (await loadDatabase());

	return await new Promise((resolve) => {
		const creationsStore = database.transaction(['creations'], 'readonly').objectStore('creations');

		const creationsTransaction = creationsStore.openCursor();

		const creations: Creation[] = [];

		creationsTransaction.addEventListener('success', () => {
			const cursor = creationsTransaction.result;
			if (cursor) {
				const value: ExportedFuiz = cursor.value;
				creations.push({
					id: parseInt(cursor.key.toString()),
					lastEdited: value.lastEdited,
					title: value.config.title,
					slidesCount: value.config.slides.length,
					media: value.config.slides.reduce<Media | undefined>(
						(p, c) => p || c.MultipleChoice.media,
						undefined
					)
				});
				cursor.continue();
			} else {
				resolve([creations, database]);
			}
		});
	});
}

export async function getCreation(
	id: number,
	givenDatabase?: Database
): Promise<[ExportedFuiz, Database]> {
	const database = givenDatabase ?? (await loadDatabase());

	return await new Promise((resolve, reject) => {
		const creationsStore = database.transaction(['creations'], 'readonly').objectStore('creations');

		const creationsTransaction = creationsStore.get(id);

		creationsTransaction.addEventListener('success', () => {
			const value: ExportedFuiz | undefined | null = creationsTransaction.result;

			if (value) {
				resolve([value, database]);
			} else {
				reject('creation was not found');
			}
		});
	});
}
