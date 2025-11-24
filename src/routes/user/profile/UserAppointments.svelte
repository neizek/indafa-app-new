<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import AppointmentCard from '$lib/components/widgets/AppointmentCard.svelte';
	import appointmentsStore from '$lib/stores/appointments';
	import { carWashesMap } from '$lib/stores/carWashes';
	import { vehiclesMap } from '$lib/stores/vehicles';
	import { t } from '$lib/translations/translations';
	import type { FullAppointment } from '$lib/types/appointments';
	import { derived, type Readable } from 'svelte/store';

	const fullAppointments: Readable<FullAppointment[]> = derived(appointmentsStore, (items) =>
		items.flatMap((appointment) => {
			const carWash = $carWashesMap.get(appointment.car_wash_id);
			const vehicle = $vehiclesMap.get(appointment.vehicle_id);

			if (!carWash || !vehicle) {
				return [];
			}

			return {
				...appointment,
				carWash,
				vehicle
			};
		})
	);
</script>

<div class="flex flex-col gap-4">
	{#if $fullAppointments && $fullAppointments.length === 0}
		<Card>
			<span>{$t('common.youDontHaveAnyAppointments')}</span>
		</Card>
	{/if}
	{#each $fullAppointments as appointment}
		<AppointmentCard {appointment} />
	{/each}
</div>
