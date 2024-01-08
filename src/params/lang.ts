import { availableLanguageTags, type AvailableLanguageTag } from '$paraglide/runtime';

export const match = (param: string): param is AvailableLanguageTag => {
	return (availableLanguageTags as ReadonlyArray<string>).includes(param);
};
