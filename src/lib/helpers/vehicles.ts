import supabase from '$lib/helpers/db';
import { createPopUp } from '$lib/stores/popUp';
import vehiclesStore from '$lib/stores/vehicles';
import { Car, Trash } from '@lucide/svelte';
import type { Vehicle } from '$lib/types/vehicles';
import AddVehicleForm from '$lib/components/forms/AddVehicleForm.svelte';
import DeleteVehicleForm from '../components/forms/DeleteVehicleForm.svelte';

// Working with database

async function addVehicle(licensePlate: string, userId: string) {
	// Check if exists
	const { data: existing, error: existingError } = await supabase
		.from('vehicle')
		.select('id, user_id')
		.eq('license_plate', licensePlate)
		.maybeSingle();

	if (existingError) {
		console.log('Error checking if vehicle exist', existingError);
		throw existingError;
	}

	if (existing && existing.user_id && existing.user_id !== userId) {
		throw new Error('common.errors.thisCarHasOwnerAlready');
	}

	// Try to claim existing vehicle with same plate and user_id is null
	const { data: claimed, error: claimError } = await supabase
		.from('vehicle')
		.update({ user_id: userId })
		.eq('license_plate', licensePlate)
		.is('user_id', null)
		.select()
		.maybeSingle();

	if (claimError) {
		console.error('Error claiming existing vehicle:', claimError);
		throw claimError;
	}

	if (claimed) {
		vehiclesStore.add(claimed);
		return claimed;
	}

	// If not existing and not claimed - insert
	if (!existing && !claimed) {
		const { data, error } = await supabase
			.from('vehicle')
			.insert({ user_id: userId, license_plate: licensePlate })
			.select();

		if (error) {
			console.log('Error adding vehicle', error);
			throw error;
		}

		vehiclesStore.add(data[0]);
		return data;
	}
}

async function removeVehicle(id: number) {
	const { error } = await supabase.from('vehicle').delete().eq('id', id);

	if (error) {
		console.error('Error removing vehicle:', error);

		if (error.message.includes('violates foreign key constraint')) {
			const { error } = await supabase
				.from('vehicle')
				.update({ user_id: null })
				.eq('id', id)
				.select();
			if (error) {
				throw error;
			}
		} else {
			throw error;
		}
	}

	vehiclesStore.remove(id);
}

async function getVehiclesByUserId(userId: string) {
	const { data, error } = await supabase.from('vehicle').select('*').eq('user_id', userId);

	if (error) {
		console.error('Error fetching vehicles:', error);
		throw error;
	}

	return data;
}

// PopUps

function openAddVehiclePopUp() {
	createPopUp({
		title: 'common.addVehicle',
		icon: Car,
		content: {
			component: AddVehicleForm
		}
	});
}

function openDeleteVehiclePopUp(vehicle: Vehicle) {
	createPopUp({
		title: 'common.deleteVehicle',
		icon: Trash,
		content: {
			component: DeleteVehicleForm,
			props: {
				vehicle
			}
		}
	});
}

// Other functons

export {
	addVehicle,
	removeVehicle,
	getVehiclesByUserId,
	openAddVehiclePopUp,
	openDeleteVehiclePopUp
};
