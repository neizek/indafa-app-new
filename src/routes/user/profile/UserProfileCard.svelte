<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import FormItem from '$lib/components/ui/FormItem.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import { openEditUserMenuPopUp, signOut } from '$lib/helpers/auth';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { user } from '$lib/stores/auth';
	import { t } from '$lib/translations/translations';
	import { LogOut, Pen } from '@lucide/svelte';

	let isLoading: boolean = $state(false);

	function onSignOut() {
		isLoading = true;

		signOut()
			.then(() => {
				goto(ROUTES.HOME);
			})
			.catch((error) => showErrorToast({ error }))
			.finally(() => {
				isLoading = false;
			});
	}

	const displayedName = $derived.by(() => {
		if (!$user?.user_metadata.firstName && !$user?.user_metadata.lastName) {
			return;
		}

		return `${$user?.user_metadata.firstName} ${$user?.user_metadata.lastName}`;
	});
</script>

<Section header={$t('common.personalData')}>
	{#snippet controls()}
		<Button
			label={$t('common.edit')}
			preset="ghost"
			icon={Pen}
			onclick={openEditUserMenuPopUp}
			full={false}
		/>
	{/snippet}
	<FormItem label={$t('common.firstName')}>
		<span>
			{!displayedName || displayedName === '' ? $t('common.notSpecified') : displayedName}
		</span>
	</FormItem>
	<FormItem label={$t('common.email')}>
		<span>{!$user?.email || $user?.email === '' ? $t('common.notSpecified') : $user?.email}</span>
	</FormItem>
	<FormItem label={$t('common.mobilePhone')}>
		<span>
			{!$user?.phone || $user?.phone === '' ? $t('common.notSpecified') : `+${$user?.phone}`}
		</span>
	</FormItem>
	<Button
		preset="tonal"
		label={$t('common.signOut')}
		icon={LogOut}
		onclick={onSignOut}
		{isLoading}
	/>
</Section>
