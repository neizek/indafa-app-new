<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { t } from '$lib/translations/translations';
	import { Trash, XIcon } from '@lucide/svelte';
	import PopUpButtons from '../ui/PopUpButtons.svelte';
	import { deleteUser } from '$lib/helpers/auth';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';

	let { closePopUp } = $props();
	let isLoading = $state(false);

	function onConfirm() {
		isLoading = true;

		deleteUser()
			.catch((error) => {
				showErrorToast({
					error
				});
			})
			.then(() => {
				goto(ROUTES.HOME);
				closePopUp();
			})
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
	<span>{$t('common.doYouWantToDeleteYourAccount')}?</span>
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
