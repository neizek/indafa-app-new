export interface CarWash {
	id: number;
	address: string;
	sport: string;
	phone: string;
	long: number;
	lat: number;
	working_hours: WorkingHour[];
	working_hours_exceptions: WorkingHourException[];
}

export interface WorkingHour {
	id: number;
	car_wash_id: number;
	day_of_week: number;
	open_time: string;
	close_time: string;
}

export interface WorkingHourException {
	id: number;
	car_wash_id: number;
	exception_date: string;
	open_time: string;
	close_time: string;
	reason?: string;
}
