// import { goto } from '$app/navigation';
import { ROUTES } from '$lib/constants/routes';
// import { callToLoginPopUp } from '$lib/helpers/auth.js';
// import {
// 	initAuthListener,
// 	initSession,
// 	isAdmin,
// 	isOperator,
// 	isReviewer,
// 	session
// } from '$lib/stores/auth';
// import { intendedUrl, previousUrl } from '$lib/stores/navigation';
import { initTheme } from '$lib/stores/theme';
import { loadTranslations, supportedLocalesOptions } from '$lib/translations/translations';
import { LocalNotifications } from '@capacitor/local-notifications';
// import { get } from 'svelte/store';
// import { resolve } from '$app/paths';
// import preferences from '$lib/helpers/preferences.js';
// import { initCarWashes } from '$lib/stores/carWashes';
// import { onMount } from 'svelte';
import { Capacitor } from '@capacitor/core';
import { initCarWashes } from '$lib/stores/carWashes.js';

export const prerender = true;
export const ssr = false;

// let storeReady = false;

// onMount(async () => {
// const savedLocale = await preferences.get<string>('locale');
loadTranslations(supportedLocalesOptions[0].value);
initTheme();
initCarWashes();
// await initSession();
// initCarWashes();
// initAuthListener();
// storeReady = true;
// });

const adminRoutes = [ROUTES.ADMIN.DASHBOARD, ROUTES.ADMIN.APPOINTMENTS];
const operatorRoutes = [ROUTES.OPERATOR];
const protectedRoutes = [
	...adminRoutes,
	...operatorRoutes,
	ROUTES.USER.PROFILE,
	ROUTES.APPOINTMENT
];

// Only check notification permissions if running natively
if (Capacitor.isNativePlatform()) {
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
}

export async function load(page) {
	// Route protection (middleware)
	const needsAuth = protectedRoutes.some((route) => page.url.pathname.startsWith(route as string));
	const operatorsOnly = operatorRoutes.some((route) =>
		page.url.pathname.startsWith(route as string)
	);
	const adminsOnly = adminRoutes.some((route) => page.url.pathname.startsWith(route as string));

	console.log(needsAuth, operatorsOnly, adminsOnly);
	// Make sure session is loaded before redirecting
	// if (needsAuth && !get(session)) {
	// 	const navigateToLink = get(previousUrl) ?? ROUTES.HOME;
	// 	intendedUrl.set(page.url);
	// 	await goto(resolve(navigateToLink as '/'), { replaceState: true });
	// 	callToLoginPopUp();
	// 	return {};
	// }

	// if (operatorsOnly && !get(isOperator) && !get(isAdmin) && !get(isReviewer)) {
	// 	goto(resolve(ROUTES.HOME));
	// 	return {};
	// }

	// if (adminsOnly && !get(isAdmin) && !get(isReviewer)) {
	// 	goto(resolve(ROUTES.HOME));
	// 	return {};
	// }
}
