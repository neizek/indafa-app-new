import type { UserRolesEnum } from '$lib/enums/auth';
import type { UserAttributes } from '@supabase/supabase-js';

export type VerificationType = 'sms' | 'email' | 'phone_change' | 'email_change';
export type SignInType = 'sms' | 'email';

export type UserEditPayload = Partial<UserAttributes>;
export type UserEditEmailOrPhonePayload = Pick<UserEditPayload, 'email' | 'phone'>;

export type UserRole = UserRolesEnum;
