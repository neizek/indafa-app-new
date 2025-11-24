import type { PostgrestError } from '@supabase/supabase-js';

export interface Toast {
	title: string;
	description: string;
	closable?: boolean;
}

export interface ErrorToast {
	title?: string;
	description?: string;
	error?: PostgrestError;
}
