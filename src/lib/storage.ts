import objectHash from 'object-hash';
import type { IdlessFuizConfig, IdlessMultipleChoiceSlide, Media, Modify } from './types';

export type Database = IDBDatabase;

export type Creation = {
	id: number;
	title: string;
	lastEdited: number;
	slidesCount: number;
	media?: Media | undefined;
};

export type ExportedFuiz = {
	config: IdlessFuizConfig;
	lastEdited: number;
	publish?: {
		released_r2_key?: string;
		pending_r2_key?: string;
	};
};

type MediaReference = string | Media;

type MediaReferencedMultipleChoiceSlide = Modify<
	IdlessMultipleChoiceSlide,
	{
		media?: MediaReference;
	}
>;

type MediaReferencedSlide = {
	MultipleChoice: MediaReferencedMultipleChoiceSlide;
};

type MediaReferencedFuizConfig = Modify<
	IdlessFuizConfig,
	{
		slides: MediaReferencedSlide[];
	}
>;

type InternalFuiz = {
	config: MediaReferencedFuizConfig;
	lastEdited: number;
	publish?: {
		released_r2_key?: string;
		pending_r2_key?: string;
	};
};

async function internalizeMedia(
	media: Media | undefined,
	database: Database
): Promise<string | undefined> {
	if (media == undefined) return undefined;
	const imagesStore = database.transaction(['images'], 'readwrite').objectStore('images');
	const hash = objectHash(media);
	imagesStore.add(media, hash);
	return hash;
}

async function internalizeFuiz(fuiz: ExportedFuiz, database: Database): Promise<InternalFuiz> {
	return {
		...fuiz,
		config: {
			...fuiz.config,
			slides: await Promise.all(
				fuiz.config.slides.map(async (slide) => ({
					MultipleChoice: {
						...slide.MultipleChoice,
						media: await internalizeMedia(slide.MultipleChoice.media, database)
					}
				}))
			)
		}
	};
}

async function collectMedia(
	id: string | Media | undefined,
	database: Database
): Promise<Media | undefined> {
	if (id == undefined) return undefined;
	if (typeof id !== 'string') {
		return id;
	}
	const imagesStore = database.transaction(['images'], 'readonly').objectStore('images');
	const transaction = imagesStore.get(id);
	return await new Promise((resolve) => {
		transaction.addEventListener('success', () => {
			const value: Media | undefined | null = transaction.result;

			if (value) {
				resolve(value);
			} else {
				resolve(undefined);
			}
		});
	});
}

async function collectFuiz(fuiz: InternalFuiz, database: Database): Promise<ExportedFuiz> {
	return {
		...fuiz,
		config: {
			...fuiz.config,
			slides: await Promise.all(
				fuiz.config.slides.map(async (slide) => ({
					MultipleChoice: {
						...slide.MultipleChoice,
						media: await collectMedia(slide.MultipleChoice.media, database)
					}
				}))
			)
		}
	};
}

export async function loadDatabase(): Promise<Database> {
	const request = indexedDB.open('FuizDB', 2);

	request.addEventListener('upgradeneeded', (event) => {
		const db = request.result;

		if (event.oldVersion != 1) {
			db.createObjectStore('creations', { autoIncrement: true });
		}
		db.createObjectStore('images');
	});

	return await new Promise((resolve, reject) => {
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('error', reject);
	});
}

export async function getAllCreations(givenDatabase?: Database): Promise<Creation[]> {
	const database = givenDatabase ?? (await loadDatabase());

	const creationsStore = database.transaction(['creations'], 'readonly').objectStore('creations');

	const creationsTransaction = creationsStore.openCursor();

	const internals: [IDBValidKey, InternalFuiz][] = await new Promise((resolve) => {
		const internals: [IDBValidKey, InternalFuiz][] = [];

		creationsTransaction.addEventListener('success', async () => {
			const cursor = creationsTransaction.result;
			if (cursor) {
				internals.push([cursor.key, cursor.value]);
				cursor.continue();
			} else {
				resolve(internals);
			}
		});
	});

	return await Promise.all(
		internals.map(async ([key, f]) => {
			const value = await collectFuiz(f, database);
			return {
				id: parseInt(key.toString()),
				lastEdited: value.lastEdited,
				title: value.config.title,
				slidesCount: value.config.slides.length,
				media: value.config.slides.reduce<Media | undefined>(
					(p, c) => p || c.MultipleChoice.media,
					undefined
				)
			};
		})
	);
}

export async function getCreation(id: number, givenDatabase?: Database): Promise<ExportedFuiz> {
	const database = givenDatabase ?? (await loadDatabase());

	const creationsStore = database.transaction(['creations'], 'readonly').objectStore('creations');

	const creationsTransaction = creationsStore.get(id);

	return await new Promise((resolve, reject) => {
		creationsTransaction.addEventListener('success', async () => {
			const value: InternalFuiz | undefined | null = creationsTransaction.result;

			if (value) {
				resolve(await collectFuiz(value, database));
			} else {
				reject('creation was not found');
			}
		});
	});
}

export async function deleteCreation(id: number, givenDatabase?: Database): Promise<void> {
	const database = givenDatabase ?? (await loadDatabase());

	const creationsStore = database.transaction(['creations'], 'readwrite').objectStore('creations');

	const request = creationsStore.delete(id);

	return await new Promise((resolve) => {
		request.addEventListener('success', () => {
			resolve(undefined);
		});
	});
}

export async function addCreation(
	newSlide: ExportedFuiz,
	givenDatabase?: Database
): Promise<number> {
	const database = givenDatabase ?? (await loadDatabase());

	const internalFuiz = await internalizeFuiz(newSlide, database);

	const creationsStore = database.transaction(['creations'], 'readwrite').objectStore('creations');

	const request = creationsStore.put(internalFuiz);

	return await new Promise((resolve) => {
		request.addEventListener('success', () => {
			resolve(parseInt(request.result.toString()));
		});
	});
}

export async function updateCreation(
	id: number,
	newSlide: ExportedFuiz,
	givenDatabase?: Database
): Promise<void> {
	const database = givenDatabase ?? (await loadDatabase());

	const internalFuiz = await internalizeFuiz(newSlide, database);

	const creationsStore = database.transaction(['creations'], 'readwrite').objectStore('creations');
	const request = creationsStore.put(internalFuiz, id);

	return await new Promise((resolve) => {
		request.addEventListener('success', () => {
			resolve(undefined);
		});
	});
}
