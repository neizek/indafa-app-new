import { AppointmentStatusEnum } from '$lib/enums/appointments';
import { setTimeToMidnight } from './datetime';
import supabase from './db';

async function getAppointmentsCount(from: Date, to: Date) {
	const { count, error } = await supabase
		.from('appointment')
		.select('*', { count: 'exact', head: true })
		.gte('start_time', setTimeToMidnight(from).toISOString())
		.lte('start_time', setTimeToMidnight(to).toISOString());

	if (error) {
		console.error('Error counting appointments:', error);
		throw error;
	}

	return count;
}

async function getPendingAppointmentsCount() {
	const { count, error } = await supabase
		.from('appointment')
		.select('*', { count: 'exact', head: true })
		.eq('status', AppointmentStatusEnum.pending);

	if (error) {
		console.error('Error counting appointments:', error);
		throw error;
	}

	return count;
}

async function getCompletedAppointmentsCount() {
	const { count, error } = await supabase
		.from('appointment')
		.select('*', { count: 'exact', head: true })
		.eq('status', AppointmentStatusEnum.completed);

	if (error) {
		console.error('Error counting appointments:', error);
		throw error;
	}

	return count;
}

export { getAppointmentsCount, getPendingAppointmentsCount, getCompletedAppointmentsCount };
