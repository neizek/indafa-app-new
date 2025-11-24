import OTPForm from '$lib/components/forms/OTPForm.svelte';
import SignInForm from '$lib/components/forms/SignInForm.svelte';
import supabase from '$lib/helpers/db';
import appointmentsStore from '$lib/stores/appointments';
import { createPopUp } from '$lib/stores/popUp';
import vehiclesStore from '$lib/stores/vehicles';
import type {
	UserEditEmailOrPhonePayload,
	UserEditPayload,
	VerificationType
} from '$lib/types/auth';
import type { Session, VerifyOtpParams } from '@supabase/supabase-js';
import { KeyRound, MailCheck, Pen, Phone, User, UserPen } from '@lucide/svelte';
import EditProfileForm from '$lib/components/forms/MissingProfileDataForm.svelte';
import { session, user, userRole } from '$lib/stores/auth';
import storage from './storage';
import EditUserMenu from '$lib/components/widgets/EditUserMenu.svelte';
import ChangeEmailForm from '$lib/components/forms/ChangeEmailForm.svelte';
import ChangePhoneForm from '$lib/components/forms/ChangePhoneForm.svelte';
import ChangePersonalDataForm from '$lib/components/forms/ChangePersonalDataForm.svelte';

const WHITELISTED_EMAILS = ['test@example.com'];

// #region General

export function initUser(currentSession: Session) {
	session.set(currentSession);
	user.set(currentSession.user);
	userRole.set(currentSession.user.app_metadata.role);
	vehiclesStore.init(currentSession.user.id);
	appointmentsStore.init();
}

export function clearUser() {
	session.set(null);
	user.set(null);
	vehiclesStore.clear();
	storage.remove('vehicles');
	appointmentsStore.clear();
	storage.remove('appointments');
	userRole.set(null);
}

// #endregion

// #region Database

export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		console.error('Sign in error:', error.message);
		throw error;
	}

	return data.session;
}

export async function signUp(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password
	});

	if (error) {
		console.error('Sign up error:', error.message);
		return null;
	}

	return data.user;
}

export async function sendOTP(type: VerificationType, input: string) {
	const payload = (() => {
		if (type === 'email') {
			return {
				email: input,
				options: { shouldCreateUser: true }
			};
		}

		if (type === 'sms') {
			return {
				phone: input,
				options: { shouldCreateUser: true }
			};
		}
	})();

	if (!payload) {
		return;
	}

	if (WHITELISTED_EMAILS.includes(input)) {
		return true;
	}

	const { data, error } = await supabase.auth.signInWithOtp(payload);

	if (error) {
		console.error('Sign up error:', error.message);
		throw error;
	}

	return data.user;
}

export async function verifyOTP(type: VerificationType, input: string, token: string) {
	const payload: VerifyOtpParams | undefined = (() => {
		if (type === 'email' || type === 'email_change') {
			return {
				email: input,
				token,
				type
			};
		}

		if (type === 'sms' || type === 'phone_change') {
			return {
				phone: input,
				token,
				type
			};
		}
	})();

	if (!payload) {
		return;
	}

	const { data, error } = await supabase.auth.verifyOtp(payload);

	if (error) {
		console.error('Verify OTP error:', error.message);
		throw error;
	}

	user.set(data.user);
	return data.user;
}

export async function updateUser(userEditPayload: UserEditPayload) {
	const { data, error } = await supabase.auth.updateUser(userEditPayload);

	if (error) {
		console.error('User update error', error);
		throw error;
	}

	user.set(data.user);
	return data.user;
}

export async function updateUserEmailOrPhone(userEditPayload: UserEditEmailOrPhonePayload) {
	const { data, error } = await supabase.auth.updateUser(userEditPayload);

	if (error) {
		console.error('User update error', error);
		throw error;
	}

	return data.user;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error('Sign out error:', error);
		throw error;
	}
}

export async function getCustomerData(userId: string) {
	const { data, error } = await supabase.rpc('get_user_contact_by_id', {
		user_id: userId
	});

	if (error) {
		console.error('Sign out error:', error);
		throw error;
	}

	return data[0];
}

// #endregion

// #region PopUps

export function callToLoginPopUp() {
	createPopUp({
		title: 'common.authorization',
		icon: KeyRound,
		content: {
			component: SignInForm
		}
	});
}

export function openOTPVerificationPopUp(input: string, verificationType: VerificationType) {
	createPopUp({
		title: 'common.verification',
		content: {
			component: OTPForm,
			props: {
				input,
				verificationType
			}
		}
	});
}

export function openEditUserMenuPopUp() {
	createPopUp({
		title: 'common.editProfile',
		icon: User,
		content: {
			component: EditUserMenu
		}
	});
}

export function openChangePersonalDataPopUp() {
	createPopUp({
		title: 'common.changePersonalData',
		icon: UserPen,
		content: {
			component: ChangePersonalDataForm
		}
	});
}

export function openChangeEmailPopUp() {
	createPopUp({
		title: 'common.changeEmail',
		icon: MailCheck,
		content: {
			component: ChangeEmailForm
		}
	});
}

export function openChangePhonePopUp() {
	createPopUp({
		title: 'common.changePhone',
		icon: Phone,
		content: {
			component: ChangePhoneForm
		}
	});
}

export function openMissingProfileDataPopup() {
	createPopUp({
		title: 'common.editProfile',
		icon: Pen,
		content: {
			component: EditProfileForm
		}
	});
}

// #endregion
