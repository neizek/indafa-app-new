<script lang="ts">
	import { user } from '$lib/stores/auth';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import z from 'zod';
	import FormItem from '../ui/FormItem.svelte';
	import Input from '../ui/Input.svelte';
	import Form from '../ui/Form.svelte';
	import Button from '../ui/Button.svelte';
	import { Check, XIcon } from '@lucide/svelte';
	import { openOTPVerificationPopUp, updateUser } from '$lib/helpers/auth';
	import { t } from '$lib/translations/translations';
	import PhoneInput from '../ui/PhoneInput.svelte';
	import { showErrorToast } from '$lib/helpers/toaster';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let { closePopUp } = $props();
	let isLoading: boolean = $state(false);

	const schema = z.object({
		firstName: z
			.string({ message: 'common.errors.required' })
			.min(1, 'common.errors.required')
			.max(36),
		lastName: z
			.string({ message: 'common.errors.required' })
			.min(1, 'common.errors.required')
			.max(36),
		phone: z
			.string({ message: 'common.errors.required' })
			.regex(/^\+[1-9]\d{1,14}$/, 'common.errors.enterValidPhone'),
		email: z.string({ message: 'common.errors.required' }).email('common.errors.enterValidEmail')
	});

	function preparePayload() {
		if (!$user) {
			return {};
		}

		const payload: Record<string, any> = { data: {} };

		if ($data.firstName !== $user.user_metadata.firstName) payload.data.firstName = $data.firstName;
		if ($data.lastName !== $user.user_metadata.lastName) payload.data.lastName = $data.lastName;
		if ($data.phone !== `+${$user.phone}`) payload.phone = $data.phone;
		if ($data.email !== $user.email) payload.email = $data.email;

		return payload;
	}

	const { form, errors, data } = createForm({
		extend: validator({ schema }),
		initialValues: {
			firstName: $user?.user_metadata.firstName,
			lastName: $user?.user_metadata.lastName,
			phone: $user?.phone ? `+${$user.phone}` : undefined,
			email: $user?.email
		},
		onSubmit: (values) => {
			isLoading = true;

			updateUser(preparePayload())
				.then(() => {
					if (values.phone !== `+${$user?.phone}`) {
						openOTPVerificationPopUp(values.phone, 'phone_change');
					}
					if (values.email !== $user?.email) {
						openOTPVerificationPopUp(values.email, 'email_change');
					}

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
	<FormItem label={$t('common.firstName')} errors={$errors.firstName}>
		<Input bind:value={$data.firstName} />
	</FormItem>
	<FormItem label={$t('common.lastName')} errors={$errors.lastName}>
		<Input bind:value={$data.lastName} />
	</FormItem>
	{#if !$user?.phone}
		<FormItem label={$t('common.mobilePhone')} errors={$errors.phone}>
			<PhoneInput bind:value={$data.phone} />
		</FormItem>
	{/if}
	{#if !$user?.email}
		<FormItem label={$t('common.email')} errors={$errors.email}>
			<Input bind:value={$data.email} />
		</FormItem>
	{/if}
	<PopUpButtons>
		{#snippet primaryButton()}
			<Button type="submit" label={$t('common.confirm')} icon={Check} {isLoading} />
		{/snippet}
		{#snippet secondaryButton()}
			<Button label={$t('common.cancel')} preset="tonal" icon={XIcon} full onclick={closePopUp} />
		{/snippet}
	</PopUpButtons>
</Form>
