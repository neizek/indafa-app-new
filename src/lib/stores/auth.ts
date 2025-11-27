import supabase from '$lib/helpers/db';
import type { Session } from '@supabase/supabase-js';
import { derived, get, writable } from 'svelte/store';
import { type UserRole } from '$lib/types/auth';
import { UserRolesEnum } from '$lib/enums/auth';
import { clearUser, initUser } from '$lib/helpers/auth';

export const user = writable<Session['user'] | null>(null);
export const session = writable<Session | null>(null);
export const userRole = writable<UserRole | null>(null);

export const isAdmin = derived(userRole, ($role) => $role === UserRolesEnum.admin);
export const isOperator = derived(userRole, ($role) => $role === UserRolesEnum.operator);
export const isCustomer = derived(userRole, ($role) => $role === UserRolesEnum.customer);
export const isReviewer = derived(userRole, ($role) => $role === UserRolesEnum.reviewer);

export async function initSession() {
	try {
		// Add timeout to handle iOS browsing context going away
		const timeoutPromise = new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error('Session initialization timeout')), 5000)
		);

		const sessionPromise = supabase.auth.getSession();

		const result = (await Promise.race([sessionPromise, timeoutPromise]).catch((err) => {
			if (err.message === 'Session initialization timeout') {
				console.warn('Session initialization timed out (iOS context may be going away)');
				return { data: { session: null }, error: null };
			}
			throw err;
		})) as Awaited<ReturnType<typeof supabase.auth.getSession>>;

		const {
			data: { session: currentSession },
			error
		} = result;

		if (error) {
			console.error('Error with initiating session:', error.message || error);
			return null;
		}

		if (currentSession) {
			initUser(currentSession);
		}
		setupAuthListener();
		return currentSession;
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
		// Don't treat "browsing context" errors as critical - they happen during app lifecycle
		if (errorMessage.includes('browsing context') || errorMessage.includes('context')) {
			console.warn(
				'Session initialization interrupted (likely due to app lifecycle):',
				errorMessage
			);
		} else {
			console.error('Exception initializing session:', errorMessage);
			console.error('Full error details:', err);
		}
		return null;
	}
}

// Setup auth state listener but with error handling
let authListenerInitialized = false;

function setupAuthListener() {
	if (authListenerInitialized) return;
	authListenerInitialized = true;

	try {
		supabase.auth.onAuthStateChange((_event, newSession) => {
			try {
				if (_event === 'SIGNED_OUT' || !newSession) {
					console.log('User signed out');
					clearUser();
					return;
				}

				if ((_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') && newSession) {
					console.log('User signed in');
					if (get(session)?.access_token !== newSession.access_token) {
						initUser(newSession);
					}
					return;
				}
			} catch (err) {
				console.log('Error in auth state change handler:', err);
			}
		});
	} catch (err) {
		console.log('Error setting up auth listener:', err);
	}
}
