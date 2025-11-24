<script lang="ts">
	import { days } from '$lib/helpers/datetime';
	import { t } from '$lib/translations/translations';
	import type { CarWash } from '$lib/types/carWashes';
	import { Clock, MinusIcon, PlusIcon } from '@lucide/svelte';
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
	let { workingHours }: { workingHours: CarWash['working_hours'] } = $props();
	type DayString =
		| 'sunday'
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday';

	const workingHoursMap = new Map(workingHours.map((wh) => [wh.day_of_week, wh]));

	const dayStringToIndex: Record<DayString, number> = {
		sunday: 0,
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6
	};

	const orderedDays = [...days.slice(1), days[0]];
</script>

<Collapsible>
	<Collapsible.Trigger class="flex w-full items-center justify-between gap-2">
		<div class="flex items-center gap-2">
			<Clock size={20} />
			<span>{$t('common.businessHours')}</span>
		</div>

		<Collapsible.Indicator class="group">
			<MinusIcon class="hidden size-4 group-data-[state=open]:block" />
			<PlusIcon class="block size-4 group-data-[state=open]:hidden" />
		</Collapsible.Indicator>
	</Collapsible.Trigger>
	<Collapsible.Content class="w-full px-7 py-3">
		<div class="grid grid-cols-2 gap-2">
			{#each orderedDays as day, index}
				<span>{$t(`common.${day}`)}</span>
				{#if workingHoursMap && workingHoursMap.get(dayStringToIndex[day as DayString])}
					<span class="justify-self-end">
						{workingHoursMap.get(dayStringToIndex[day as DayString])?.open_time.slice(0, 5)}
						-
						{workingHoursMap.get(dayStringToIndex[day as DayString])?.close_time.slice(0, 5)}
					</span>
				{:else}
					<span class="justify-self-end">{$t('common.closed')}</span>
				{/if}
			{/each}
		</div>
	</Collapsible.Content>
</Collapsible>
