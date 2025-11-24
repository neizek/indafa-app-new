import type { Route } from '$lib/constants/routes';
import type { URL } from 'node:url';
import { writable } from 'svelte/store';

export const previousUrl = writable<Route | undefined>(undefined);
export const intendedUrl = writable<URL | undefined>(undefined);
