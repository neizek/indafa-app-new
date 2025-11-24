<script lang="ts">
	import ScrollableSection from '$lib/components/ui/ScrollableSection.svelte';
	import AppointmentCard from '$lib/components/widgets/AppointmentCard.svelte';
	import { AppointmentStatusEnum } from '$lib/enums/appointments';
	import appointmentsStore from '$lib/stores/appointments';
	import { carWashesMap } from '$lib/stores/carWashes';
	import { vehiclesMap } from '$lib/stores/vehicles';
	import { t } from '$lib/translations/translations';
	import { type FullAppointment } from '$lib/types/appointments';
	import { derived, type Readable } from 'svelte/store';

	const upcomingAppointments: Readable<FullAppointment[]> = derived(appointmentsStore, (items) =>
		items
			.filter(
				(appointment) =>
					appointment.status === AppointmentStatusEnum.pending &&
					new Date(appointment.start_time) > new Date()
			)
			.flatMap((appointment) => {
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

<ScrollableSection
	header={$t('common.appointments')}
	noItemsText={$t('common.youDontHaveAnyAppointments')}
	items={$upcomingAppointments}
>
	{#snippet itemRenderer(appointment)}
		<AppointmentCard {appointment} />
	{/snippet}
</ScrollableSection>
