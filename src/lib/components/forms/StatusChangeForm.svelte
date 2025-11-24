<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import FormItem from '$lib/components/ui/FormItem.svelte';
	import Selector from '$lib/components/ui/Selector.svelte';
	import { AppointmentStatusEnum } from '$lib/enums/appointments';
	import { changeAppointmentStatus } from '$lib/helpers/appointments';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { t } from '$lib/translations/translations';
	import { validator } from '@felte/validator-zod';
	import { Save, XIcon } from '@lucide/svelte';
	import { createForm } from 'felte';
	import z from 'zod';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let { appointment, onchange, closePopUp } = $props();
	let isLoading = $state(false);

	const statusOptions = [
		{ label: `common.${AppointmentStatusEnum.pending}`, value: AppointmentStatusEnum.pending },
		{ label: `common.${AppointmentStatusEnum.completed}`, value: AppointmentStatusEnum.completed },
		{ label: `common.${AppointmentStatusEnum.canceled}`, value: AppointmentStatusEnum.canceled }
	];

	const schema = z.object({
		status: z.nativeEnum(AppointmentStatusEnum)
	});

	const { form, errors, data } = createForm({
		extend: validator({ schema }),
		initialValues: {
			status: appointment.status
		},
		onSubmit: async (values) => {
			isLoading = true;
			changeAppointmentStatus(appointment.id, values.status)
				.then(() => {
					onchange(values.status);
					closePopUp();
				})
				.catch((error) => {
					showErrorToast({ error });
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});
</script>

<Form {form}>
	<FormItem label={$t('common.selectNewStatus')} errors={$errors.status}>
		<Selector options={statusOptions} bind:value={$data.status} />
	</FormItem>
	<PopUpButtons>
		{#snippet primaryButton()}
			<Button type="submit" icon={Save} label={$t('common.save')} />
		{/snippet}
		{#snippet secondaryButton()}
			<Button
				type="button"
				icon={XIcon}
				preset="tonal"
				label={$t('common.cancel')}
				onclick={() => closePopUp()}
			/>
		{/snippet}
	</PopUpButtons>
</Form>
