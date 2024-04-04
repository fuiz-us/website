export async function bring(
	input: URL | RequestInfo,
	init?: RequestInit | undefined
): Promise<Response | undefined> {
	try {
		return await fetch(input, init);
	} catch (e) {
		return undefined;
	}
}

export function zip<T, U>(a: Array<T>, b: Array<U>): Array<[T, U]> {
	if (a.length < b.length) {
		return a.map((v, i) => [v, b[i]]);
	}
	return b.map((v, i) => [a[i], v]);
}

export function isNotUndefined<T>(a?: T): a is T {
	return a !== undefined;
}

export function isNotNull<T>(a: T | null): a is T {
	return a !== null;
}

export function debounce(f: () => void, ms: number) {
	let timer: ReturnType<typeof setTimeout>;
	return () => {
		clearTimeout(timer);
		timer = setTimeout(f, ms);
	};
}
