<script>
	import { Mail, Pen, Phone, Trash } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import {
		openChangeEmailPopUp,
		openChangePersonalDataPopUp,
		openChangePhonePopUp,
		openDeleteUserAccountPopUp
	} from '$lib/helpers/auth';
	import { t } from '$lib/translations/translations';
</script>

<div class="flex flex-col gap-2">
	<Button
		preset="menu"
		icon={Pen}
		label={$t('common.changePersonalData')}
		onclick={openChangePersonalDataPopUp}
	/>
	<Button
		preset="menu"
		icon={Mail}
		label={$t('common.changeEmail')}
		onclick={openChangeEmailPopUp}
	/>
	<Button
		preset="menu"
		icon={Phone}
		label={$t('common.changePhone')}
		onclick={openChangePhonePopUp}
	/>
	<Button
		preset="menuCancel"
		icon={Trash}
		label={$t('common.deleteAccount')}
		onclick={openDeleteUserAccountPopUp}
	/>
</div>
