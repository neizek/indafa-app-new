import CancelAppointmentForm from '$lib/components/forms/CancelAppointmentForm.svelte';
import supabase from '$lib/helpers/db';
import { AppointmentStatusEnum } from '$lib/enums/appointments';
import appointmentsStore from '$lib/stores/appointments';
import { createPopUp } from '$lib/stores/popUp';
import {
	type Appointment,
	type AppointmentPayload,
	type BookingAppointmentPayload,
	type OperatorAppointment
} from '$lib/types/appointments';
import type { SelectOption } from '$lib/types/ui';
import type { CarWash } from '$lib/types/carWashes';
import { getHoursFromTime } from './datetime';

async function createAppointment(payload: AppointmentPayload) {
	const { data, error } = await supabase
		.from('appointment')
		.insert([
			{
				...payload
			}
		])
		.select();

	if (error) {
		console.error('Error adding appointment:', error);
		throw error;
	}

	appointmentsStore.add(data[0]);
	return data;
}

async function cancelAppointment(id: number) {
	const { data, error } = await supabase
		.from('appointment')
		.update({
			status: AppointmentStatusEnum.canceled
		})
		.eq('id', id)
		.select();

	if (error) {
		console.error('Error canceling appointment:', error);
		throw error;
	}

	appointmentsStore.cancel(id);
	return data;
}

async function changeAppointmentStatus(id: number, status: AppointmentStatusEnum) {
	const { data, error } = await supabase
		.from('appointment')
		.update({
			status
		})
		.eq('id', id)
		.select();

	if (error) {
		console.error('Error changing appointment status:', error);
		throw error;
	}

	appointmentsStore.update((items) =>
		items.map((item) => (item.id === id ? { ...item, status } : item))
	);
	return data;
}

async function removeAppointment(id: number) {
	const { data, error } = await supabase.from('appointment').delete().eq('id', id).select();

	if (error) {
		console.error('Error removing appointment:', error);
		throw error;
	}

	appointmentsStore.remove(id);
	return data;
}

async function getUserAppointments(id: string) {
	const { data, error } = await supabase
		.from('appointment')
		.select('*')
		.eq('user_id', id)
		.order('start_time', { ascending: false });

	if (error) {
		console.error('Error fetching appointments:', error);
		throw error;
	}

	return data;
}

async function getAppointmentsByDate(
	date: Date,
	carWashId: number,
	onlyPending?: boolean
): Promise<Appointment[]> {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	let query = supabase
		.from('appointment')
		.select('*')
		.gte('start_time', startOfDay.toISOString())
		.lte('start_time', endOfDay.toISOString())
		.eq('car_wash_id', carWashId)
		.order('start_time');

	if (onlyPending) {
		query = query.eq('status', AppointmentStatusEnum.pending);
	}

	const { data, error } = await query;

	if (error) {
		console.error('Error fetching appointments:', error);
		throw error;
	}

	return data;
}

async function getBookedTimesByDate(date: Date, carWashId: number) {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const { data, error } = await supabase
		.from('booked_times')
		.select('*')
		.gte('start_time', startOfDay.toISOString())
		.lte('start_time', endOfDay.toISOString())
		.eq('car_wash_id', carWashId)
		.order('start_time');

	if (error) {
		console.error('Error fetching appointments:', error);
		throw error;
	}

	return data;
}

async function createBookingTime(payload: BookingAppointmentPayload) {
	const { data, error } = await supabase
		.from('booked_times')
		.insert([
			{
				...payload
			}
		])
		.select();

	if (error) {
		console.error('Error adding booking:', error);
		throw error;
	}

	return data;
}

async function removeBookingTime(startTime: string) {
	const { data, error } = await supabase
		.from('booked_times')
		.delete()
		.eq('start_time', startTime)
		.select();

	if (error) {
		console.error('Error removing booking:', error);
		throw error;
	}

	if (data && data.length === 0) {
		throw new Error('common.errors.timePassedOrBookedByCustomer');
	}

	return data;
}

async function getOperatorAppointmentsByDate(
	date: Date,
	carWashId: number
): Promise<OperatorAppointment[]> {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const { data, error } = await supabase
		.from('appointment')
		.select('*, vehicle:vehicle_id(*)')
		.gte('start_time', startOfDay.toISOString())
		.lte('start_time', endOfDay.toISOString())
		.eq('car_wash_id', carWashId)
		.order('start_time');

	if (error) {
		console.error('Error fetching appointments:', error);
		throw error;
	}

	return data;
}

function openCancelAppointmentPopUp(appointment: Appointment) {
	createPopUp({
		title: 'common.cancelAppointment',
		content: {
			component: CancelAppointmentForm,
			props: {
				appointment
			}
		}
	});
}

// #region Other

async function getAvaliableTimes(
	carWash: CarWash,
	date: Date,
	onlyPending?: boolean
): Promise<SelectOption[]> {
	let timeOptions = [];

	const thisDateWorkingHours = carWash?.working_hours.find(
		(wh) => wh.day_of_week === date.getDay()
	);

	if (
		!thisDateWorkingHours ||
		!thisDateWorkingHours.open_time ||
		!thisDateWorkingHours.close_time
	) {
		return [];
	}
	const openTime = getHoursFromTime(thisDateWorkingHours.open_time);
	const closeTime = getHoursFromTime(thisDateWorkingHours.close_time);

	const [thisDateAppointments, thisDateBookedTimes] = await Promise.all([
		getAppointmentsByDate(date, carWash.id, onlyPending),
		getBookedTimesByDate(date, carWash.id)
	]);

	const bookedTimes: number[] = [...thisDateAppointments, ...thisDateBookedTimes].map(
		(reservation) => new Date(reservation.start_time).getHours()
	);

	timeOptions =
		(await createTimeOptions(
			new Date(date.setHours(openTime, 0, 0, 0)),
			new Date(date.setHours(closeTime, 0, 0, 0)),
			60,
			bookedTimes
		)) ?? [];

	return timeOptions;
}

async function createTimeOptions(
	from: Date,
	to: Date,
	intervalMinutes: number,
	bookedTimes: number[]
) {
	const options = [];
	const current = new Date(from);

	while (current < to) {
		const hours = current.getHours().toString().padStart(2, '0');
		const minutes = current.getMinutes().toString().padStart(2, '0');
		const timeString = `${hours}:${minutes}`;
		options.push({
			value: current.getHours(),
			label: timeString,
			disabled:
				bookedTimes.includes(Number(hours)) || current < new Date(Date.now() + 60 * 60 * 1000)
		});
		current.setMinutes(current.getMinutes() + intervalMinutes);
	}

	return options as SelectOption[];
}

// #endregion

// #region Export

export {
	createAppointment,
	getUserAppointments,
	getAppointmentsByDate,
	getBookedTimesByDate,
	createBookingTime,
	removeBookingTime,
	getOperatorAppointmentsByDate,
	openCancelAppointmentPopUp,
	cancelAppointment,
	removeAppointment,
	changeAppointmentStatus,
	getAvaliableTimes
};
