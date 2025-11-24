<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import FormItem from '$lib/components/ui/FormItem.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import PopUpButtons from '$lib/components/ui/PopUpButtons.svelte';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { workingHoursExceptions } from '$lib/helpers/workinghours';
	import { t } from '$lib/translations/translations';
	import { validator } from '@felte/validator-zod';
	import { Plus, XIcon } from '@lucide/svelte';
	import { createForm } from 'felte';
	import z from 'zod';

	let isLoading = $state(false);
	let { carWashId, onConfirm, closePopUp } = $props();
	let openTime = $state('');
	let closeTime = $state('');

	const schema = z.object({
		exceptionDate: z.date(),
		workingTime: z.tuple([z.string(), z.string()]).optional(),
		reason: z.string().optional()
	});

	type FormValues = z.infer<typeof schema>;

	const { form, errors, data } = createForm<FormValues>({
		extend: validator({ schema }),
		onSubmit: (values) => {
			isLoading = true;

			workingHoursExceptions
				.add([
					{
						car_wash_id: carWashId,
						exception_date: values.exceptionDate.toISOString(),
						open_time: values.workingTime ? values.workingTime[0] : undefined,
						close_time: values.workingTime ? values.workingTime[1] : undefined,
						reason: values.reason
					}
				])
				.catch((error) => showErrorToast({ error }))
				.then(() => {
					onConfirm();
					closePopUp();
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});

	$effect(() => {
		if (openTime && closeTime) $data.workingTime = [openTime, closeTime];
	});
</script>

<Form {form}>
	<FormItem label={$t('common.selectDate')} errors={$errors.exceptionDate}>
		<DateInput bind:value={$data.exceptionDate} />
	</FormItem>
	<FormItem label={$t('common.businessHours')} errors={$errors.workingTime} optional>
		<div class="flex gap-2">
			<Input type="time" bind:value={openTime} />
			<Input type="time" bind:value={closeTime} />
		</div>
	</FormItem>
	<FormItem label={$t('common.reason')} errors={$errors.reason} optional>
		<Input bind:value={$data.reason} />
	</FormItem>
	<PopUpButtons>
		{#snippet primaryButton()}
			<Button type="submit" label={$t('common.add')} icon={Plus} {isLoading} />
		{/snippet}
		{#snippet secondaryButton()}
			<Button preset="tonal" icon={XIcon} label={$t('common.cancel')} onclick={closePopUp} />
		{/snippet}
	</PopUpButtons>
</Form>
