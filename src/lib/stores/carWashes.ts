import { derived, writable, type Readable } from 'svelte/store';
import type { CarWash } from '../types/carWashes';
import { getCarWashes } from '$lib/helpers/carWashes';
import type { SelectOption } from '$lib/types/ui';
import preferences from '$lib/helpers/preferences';

export const carWashes = writable<Array<CarWash>>([]);

export async function initCarWashes(): Promise<void> {
	let fetchedCarWashes = (await preferences.get('carWashes')) as CarWash[];

	if (!fetchedCarWashes) {
		getCarWashes()
			.then((response) => {
				fetchedCarWashes = response;
			})
			.catch(() => {
				fetchedCarWashes = [];
			});
		preferences.set('carWashes', fetchedCarWashes, 86400000);
	}

	carWashes.set(fetchedCarWashes);
}

export const carWashesOptions: Readable<SelectOption[]> = derived(carWashes, (carWashes) =>
	carWashes.map((carWash) => ({
		value: carWash.id,
		label: carWash.address
	}))
);

export const carWashesMap = derived(
	carWashes,
	(carWashes) => new Map(carWashes.map((carWash) => [carWash.id, carWash]))
);
