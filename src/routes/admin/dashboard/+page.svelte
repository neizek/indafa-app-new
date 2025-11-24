<script lang="ts">
	import Section from '$lib/components/ui/Section.svelte';
	import StatBlock from '$lib/components/ui/StatBlock.svelte';
	import {
		getAppointmentsCount,
		getCompletedAppointmentsCount,
		getPendingAppointmentsCount
	} from '$lib/helpers/admin';
	import { subtractDays } from '$lib/helpers/datetime';
	import { t } from '$lib/translations/translations';

	const today = new Date();
	const lastWeekDate = subtractDays(today);

	const lastWeekAppointmentsCount = getAppointmentsCount(lastWeekDate, today);
	const previousWeekAppointmentsCount = getAppointmentsCount(
		subtractDays(lastWeekDate),
		lastWeekDate
	);
	const pendingAppointmentsCount = getPendingAppointmentsCount();
	const completedAppointmentsCount = getCompletedAppointmentsCount();

	const appointmentsPromises = Promise.all([
		lastWeekAppointmentsCount,
		previousWeekAppointmentsCount,
		pendingAppointmentsCount,
		completedAppointmentsCount
	]);

	function getPercentageChange(oldValue: number, newValue: number) {
		if (oldValue === 0) return newValue === 0 ? 0 : 100;
		return ((newValue - oldValue) / oldValue) * 100;
	}
</script>

<Section header={$t('common.appointments')}>
	<div class="flex flex-wrap justify-around gap-5">
		{#await appointmentsPromises}
			{#each Array(4) as _}
				<div class="flex w-full flex-col gap-2">
					<div class="badge h-[45px] placeholder w-full"></div>
					<div class="badge placeholder"></div>
					<div class="badge placeholder"></div>
				</div>
			{/each}
		{:then [previousweek, lastweek, pending, completed]}
			{@const increase = lastweek && previousweek ? getPercentageChange(previousweek, lastweek) : 0}
			<StatBlock value={previousweek} label="Previous week" />
			<StatBlock value={lastweek} label="Last week" percent={increase} />
			<StatBlock value={pending} label={$t('common.pending')} />
			<StatBlock value={completed} label={$t('common.completed')} />
		{/await}
	</div>
</Section>
