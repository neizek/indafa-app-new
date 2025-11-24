<script lang="ts">
	import Section from '$lib/components/ui/Section.svelte';
	import SectionSkeleton from '$lib/components/ui/Skeletons/SectionSkeleton.svelte';
	import { days } from '$lib/helpers/datetime';
	import { workingHours } from '$lib/helpers/workinghours';
	import { t } from '$lib/translations/translations';

	let { carWashId } = $props();

	let workingHoursPromise = $state(workingHours.get(carWashId));

	$effect(() => {
		workingHoursPromise = workingHours.get(carWashId);
	});
</script>

{#await workingHoursPromise}
	<SectionSkeleton />
{:then workingDays}
	<Section header={$t('common.businessHours')}>
		<div class="table-wrap">
			<table class="table caption-bottom">
				<thead>
					<tr>
						<th>{$t('common.day')}</th>
						<th>{$t('common.open')}</th>
						<th>{$t('common.closed')}</th>
					</tr>
				</thead>
				<tbody>
					{#each workingDays as day}
						<tr>
							<td>{$t(`common.${days[day.day_of_week]}`)}</td>
							<td>{day.open_time.slice(0, 5)}</td>
							<td>{day.close_time.slice(0, 5)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>
{/await}
