import { locale } from '$lib/translations/translations';
import { get } from 'svelte/store';

export const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function getDateLabel(date: Date = new Date()): string {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const dateToCheck = new Date(date);
	dateToCheck.setHours(0, 0, 0, 0);

	if (dateToCheck.getTime() === today.getTime()) {
		return 'common.today';
	}

	if (dateToCheck.getTime() === tomorrow.getTime()) {
		return 'common.tomorrow';
	}

	return `common.${days[dateToCheck.getDay()]}`;
}

export function formatDateTime(dbDate: string) {
	const date = new Date(dbDate);

	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return date.toLocaleDateString() + ' ' + hours + ':' + minutes;
}

export function formatDate(dbDate: string) {
	const date = new Date(dbDate);
	return date.toLocaleDateString('ru');
}

export function formatAppointmentDateTime(dateString: string) {
	const date = new Date(dateString);
	const currentLocale = get(locale);
	// Format date as "10 October"
	const formattedDate = date.toLocaleDateString(currentLocale, {
		day: 'numeric',
		month: 'long'
	});

	// Format time as "18:00"
	const formattedTime = date.toLocaleTimeString(currentLocale, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	return {
		date: formattedDate,
		time: formattedTime
	};
}

// Gets hours from HH:mm:ss
export const getHoursFromTime = (time: string) => Number(time.split(':')[0]);

export const createDateWithTime = (dateObj: Date, timeString: string, offsetHours: number) => {
	const [h, m, s] = timeString.split(':').map(Number);
	return new Date(new Date(dateObj).setHours(h + offsetHours, m, s, 0));
};

// Returns new Date object with 00:00:00 time set
export const setTimeToMidnight = (date: Date) => {
	const newDate = new Date(date);
	newDate.setHours(0);
	newDate.setMinutes(0);
	newDate.setSeconds(0);

	return newDate;
};

// Function that substracts days from the given date
export function subtractDays(date: Date, days = 7) {
	const result = new Date(date);
	result.setDate(result.getDate() - days);

	return result;
}
