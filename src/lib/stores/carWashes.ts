import { derived, writable, type Readable } from 'svelte/store';
import type { CarWash } from '../types/carWashes';
import { getCarWashes } from '$lib/helpers/carWashes';
import type { SelectOption } from '$lib/types/ui';
import storage from '$lib/helpers/storage';

async function initCarWashes(): Promise<CarWash[]> {
	let carWashes = storage.get('carWashes') as CarWash[];

	if (!carWashes) {
		carWashes = await getCarWashes();
		storage.set('carWashes', carWashes, 86400000);
	}

	return carWashes;
}

export const carWashes = writable<Array<CarWash>>(await initCarWashes());
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
