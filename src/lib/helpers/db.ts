import { createClient } from '@supabase/supabase-js';
import preferences from './preferences';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase environment variables:', {
		urlExists: !!supabaseUrl,
		keyExists: !!supabaseKey
	});
}

const CapacitorStorage = {
	async getItem(key: string) {
		const value = await preferences.get<string | null>(key);
		return value;
	},
	async setItem(key: string, value: string) {
		preferences.set(key, value);
	},
	async removeItem(key: string) {
		preferences.remove(key);
	}
};

const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
		flowType: 'pkce',
		storage: CapacitorStorage
	}
});

export default supabase;
