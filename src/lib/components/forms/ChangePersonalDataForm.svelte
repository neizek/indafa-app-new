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
	import { updateUser } from '$lib/helpers/auth';
	import { showErrorToast } from '$lib/helpers/toaster';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let isLoading: boolean = $state(false);
	let { closePopUp } = $props();

	const schema = z.object({
		firstName: z
			.string({ message: 'common.errors.required' })
			.min(1, 'common.errors.required')
			.max(36),
		lastName: z
			.string({ message: 'common.errors.required' })
			.min(1, 'common.errors.required')
			.max(36)
	});

	function preparePayload() {
		if (!$user) {
			return {};
		}

		const payload: Record<string, any> = { data: {} };

		if ($data.firstName !== $user.user_metadata.firstName) payload.data.firstName = $data.firstName;
		if ($data.lastName !== $user.user_metadata.lastName) payload.data.lastName = $data.lastName;

		return payload;
	}

	const { form, errors, data } = createForm({
		extend: validator({ schema }),
		initialValues: {
			firstName: $user?.user_metadata.firstName,
			lastName: $user?.user_metadata.lastName
		},
		onSubmit: (values) => {
			isLoading = true;

			updateUser(preparePayload())
				.catch((error) => showErrorToast({ error }))
				.then(() => {
					closePopUp();
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});
</script>

<Form {form}>
	<FormItem label={$t('common.firstName')} errors={$errors.firstName}>
		<Input type="text" placeholder="Jānis" bind:value={$data.firstName} />
	</FormItem>
	<FormItem label={$t('common.lastName')} errors={$errors.lastName}>
		<Input type="text" placeholder="Bērziņš" bind:value={$data.lastName} />
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
