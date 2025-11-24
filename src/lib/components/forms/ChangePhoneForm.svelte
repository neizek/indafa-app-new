<script lang="ts">
	import { createForm } from 'felte';
	import Form from '../ui/Form.svelte';
	import { t } from '$lib/translations/translations';
	import { validator } from '@felte/validator-zod';
	import { Check, XIcon } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import z from 'zod';
	import { user } from '$lib/stores/auth';
	import FormItem from '../ui/FormItem.svelte';
	import { openOTPVerificationPopUp, updateUser, updateUserEmailOrPhone } from '$lib/helpers/auth';
	import { showErrorToast } from '$lib/helpers/toaster';
	import PhoneInput from '../ui/PhoneInput.svelte';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let isLoading: boolean = $state(false);
	let { closePopUp } = $props();

	const schema = z.object({
		phone: z
			.string({ message: 'common.errors.required' })
			.regex(/^\+[1-9]\d{1,14}$/, 'common.errors.enterValidPhone')
	});

	const { form, errors, data } = createForm({
		extend: validator({ schema }),
		initialValues: {
			phone: $user?.phone ? `+${$user.phone}` : undefined
		},
		onSubmit: (values) => {
			isLoading = true;

			updateUserEmailOrPhone({ phone: values.phone })
				.catch((error) => showErrorToast({ error }))
				.then(() => {
					closePopUp();
					openOTPVerificationPopUp(values.phone, 'phone_change');
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});
</script>

<Form {form}>
	<FormItem label={$t('common.mobilePhone')} errors={$errors.phone}>
		<PhoneInput bind:value={$data.phone} />
	</FormItem>
	<PopUpButtons>
		{#snippet primaryButton()}
			<Button type="submit" label={$t('common.confirm')} icon={Check} {isLoading} />
		{/snippet}
		{#snippet secondaryButton()}
			<Button preset="tonal" label={$t('common.cancel')} icon={XIcon} onclick={closePopUp} />
		{/snippet}
	</PopUpButtons>
</Form>
