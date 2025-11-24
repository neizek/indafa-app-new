import { goto } from '$app/navigation';
import { ROUTES } from '$lib/constants/routes';
import { callToLoginPopUp } from '$lib/helpers/auth.js';
import {
	initAuthListener,
	initSession,
	isAdmin,
	isOperator,
	isReviewer,
	session
} from '$lib/stores/auth';
import { intendedUrl, previousUrl } from '$lib/stores/navigation';
import { initTheme } from '$lib/stores/theme';
import { loadTranslations, supportedLocalesOptions } from '$lib/translations/translations';
import { LocalNotifications } from '@capacitor/local-notifications';
import { get } from 'svelte/store';
import { resolve } from '$app/paths';
import preferences from '$lib/helpers/preferences.js';
import { initCarWashes } from '$lib/stores/carWashes';

export const prerender = true;
export const ssr = false;

const savedLocale = await preferences.get<string>('locale');

loadTranslations(savedLocale ?? supportedLocalesOptions[0].value);
initTheme();

// Wait for the app to be ready before initializing session
// This prevents "browsing context going away" errors on iOS
const initializeApp = async () => {
	try {
		// Small delay to ensure the webview is ready
		await new Promise((resolve) => setTimeout(resolve, 100));
	} catch {
		// ignore
	}

	await initSession();
	await initCarWashes();
	initAuthListener();
};

initializeApp().catch((err) => {
	console.error('Failed to initialize app:', err);
});

LocalNotifications.checkPermissions()
	.then((status) => {
		if (status.display === 'prompt' || status.display === 'prompt-with-rationale') {
			LocalNotifications.requestPermissions().catch((err) => {
				console.log('Notification permission request error:', err);
			});
		}
	})
	.catch((err) => {
		console.log('Failed to check notification permissions:', err);
	});

const adminRoutes = [ROUTES.ADMIN.DASHBOARD, ROUTES.ADMIN.APPOINTMENTS];
const operatorRoutes = [ROUTES.OPERATOR];
const protectedRoutes = [
	...adminRoutes,
	...operatorRoutes,
	ROUTES.USER.PROFILE,
	ROUTES.APPOINTMENT
];

export async function load(page) {
	// Permission for notifications
	LocalNotifications.checkPermissions().then((status) => {
		if (status.display === 'prompt' || status.display === 'prompt-with-rationale') {
			LocalNotifications.requestPermissions();
		}
	});

	// Route protection (Middleware)
	const needsAuth = protectedRoutes.some((route) => page.url.pathname.startsWith(route as string));
	const operatorsOnly = operatorRoutes.some((route) =>
		page.url.pathname.startsWith(route as string)
	);
	const adminsOnly = adminRoutes.some((route) => page.url.pathname.startsWith(route as string));

	if (needsAuth && !get(session)) {
		const navigateToLink = get(previousUrl) ?? ROUTES.HOME;
		intendedUrl.set(page.url);
		await goto(resolve(navigateToLink as '/'), { replaceState: true });
		callToLoginPopUp();
	}

	if (operatorsOnly && !get(isOperator) && !get(isAdmin) && !get(isReviewer)) {
		goto(resolve(ROUTES.HOME));
	}

	if (adminsOnly && !get(isAdmin) && !get(isReviewer)) {
		goto(resolve(ROUTES.HOME));
	}
}
