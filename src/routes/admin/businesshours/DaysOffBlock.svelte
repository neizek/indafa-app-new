<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import SectionSkeleton from '$lib/components/ui/Skeletons/SectionSkeleton.svelte';
	import { formatAppointmentDateTime, formatDate } from '$lib/helpers/datetime';
	import { workingHoursExceptions } from '$lib/helpers/workinghours';
	import { createPopUp } from '$lib/stores/popUp';
	import { t } from '$lib/translations/translations';
	import { Plus, Trash } from '@lucide/svelte';
	import AddDayOffForm from './AddDayOffForm.svelte';
	import DeleteDayOffForm from './DeleteDayOffForm.svelte';

	let { carWashId } = $props();

	let workingHoursExceptionsPromise = $state(workingHoursExceptions.get(carWashId));

	function openAddDayOffPopUp() {
		createPopUp({
			title: 'common.addDayOff',
			content: {
				component: AddDayOffForm,
				props: {
					carWashId,
					onConfirm: () => (workingHoursExceptionsPromise = workingHoursExceptions.get(carWashId))
				}
			}
		});
	}

	function openDeleteDayOffPopUp(dayOffId: number) {
		createPopUp({
			title: 'common.delete',
			content: {
				component: DeleteDayOffForm,
				props: {
					dayOffId,
					onDelete: () => (workingHoursExceptionsPromise = workingHoursExceptions.get(carWashId))
				}
			}
		});
	}

	$effect(() => {
		workingHoursExceptionsPromise = workingHoursExceptions.get(carWashId);
	});
</script>

{#await workingHoursExceptionsPromise}
	<SectionSkeleton />
{:then workingHoursExceptions}
	<Section header={$t('common.daysOff')}>
		{#snippet controls()}
			<Button
				preset="ghost"
				label={$t('common.add')}
				icon={Plus}
				full={false}
				onclick={openAddDayOffPopUp}
			/>
		{/snippet}
		<div class="table-wrap">
			<table class="table caption-bottom">
				<thead>
					<tr>
						<th>{$t('common.day')}</th>
						<th>{$t('common.open')}</th>
						<th>{$t('common.closed')}</th>
						<th>{$t('common.reason')}</th>
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tbody>
					{#if workingHoursExceptions && workingHoursExceptions.length === 0}
						<tr><td colspan="4" class="text-center">{$t('common.noAnyDaysOff')}</td></tr>
					{/if}
					{#each workingHoursExceptions as day}
						<tr>
							<td>{formatDate(day.exception_date)}</td>
							<td>{day.open_time ? day.open_time?.slice(0, 5) : '-'}</td>
							<td>{day.close_time ? day.close_time?.slice(0, 5) : '-'}</td>
							<td>{day.reason ?? '-'}</td>
							<td>
								<button class="bg-transparent" onclick={() => openDeleteDayOffPopUp(day.id)}>
									<Trash size={20} />
								</button></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>
{/await}
