<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import PopUpButtons from '$lib/components/ui/PopUpButtons.svelte';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { workingHoursExceptions } from '$lib/helpers/workinghours';
	import { t } from '$lib/translations/translations';
	import { Trash, XIcon } from '@lucide/svelte';

	let { dayOffId, onDelete, closePopUp } = $props();
	let isLoading = $state(false);

	function onConfirm() {
		isLoading = true;
		workingHoursExceptions
			.remove(dayOffId)
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
	<span>{$t('common.doYouWantToDeleteDayOff')}</span>
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
