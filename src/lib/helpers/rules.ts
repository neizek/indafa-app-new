import supabase from './db';

export async function getRules(locale: string) {
	const { data, error } = await supabase.rpc('get_rules_by_language', {
		lang: locale
	});

	if (error) {
		console.error('Error fetching rules:', error);
		throw error;
	}

	return data;
}
