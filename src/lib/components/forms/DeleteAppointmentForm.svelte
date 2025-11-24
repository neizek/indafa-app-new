<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { removeAppointment } from '$lib/helpers/appointments';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { t } from '$lib/translations/translations';
	import { Trash, XIcon } from '@lucide/svelte';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let { appointment, onDelete, closePopUp } = $props();
	let isLoading = $state(false);

	function onConfirm() {
		isLoading = true;
		removeAppointment(appointment.id)
			.then(() => {
				onDelete();
				closePopUp();
			})
			.catch((error) => {
				showErrorToast({
					error
				});
			})
			.finally(() => {
				isLoading = false;
			});
	}

	function onCancel() {
		closePopUp();
	}
</script>

<div class="flex flex-col gap-4">
	<span>{$t('common.doYouWantToDeleteAppointment')}</span>
	<PopUpButtons>
		{#snippet primaryButton()}
			<Button
				label={$t('common.delete')}
				preset="cancel"
				onclick={onConfirm}
				icon={Trash}
				{isLoading}
			/>
		{/snippet}
		{#snippet secondaryButton()}
			<Button label={$t('common.cancel')} preset="tonal" icon={XIcon} onclick={onCancel} />
		{/snippet}
	</PopUpButtons>
</div>
