<script>
	import { openAddVehiclePopUp } from '$lib/helpers/vehicles';
	import vehiclesStore from '$lib/stores/vehicles';
	import { Plus } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import { t } from '$lib/translations/translations';
</script>

{#if $vehiclesStore && $vehiclesStore.length < 6}
	<Button
		label={$t('common.add')}
		icon={Plus}
		preset="ghost"
		onclick={openAddVehiclePopUp}
		full={false}
	/>
{/if}
