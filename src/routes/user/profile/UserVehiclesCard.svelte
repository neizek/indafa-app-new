<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import vehiclesStore from '$lib/stores/vehicles';
	import Section from '$lib/components/ui/Section.svelte';
	import { openDeleteVehiclePopUp } from '$lib/helpers/vehicles';
	import AddVehicleButton from '$lib/components/widgets/AddVehicleButton.svelte';
	import { t } from '$lib/translations/translations';
</script>

<Section header={$t('common.myVehicles')}>
	{#snippet controls()}
		<div>
			<AddVehicleButton />
		</div>
	{/snippet}
	{#if $vehiclesStore && $vehiclesStore.length === 0}
		<span>{$t('common.youDontHaveCars')}</span>
	{:else}
		<div class="grid grid-cols-2 gap-2">
			{#each $vehiclesStore as vehicle}
				<div class="chip flex justify-between preset-tonal">
					<span>{vehicle.license_plate}</span>
					<button class="bg-transparent" onclick={() => openDeleteVehiclePopUp(vehicle)}>
						<XIcon size={20} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</Section>
