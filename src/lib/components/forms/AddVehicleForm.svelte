<script lang="ts">
	import { showErrorToast } from '$lib/helpers/toaster';
	import { addVehicle } from '$lib/helpers/vehicles';
	import { session } from '$lib/stores/auth';
	import { t } from '$lib/translations/translations';
	import { validator } from '@felte/validator-zod';
	import { Plus, XIcon } from '@lucide/svelte';
	import { createForm } from 'felte';
	import { z } from 'zod';
	import Form from '../ui/Form.svelte';
	import FormItem from '../ui/FormItem.svelte';
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let isLoading = $state(false);

	const schema = z.object({
		licensePlate: z
			.string({ message: 'common.errors.required' })
			.regex(/^[A-Z0-9\s-]{1,9}$/, 'common.errors.enterValidLicensePlate')
	});

	type FormValues = z.infer<typeof schema>;

	const { form, errors, data } = createForm<FormValues>({
		extend: validator({ schema }),
		onSubmit: (values) => {
			sendAddVehicleRequest(values.licensePlate);
		}
	});

	let { closePopUp } = $props();

	async function sendAddVehicleRequest(licensePlate: string) {
		if (!$session?.user.id || !licensePlate) {
			return;
		}

		isLoading = true;

		addVehicle(licensePlate, $session.user.id)
			.then(() => {
				closePopUp();
			})
			.catch((error) => showErrorToast({ error }))
			.finally(() => {
				isLoading = false;
			});
	}

	function capitalize(e: Event & { currentTarget: HTMLInputElement }) {
		const start = e.currentTarget?.selectionStart;
		$data.licensePlate = $data.licensePlate.toUpperCase();

		setTimeout(() => {
			e.currentTarget?.setSelectionRange(start, start);
		}, 0);
	}
</script>

<Form {form}>
	<FormItem label={$t('common.licensePlate')} errors={$errors.licensePlate}>
		<Input placeholder="EV7394" bind:value={$data.licensePlate} oninput={capitalize} />
	</FormItem>
	<PopUpButtons>
		{#snippet primaryButton()}
			<Button type="submit" label={$t('common.addVehicle')} icon={Plus} {isLoading} />
		{/snippet}
		{#snippet secondaryButton()}
			<Button preset="tonal" icon={XIcon} label={$t('common.cancel')} onclick={closePopUp} />
		{/snippet}
	</PopUpButtons>
</Form>
