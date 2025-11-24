<script lang="ts">
	import { Calendar, Car, Clock, MapPin, Navigation, XIcon } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import { openCancelAppointmentPopUp } from '$lib/helpers/appointments';
	import { formatAppointmentDateTime } from '$lib/helpers/datetime';
	import Item from '../ui/Item.svelte';
	import { AppointmentStatusColorsEnum, AppointmentStatusEnum } from '$lib/enums/appointments';
	import type { FullAppointment } from '$lib/types/appointments';
	import Badge from '../ui/Badge.svelte';
	import Card from '../ui/Card.svelte';
	import { t } from '$lib/translations/translations';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let { appointment }: { appointment: FullAppointment } = $props();
	let { date, time } = formatAppointmentDateTime(appointment.start_time);
</script>

{#if appointment.carWash && appointment.vehicle}
	<Card>
		<div class="relative flex flex-col gap-2">
			<Badge
				label={$t(`common.${appointment.status}`)}
				clases="absolute right-0 {AppointmentStatusColorsEnum[appointment.status]}"
			/>
			<Item icon={Car} label={appointment.vehicle?.license_plate} />
			<Item icon={Clock} label={time} />
			<div class="flex justify-between">
				<Item icon={Calendar} label={date} />
				<Item icon={MapPin} label={appointment.carWash.address} />
			</div>
			{#if appointment.status === AppointmentStatusEnum.pending}
				<PopUpButtons>
					{#snippet primaryButton()}
						<Button
							label={$t('common.locate')}
							icon={Navigation}
							onclick={() => goto(`${ROUTES.MAP}#${appointment.carWash.id}`)}
						/>
					{/snippet}
					{#snippet secondaryButton()}
						<Button
							label={$t('common.cancelAppointment')}
							icon={XIcon}
							preset="cancel"
							onclick={() => openCancelAppointmentPopUp(appointment)}
						/>
					{/snippet}
				</PopUpButtons>
			{/if}
		</div>
	</Card>
{/if}
