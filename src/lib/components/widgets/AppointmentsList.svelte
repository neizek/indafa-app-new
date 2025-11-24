<script lang="ts">
	import FormItem from '$lib/components/ui/FormItem.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import Selector from '$lib/components/ui/Selector.svelte';
	import { getOperatorAppointmentsByDate } from '$lib/helpers/appointments';
	import { formatAppointmentDateTime } from '$lib/helpers/datetime';
	import { carWashes, carWashesMap, carWashesOptions } from '$lib/stores/carWashes';
	import { createPopUp } from '$lib/stores/popUp';
	import { Trash, UserSearch } from '@lucide/svelte';
	import CustomerDetails from './CustomerDetails.svelte';
	import type { SelectOption } from '$lib/types/ui';
	import { getWorkingDatesOptions } from '$lib/helpers/carWashes';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { AppointmentStatusColorsEnum, type AppointmentStatusEnum } from '$lib/enums/appointments';
	import { t } from '$lib/translations/translations';
	import type { OperatorAppointment } from '$lib/types/appointments';
	import StatusChangeForm from '../forms/StatusChangeForm.svelte';
	import DeleteAppointmentForm from '../forms/DeleteAppointmentForm.svelte';
	import BookedTimes from './BookedTimes.svelte';
	import { showErrorToast } from '$lib/helpers/toaster';
	import DateInput from '../ui/DateInput.svelte';
	import { onMount } from 'svelte';

	let { adminMode } = $props();

	let selectedCarWashId = $state($carWashes[0].id);
	let selectedDate: Date = $state(new Date());
	let appointments: OperatorAppointment[] = $state([]);
	let isLoadingAppointments = $state(false);

	let dateOptions: SelectOption[] = $derived.by(() => {
		const chosenCarWash = $carWashesMap.get(selectedCarWashId);
		return chosenCarWash ? getWorkingDatesOptions(chosenCarWash, true) : [];
	});

	async function getAppointments() {
		if (selectedDate && selectedCarWashId) {
			isLoadingAppointments = true;
			getOperatorAppointmentsByDate(selectedDate, selectedCarWashId)
				.then((data) => {
					appointments = data;
				})
				.catch((error) => {
					showErrorToast({ error });
				})
				.finally(() => {
					isLoadingAppointments = false;
				});
		} else {
			appointments = [];
		}
	}

	function openCustomerDetailsPopUp(userId: string) {
		createPopUp({
			title: $t('common.customerContacts'),
			content: {
				component: CustomerDetails,
				props: {
					userId
				}
			}
		});
	}

	function openDeleteAppointmentPopUp(appointment: any) {
		createPopUp({
			title: `${$t('common.delete')} ${$t('common.appointment').toLowerCase()}`,
			content: {
				component: DeleteAppointmentForm,
				props: {
					appointment,
					onDelete: () => getAppointments()
				}
			}
		});
	}

	function openStatusChangePopUp(appointment: any) {
		createPopUp({
			title: $t('common.changeAppointmentStatus'),
			content: {
				component: StatusChangeForm,
				props: {
					appointment,
					onchange: (newStatus: AppointmentStatusEnum) =>
						(appointments = appointments.map((item) =>
							item.id === appointment.id ? { ...item, status: newStatus } : item
						))
				}
			}
		});
	}

	async function onChangeDateOrCarWash() {
		getAppointments();
	}

	onMount(() => {
		getAppointments();
	});
</script>

<Section>
	<FormItem label={$t('common.selectCarWash')}>
		<Selector
			options={$carWashesOptions}
			bind:value={selectedCarWashId}
			onchange={onChangeDateOrCarWash}
		/>
	</FormItem>
	<FormItem label={$t('common.selectDate')}>
		{#if !adminMode}
			<Selector options={dateOptions} bind:value={selectedDate} onchange={onChangeDateOrCarWash} />
		{:else}
			<DateInput bind:value={selectedDate} onchange={onChangeDateOrCarWash} />
		{/if}
	</FormItem>
</Section>

{#if selectedDate && selectedCarWashId}
	<Section>
		<BookedTimes date={selectedDate} carWash={$carWashesMap.get(selectedCarWashId)} />
	</Section>
{/if}

<Section header={$t('common.appointments')}>
	{#if isLoadingAppointments}
		<div class="w-full space-y-2">
			<div class="placeholder animate-pulse"></div>
			<div class="placeholder animate-pulse"></div>
			<div class="placeholder animate-pulse"></div>
		</div>
	{:else}
		{#if !selectedDate}
			<span>{$t('common.selectDate')}</span>
		{:else if appointments && appointments.length === 0}
			<span>{$t('common.noAppointmentsForThisDay')}</span>
		{/if}
		{#each appointments as appointment}
			{@const { date, time } = formatAppointmentDateTime(appointment.start_time)}
			<div class="flex items-center justify-between gap-4">
				<span>{time}</span>
				<span>{appointment.vehicle.license_plate}</span>
				<div class="flex gap-4">
					<Badge
						label={$t(`common.${appointment.status}`)}
						clases={AppointmentStatusColorsEnum[appointment.status]}
						onclick={() => openStatusChangePopUp(appointment)}
					/>
					<button
						class="bg-transparent"
						onclick={() => openCustomerDetailsPopUp(appointment.user_id)}
					>
						<UserSearch size={20} />
					</button>
					{#if adminMode}
						<button class="bg-transparent" onclick={() => openDeleteAppointmentPopUp(appointment)}>
							<Trash size={20} />
						</button>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</Section>
