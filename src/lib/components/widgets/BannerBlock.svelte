<script lang="ts">
	import {
		getCanceledByAdminAppointments,
		removeCanceledByAdminAppointments
	} from '$lib/helpers/appointments';
	import appointmentsStore from '$lib/stores/appointments';
	import { TriangleAlert, XIcon } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import Section from '../ui/Section.svelte';
	import { t } from '$lib/translations/translations';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { onMount } from 'svelte';

	const myAppointmentsIds = $appointmentsStore.map((appointment) => appointment.id);
	let isLoading = $state(false);

	let canceledAppointments = $state<any[] | null>(null);

	function loadAppointments() {
		getCanceledByAdminAppointments(myAppointmentsIds).then((appointments) => {
			canceledAppointments = appointments;
		});
	}

	function onRemoveBanner() {
		isLoading = true;
		removeCanceledByAdminAppointments(myAppointmentsIds)
			.then(() => {
				canceledAppointments = null;
			})
			.catch((error) => {
				showErrorToast({ error });
			})
			.finally(() => (isLoading = false));
	}

	onMount(() => {
		loadAppointments();
	});
</script>

{#if canceledAppointments && canceledAppointments.length > 0}
	<Section header={$t('common.info')}>
		<div class="flex items-center gap-4">
			<TriangleAlert size={48} class="text-error-500" />
			<span class="">
				{$t('common.someAppointmentsCanceledByAdmin')}
			</span>
		</div>
		<Button
			icon={XIcon}
			preset="cancel"
			label={$t('common.closeNotification')}
			full={false}
			{isLoading}
			onclick={onRemoveBanner}
		/>
	</Section>
{/if}
