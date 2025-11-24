import { getVehiclesByUserId } from '$lib/helpers/vehicles';
import type { Vehicle } from '$lib/types/vehicles';
import { derived, writable } from 'svelte/store';
import { session } from './auth';
import storage from '$lib/helpers/storage';

const vehiclesStore = (() => {
	const { subscribe, set, update } = writable<Array<Vehicle>>([]);

	async function getInitialVehicles(userId: string) {
		if (!session) {
			return [];
		}

		let vehicles: Vehicle[] | null = storage.get('vehicles');

		if (!vehicles) vehicles = (await getVehiclesByUserId(userId)) || [];

		storage.set('vehicles', vehicles);
		vehiclesStore.set(vehicles);
	}

	function removeVehicle(id: number) {
		update((items) => {
			const updatedVehicles = items.filter((v) => v.id !== id);
			storage.set('vehicles', updatedVehicles);

			return updatedVehicles;
		});
	}

	function addVehicle(vehicle: Vehicle) {
		const updatedVehicles = update((items) => [...items, vehicle]);
		storage.set('vehicles', updatedVehicles);

		return updatedVehicles;
	}

	function clearVehicles() {
		vehiclesStore.set([]);
		storage.remove('vehicles');
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
