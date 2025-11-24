<script lang="ts">
	import { createForm } from 'felte';
	import Form from '../ui/Form.svelte';
	import { t } from '$lib/translations/translations';
	import { validator } from '@felte/validator-zod';
	import { Check, XIcon } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import z from 'zod';
	import { user } from '$lib/stores/auth';
	import Input from '../ui/Input.svelte';
	import FormItem from '../ui/FormItem.svelte';
	import { openOTPVerificationPopUp, updateUserEmailOrPhone } from '$lib/helpers/auth';
	import { showErrorToast } from '$lib/helpers/toaster';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let isLoading: boolean = $state(false);
	let { closePopUp } = $props();

	const schema = z.object({
		email: z.string({ message: 'common.errors.required' }).email('common.errors.enterValidEmail')
	});

	const { form, errors, data } = createForm({
		extend: validator({ schema }),
		initialValues: {
			email: $user?.email ?? undefined
		},
		onSubmit: (values) => {
			isLoading = true;

			updateUserEmailOrPhone({ email: values.email })
				.catch((error) => showErrorToast({ error }))
				.then(() => {
					closePopUp();
					openOTPVerificationPopUp(values.email, 'email_change');
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});
</script>

<Form {form}>
	<FormItem label={$t('common.email')} errors={$errors.email}>
		<Input type="text" placeholder="janis.berzins@gmail.com" bind:value={$data.email} />
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
