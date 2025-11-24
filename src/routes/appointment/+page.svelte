<script lang="ts">
	import { carWashesMap, carWashesOptions } from '$lib/stores/carWashes';
	import FormItem from '$lib/components/ui/FormItem.svelte';
	import Selector from '$lib/components/ui/Selector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Check } from '@lucide/svelte';
	import vehiclesStore from '$lib/stores/vehicles';
	import Section from '$lib/components/ui/Section.svelte';
	import { derived } from 'svelte/store';
	import type { SelectOption } from '$lib/types/ui';
	import { createAppointment, getAvaliableTimes } from '$lib/helpers/appointments';
	import { session, user } from '$lib/stores/auth';
	import { z } from 'zod';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import AddVehicleButton from '$lib/components/widgets/AddVehicleButton.svelte';
	import { goto } from '$app/navigation';
	import Form from '$lib/components/ui/Form.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import { getWorkingDatesOptions } from '$lib/helpers/carWashes';
	import { t } from '$lib/translations/translations';
	import { showErrorToast, showInfoToast, showSuccessToast } from '$lib/helpers/toaster';
	import appointmentsStore from '$lib/stores/appointments';
	import { AppointmentStatusEnum } from '$lib/enums/appointments';
	import { openMissingProfileDataPopup } from '$lib/helpers/auth';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let isLoading: boolean = $state(false);

	const schema = z.object({
		location: z.number({ message: 'common.errors.required' }),
		date: z.date({ message: 'common.errors.required' }),
		vehicle: z.number({ message: 'common.errors.required' }),
		startTime: z.number({ message: 'common.errors.required' }),
		agreeWithRules: z.boolean({ message: 'common.errors.mustAgreeWithTerms' })
	});

	type FormValues = z.infer<typeof schema>;

	const { form, errors, data } = createForm<FormValues>({
		extend: validator({ schema }),
		onSubmit: (values) => {
			if (!values.date || !values.location || !values.vehicle || !values.startTime || !$session) {
				showErrorToast({
					description: 'common.errors.notAllDataFilled'
				});
				return;
			}

			const existingAppointment = $appointmentsStore.find(
				(appointment) =>
					appointment.vehicle_id === values.vehicle &&
					new Date(appointment.start_time) > new Date() &&
					appointment.status === AppointmentStatusEnum.pending
			);

			if (existingAppointment) {
				showErrorToast({
					description: 'common.errors.onlyOneAppointmentPerCarAllowed'
				});
				return;
			}

			if (
				!$user?.user_metadata.firstName ||
				!$user?.user_metadata.lastName ||
				!$user?.email ||
				!$user?.phone
			) {
				showInfoToast({
					title: 'common.info',
					description: 'common.completeYouProfileBeforeAppointment'
				});
				openMissingProfileDataPopup();
				return;
			}

			isLoading = true;

			createAppointment({
				user_id: $session.user.id,
				car_wash_id: values.location,
				vehicle_id: values.vehicle,
				start_time: new Date(values.date.setHours(values.startTime, 0, 0, 0)).toISOString(),
				end_time: new Date(values.date.setHours(values.startTime + 1, 0, 0, 0)).toISOString()
			})
				.catch((error) => {
					showErrorToast({ error });
				})
				.then(() => {
					showSuccessToast({
						title: 'common.info',
						description: 'common.successfulAppointment'
					});
				})
				.finally(() => {
					isLoading = false;
					goto(ROUTES.HOME);
				});
		}
	});

	let chosenCarWash = $derived.by(() => $carWashesMap.get($data.location));

	let dateOptions: SelectOption[] = $derived.by(() =>
		chosenCarWash ? getWorkingDatesOptions(chosenCarWash) : []
	);

	const vehiclesOptions = derived(vehiclesStore, (items) =>
		items.map((vehicle) => ({
			value: vehicle.id,
			label: vehicle.license_plate
		}))
	);

	let timeOptions: SelectOption[] = $state([]);

	async function onDateChange() {
		timeOptions = chosenCarWash ? await getAvaliableTimes(chosenCarWash, $data.date, true) : [];
	}
</script>

<Form {form}>
	<Section header={$t('common.desiredSpot')}>
		<FormItem label={$t('common.selectCarWash')} errors={$errors.location}>
			<Selector options={$carWashesOptions} bind:value={$data.location} />
		</FormItem>
	</Section>
	<Section header={$t('common.appointment')}>
		<FormItem label={$t('common.selectDate')} errors={$errors.date}>
			<Selector options={dateOptions} bind:value={$data.date} onchange={onDateChange} />
		</FormItem>
		<FormItem label={$t('common.selectTime')} errors={$errors.startTime}>
			<Selector options={timeOptions} bind:value={$data.startTime} />
		</FormItem>
	</Section>
	<Section header={$t('common.carInfo')}>
		{#snippet controls()}
			<div>
				<AddVehicleButton />
			</div>
		{/snippet}
		<FormItem label={$t('common.selectCar')} errors={$errors.vehicle}>
			{#if $vehiclesOptions && $vehiclesOptions.length === 0}
				<div class="p-2">{$t('common.addAtLeastOneCar')}</div>
			{:else}
				<Selector options={$vehiclesOptions} bind:value={$data.vehicle} />
			{/if}
		</FormItem>
	</Section>
	<Section transparent>
		<FormItem errors={$errors.agreeWithRules}>
			<Switch
				checked={$data.agreeWithRules}
				onchange={(e) => ($data.agreeWithRules = (e.target as HTMLInputElement)?.checked)}
			>
				<Switch.Control>
					<Switch.Thumb />
				</Switch.Control>
				<Switch.Label>
					{@html $t('common.iAgreeWith', {
						link: `<a href="${ROUTES.RULES}" class="text-primary-500">${$t('common.termsOfUse')}</a>`
					})}
				</Switch.Label>
				<Switch.HiddenInput />
			</Switch>
		</FormItem>
		<Button type="submit" label={$t('common.confirmAppointment')} {isLoading} icon={Check} full />
	</Section>
</Form>
