<script lang="ts">
	import {
		createBookingTime,
		getAvaliableTimes,
		removeBookingTime
	} from '$lib/helpers/appointments';
	import { showErrorToast } from '$lib/helpers/toaster';
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
	import Switch from '../ui/Switch.svelte';
	import { Clock, MinusIcon, PlusIcon } from '@lucide/svelte';
	import { t } from '$lib/translations/translations';

	let { date, carWash } = $props();

	let timeOptions: {
		value: number;
		label: string;
		checked: boolean;
	}[] = $state([]);

	$effect(() => {
		if (typeof date === 'string') date = new Date(date);
		getAvaliableTimes(carWash, date, true).then((options) => {
			timeOptions = options.flatMap((option) => {
				if (!option.value || typeof option.value !== 'number') {
					return [];
				}

				return {
					value: option.value,
					label: option.label,
					checked: !option.disabled
				};
			});
		});
	});

	function onChange(index: number) {
		if (timeOptions[index].checked) {
			timeOptions[index].checked = false;

			createBookingTime({
				car_wash_id: carWash.id,
				start_time: new Date(date.setHours(timeOptions[index].value, 0, 0, 0)).toISOString(),
				end_time: new Date(
					date.setHours((timeOptions[index].value as number) + 1, 0, 0, 0)
				).toISOString()
			}).catch((error) => {
				timeOptions[index].checked = true;
				showErrorToast({ error });
			});

			return;
		}

		if (!timeOptions[index].checked) {
			timeOptions[index].checked = true;

			removeBookingTime(
				new Date(date.setHours(timeOptions[index].value, 0, 0, 0)).toISOString()
			).catch((error) => {
				timeOptions[index].checked = false;
				showErrorToast({ error });
			});

			return;
		}
	}
</script>

<Collapsible>
	<Collapsible.Trigger class="flex w-full items-center justify-between gap-2">
		<div class="flex items-center gap-2">
			<Clock size={20} />
			<span>{$t('common.avaliableHours')}</span>
		</div>

		<Collapsible.Indicator class="group">
			<MinusIcon class="hidden size-4 group-data-[state=open]:block" />
			<PlusIcon class="block size-4 group-data-[state=open]:hidden" />
		</Collapsible.Indicator>
	</Collapsible.Trigger>
	<Collapsible.Content class="w-full py-4">
		<div class="grid w-full grid-cols-2 justify-items-center gap-2 gap-x-6">
			{#if timeOptions && timeOptions.length > 0}
				{#each timeOptions as option, index}
					<Switch checked={option.checked} label={option.label} onchange={() => onChange(index)} />
				{/each}
			{:else}
				<span>{$t('common.closed')}</span>
			{/if}
		</div>
	</Collapsible.Content>
</Collapsible>
