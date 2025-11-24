import supabase from './db';

async function getOffers() {
	const { data, error } = await supabase.storage.from('offers').list('public', { limit: 100 });

	if (error) {
		console.error('Error:', error);
		throw error;
	}

	const realFiles = data.filter((file) => file.name !== '.emptyFolderPlaceholder');

	return realFiles.flatMap((file) => {
		const { data } = supabase.storage.from('offers').getPublicUrl(`public/${file.name}`);
		if (!data.publicUrl) {
			return [];
		}

		return {
			url: data.publicUrl
		};
	});
}

export { getOffers };
