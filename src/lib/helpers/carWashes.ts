import CarWashDetails from '$lib/components/widgets/CarWashDetails.svelte';
import supabase from '$lib/helpers/db';
import { createPopUp } from '$lib/stores/popUp';
import type { CarWash } from '$lib/types/carWashes';
import type { SelectOption } from '$lib/types/ui';
import { Bubbles } from '@lucide/svelte';
import { createDateWithTime, formatAppointmentDateTime, getDateLabel } from './datetime';

export async function getCarWashes(): Promise<Array<CarWash>> {
	const { data, error } = await supabase
		.from('car_wash')
		.select('*, working_hours(*), working_hours_exceptions(*)');

	if (error) {
		console.error('Error fetching car washes:', error);
		throw error;
	}

	return data ?? [];
}

export function getWorkingDatesOptions(
	carWash: CarWash,
	pushToday: boolean = false
): SelectOption[] {
	let dateOptions: SelectOption[] = [];

	for (let i = 0; dateOptions.length < 2; i++) {
		if (i === 10) break;
		const date = new Date();
		date.setDate(date.getDate() + i);
		const wh = carWash.working_hours.find((wh) => wh.day_of_week === date.getDay());

		if (!wh) {
			continue;
		}

		if (
			carWash.working_hours_exceptions &&
			carWash.working_hours_exceptions.some(
				(whe) => new Date(whe.exception_date).toDateString() === date.toDateString()
			)
		) {
			continue;
		}

		if (createDateWithTime(date, wh.close_time, -3) > new Date() || pushToday) {
			const { date: dateString } = formatAppointmentDateTime(date.toISOString());

			dateOptions = [
				...dateOptions,
				{
					value: date,
					label: getDateLabel(date),
					caption: dateString
				}
			];
		}
	}

	return dateOptions;
}

export function openCarWashDetailsPopUp(carWash: CarWash) {
	createPopUp({
		title: 'common.carWashDetails',
		content: {
			component: CarWashDetails,
			props: { carWash }
		},
		icon: Bubbles
	});
}
