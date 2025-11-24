import { getVehiclesByUserId } from '$lib/helpers/vehicles';
import type { Vehicle } from '$lib/types/vehicles';
import { derived, writable } from 'svelte/store';
import { session } from './auth';
import preferences from '$lib/helpers/preferences';

const vehiclesStore = (() => {
	const { subscribe, set, update } = writable<Array<Vehicle>>([]);

	async function getInitialVehicles(userId: string) {
		if (!session) {
			return [];
		}

		let vehicles: Vehicle[] | null = await preferences.get('vehicles');

		if (!vehicles) vehicles = (await getVehiclesByUserId(userId)) || [];

		preferences.set('vehicles', vehicles);
		vehiclesStore.set(vehicles);
	}

	function removeVehicle(id: number) {
		update((items) => {
			const updatedVehicles = items.filter((v) => v.id !== id);
			preferences.set('vehicles', updatedVehicles);

			return updatedVehicles;
		});
	}

	function addVehicle(vehicle: Vehicle) {
		const updatedVehicles = update((items) => [...items, vehicle]);
		preferences.set('vehicles', updatedVehicles);

		return updatedVehicles;
	}

	function clearVehicles() {
		vehiclesStore.set([]);
		preferences.remove('vehicles');
	}

	return {
		subscribe,
		set,
		update,
		add: (vehicle: Vehicle) => addVehicle(vehicle),
		remove: (id: Vehicle['id']) => removeVehicle(id),
		init: (userId: string) => getInitialVehicles(userId),
		clear: () => clearVehicles()
	};
})();

export default vehiclesStore;
export const vehiclesMap = derived(
	vehiclesStore,
	(vehicles) => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]))
);
