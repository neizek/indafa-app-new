import type {
	WorkingHours,
	WorkingHoursEditPayload,
	WorkingHoursExceptionModel,
	WorkingHoursExceptionPayload,
	WorkingHoursPayload
} from '$lib/types/workinghours';
import supabase from './db';

const workingHours = {
	async get(carWashId: number): Promise<WorkingHours[]> {
		const { data, error } = await supabase
			.from('working_hours')
			.select('*')
			.eq('car_wash_id', carWashId);

		if (error) {
			throw error;
		}

		return data;
	},
	async add(payload: WorkingHoursPayload[]) {
		const { data, error } = await supabase.from('working_hours').insert(payload).select();

		if (error) {
			throw error;
		}

		return data;
	},
	async update(payload: WorkingHoursEditPayload) {
		const { data, error } = await supabase
			.from('working_hours')
			.update(payload)
			.eq('id', payload.id)
			.select();

		if (error) {
			throw error;
		}

		return data;
	},
	async remove(id: number) {
		const { error } = await supabase.from('working_hours').delete().eq('id', id);

		if (error) {
			throw error;
		}
	}
};

const workingHoursExceptions = {
	async get(carWashId: number): Promise<WorkingHoursExceptionModel[]> {
		const { data, error } = await supabase
			.from('working_hours_exceptions')
			.select('*')
			.eq('car_wash_id', carWashId);

		if (error) {
			throw error;
		}

		return data;
	},
	async add(payload: WorkingHoursExceptionPayload[]) {
		const { data, error } = await supabase
			.from('working_hours_exceptions')
			.insert(payload)
			.select();

		if (error) {
			throw error;
		}

		return data;
	},
	async remove(id: number) {
		const { error } = await supabase.from('working_hours_exceptions').delete().eq('id', id);

		if (error) {
			throw error;
		}
	}
};

export { workingHours, workingHoursExceptions };
