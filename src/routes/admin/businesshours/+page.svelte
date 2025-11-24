<script lang="ts">
	import FormItem from '$lib/components/ui/FormItem.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import Selector from '$lib/components/ui/Selector.svelte';
	import { carWashesOptions } from '$lib/stores/carWashes';
	import { t } from '$lib/translations/translations';
	import DaysOffBlock from './DaysOffBlock.svelte';
	import WorkingHoursBlock from './WorkingHoursBlock.svelte';

	let carWashId: number = $state(NaN);
</script>

<Section>
	<FormItem label={$t('common.selectCarWash')}>
		<Selector options={$carWashesOptions} bind:value={carWashId} />
	</FormItem>
</Section>
<WorkingHoursBlock {carWashId} />
<DaysOffBlock {carWashId} />
