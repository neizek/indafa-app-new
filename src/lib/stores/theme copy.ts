import storage from '$lib/helpers/storage';
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

export function initTheme() {
	let theme = storage.get('theme') as Theme;

	if (!theme) {
		theme = isDarkThemePreffered() ? Theme.Dark : Theme.Light;
	}

	applyTheme(theme);
}

export function applyTheme(theme: Theme) {
	currentTheme.set(theme);
	storage.set('theme', theme);
	document.documentElement.classList.toggle('dark', theme === Theme.Dark);
}

// export function updateTheme(theme: Theme) {
// 	currentTheme.set(theme);
// 	applyTheme(theme);
// }
