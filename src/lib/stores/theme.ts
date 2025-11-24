import preferences from '$lib/helpers/preferences';
import { Moon, Sun } from '@lucide/svelte';
import { writable } from 'svelte/store';

export enum Theme {
	Light = 'light',
	Dark = 'dark'
}

export const currentTheme = writable<Theme>(undefined);
export const themesOptions = Object.values(Theme).map((theme) => ({
	value: theme,
	label: `common.${theme}`,
	icon: theme === Theme.Dark ? Moon : Sun
}));

const isDarkThemePreffered = () =>
	window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export async function initTheme() {
	let theme = (await preferences.get('theme')) as Theme;

	if (!theme) {
		theme = isDarkThemePreffered() ? Theme.Dark : Theme.Light;
	}

	applyTheme(theme);
}

export function applyTheme(theme: Theme) {
	currentTheme.set(theme);
	preferences.set('theme', theme);
	document.documentElement.classList.toggle('dark', theme === Theme.Dark);
}
