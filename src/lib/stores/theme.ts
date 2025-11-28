import preferences from '$lib/helpers/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
// import { SafeArea } from '@capacitor-community/safe-area';
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

	StatusBar.setBackgroundColor({ color: '#00000000' });
	StatusBar.setOverlaysWebView({ overlay: true });

	if (!theme) {
		theme = isDarkThemePreffered() ? Theme.Dark : Theme.Light;
	}

	applyTheme(theme);
}

export function applyTheme(theme: Theme) {
	currentTheme.set(theme);
	preferences.set('theme', theme);

	if (theme === Theme.Dark) {
		StatusBar.setStyle({ style: Style.Dark });
	} else if (theme === Theme.Light) {
		StatusBar.setStyle({ style: Style.Light });
	}

	document.documentElement.classList.toggle('dark', theme === Theme.Dark);
}
