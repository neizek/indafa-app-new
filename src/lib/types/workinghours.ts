export interface WorkingHoursPayload {
	day_of_week: number;
	car_wash_id: number;
	open_time: string;
	close_time: string;
}

export interface WorkingHoursEditPayload extends WorkingHoursPayload {
	id: number;
}

export type WorkingHours = WorkingHoursEditPayload;

export interface WorkingHoursExceptionPayload {
	car_wash_id: number;
	exception_date: string;
	open_time?: string;
	close_time?: string;
	reason?: string;
}

export interface WorkingHoursExceptionModel extends WorkingHoursExceptionPayload {
	id: number;
}
