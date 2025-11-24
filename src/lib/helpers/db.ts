import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase environment variables:', {
		urlExists: !!supabaseUrl,
		keyExists: !!supabaseKey
	});
}

// Check if running on a native platform (Capacitor)
const isNativePlatform = () => {
	try {
		return !!(window as any).capacitor;
	} catch {
		return false;
	}
};

const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
	auth: {
		autoRefreshToken: true,
		// Disable persistSession on native platforms to avoid iOS browsing context issues
		persistSession: !isNativePlatform(),
		detectSessionInUrl: false
	}
});

export default supabase;
