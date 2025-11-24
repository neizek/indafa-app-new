import type { SelectOption } from '$lib/types/ui';
import i18n, { type Config } from 'sveltekit-i18n';
import en from './en.json';
import ru from './ru.json';
import lv from './lv.json';
import preferences from '$lib/helpers/preferences';
// import storage from '$lib/helpers/storage';

interface SupportedLocaleOption extends SelectOption {
	value: string;
	import: object;
}

export const supportedLocalesOptions: SupportedLocaleOption[] = [
	{ value: 'en', label: 'English', import: en },
	{ value: 'lv', label: 'Latviešu', import: lv },
	{ value: 'ru', label: 'Русский', import: ru }
];

const config: Config<{ [prop: string]: string }> = {
	loaders: supportedLocalesOptions.map((locale) => ({
		locale: locale.value,
		key: 'common',
		loader: async () => locale.import
	})),
	fallbackLocale: 'en'
};

export const switchLocale = (newLocale: string) => {
	locale.set(newLocale);
	preferences.set('locale', newLocale);
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
