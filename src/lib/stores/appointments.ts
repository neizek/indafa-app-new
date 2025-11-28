import { type Appointment } from '$lib/types/appointments';
import { get, writable } from 'svelte/store';
import { session } from './auth';
import { getUserAppointments } from '$lib/helpers/appointments';
import { AppointmentStatusEnum } from '$lib/enums/appointments';
import { LocalNotifications } from '@capacitor/local-notifications';
import { t } from '$lib/translations/translations';
import { formatAppointmentDateTime } from '$lib/helpers/datetime';

// TO BE IMPROVED - notifications

const appointmentsStore = (() => {
	const { subscribe, set, update } = writable<Array<Appointment>>([]);

	async function getInitialAppointments() {
		if (!get(session)) {
			return [];
		}

		const id = get(session)?.user.id;

		if (!id) {
			return [];
		}

		const appointments: Appointment[] = (await getUserAppointments(id)) || [];

		appointmentsStore.set(appointments);

		const pending = await LocalNotifications.getPending();
		await LocalNotifications.cancel(pending);

		const pendingAppointments = appointments.filter(
			(appointment) => appointment.status === AppointmentStatusEnum.pending
		);

		LocalNotifications.schedule({
			notifications: pendingAppointments.map((appointment) => ({
				title: get(t)('common.appointmentReminder'),
				body: get(t)('common.appointmentReminderText', {
					time: formatAppointmentDateTime(appointment.start_time).time
				}),
				id: appointment.id,
				schedule: {
					at: new Date(new Date(appointment.start_time).getTime() - 30 * 60 * 1000),
					allowWhileIdle: true
				}
			}))
		});
	}

	function addAppointment(appointment: Appointment) {
		const updatedVehicles = update((items) => [...items, appointment]);

		LocalNotifications.schedule({
			notifications: [
				{
					title: get(t)('common.appointmentReminder'),
					body: get(t)('common.appointmentReminderText', {
						time: formatAppointmentDateTime(appointment.start_time).time
					}),
					id: appointment.id,
					schedule: {
						at: new Date(new Date(appointment.start_time).getTime() - 30 * 60 * 1000),
						allowWhileIdle: true
					}
				}
			]
		});

		return updatedVehicles;
	}

	function cancelAppointment(id: number) {
		update((items) =>
			items.map((item) =>
				item.id === id ? { ...item, status: AppointmentStatusEnum.canceled } : item
			)
		);

		LocalNotifications.cancel({ notifications: [{ id }] });
	}

	return {
		subscribe,
		set,
		update,
		add: (appointment: Appointment) => addAppointment(appointment),
		cancel: (id: number) => cancelAppointment(id),
		init: async () => await getInitialAppointments(),
		remove: (id: number) => update((items) => items.filter((item) => item.id !== id)),
		clear: () => set([])
	};
})();

export default appointmentsStore;
