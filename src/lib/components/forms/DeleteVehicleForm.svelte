<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { removeVehicle } from '$lib/helpers/vehicles';
	import { t } from '$lib/translations/translations';
	import { Trash, XIcon } from '@lucide/svelte';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let { vehicle, closePopUp } = $props();
	let isLoading = $state(false);

	function onConfirm() {
		isLoading = true;
		removeVehicle(vehicle.id)
			.catch((error) => {
				showErrorToast({
					error
				});
			})
			.then(() => closePopUp())
			.finally(() => {
				isLoading = false;
			});
		closePopUp();
	}

	function onCancel() {
		closePopUp();
	}
</script>

<div class="flex flex-col gap-4">
	<span>{$t('common.doYouWantToDeleteVehicle')} {vehicle.license_plate}?</span>
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
