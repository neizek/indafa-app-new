<script lang="ts">
	import { sendOTP, verifyOTP } from '$lib/helpers/auth';
	import z from 'zod';
	import Button from '../ui/Button.svelte';
	import FormItem from '../ui/FormItem.svelte';
	import Input from '../ui/Input.svelte';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import { Check } from '@lucide/svelte';
	import Form from '../ui/Form.svelte';
	import { t } from '$lib/translations/translations';
	import type { VerificationType } from '$lib/types/auth';
	import { showErrorToast, showInfoToast } from '$lib/helpers/toaster';
	import { goto } from '$app/navigation';
	import { intendedUrl } from '$lib/stores/navigation';
	import PopUpButtons from '../ui/PopUpButtons.svelte';

	let {
		input,
		verificationType,
		closePopUp
	}: {
		input: string;
		verificationType: VerificationType;
		closePopUp: () => void;
	} = $props();

	let isLoadingVerification: boolean = $state(false);
	let isLoadingResending: boolean = $state(false);
	let countdown = $state(0);
	let isDisabled = $derived(countdown > 0);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	const schema = z.object({
		otp: z
			.string({ message: 'common.errors.required' })
			.length(6, 'common.errors.codeMustConsistOfSixDigits')
	});

	type FormValues = z.infer<typeof schema>;

	const { form, errors, data, createSubmitHandler } = createForm<FormValues>({
		extend: validator({ schema }),
		onSubmit: (values) => {
			isLoadingVerification = true;

			verifyOTP(verificationType, input, values.otp)
				.then(() => {
					closePopUp();
					if (verificationType === 'email' || verificationType === 'sms') {
						goto($intendedUrl ?? '/');
						intendedUrl.set(undefined);
						showInfoToast({
							title: 'common.authorization',
							description: 'common.authorizationSuccessful'
						});
					}
				})
				.catch((error) => {
					showErrorToast({ error });
				})
				.finally(() => {
					isLoadingVerification = false;
				});
		}
	});

	const submitForm = createSubmitHandler();

	function onResend() {
		isLoadingResending = true;
		sendOTP(verificationType, input)
			.then(() => {
				startCountdown();
			})
			.catch((error) => showErrorToast({ error }))
			.finally(() => {
				isLoadingResending = false;
			});
	}

	function startCountdown() {
		countdown = 60;

		intervalId = setInterval(() => {
			countdown--;

			if (countdown <= 0) {
				clearInterval(intervalId!);
				intervalId = null;
			}
		}, 1000);
	}

	function onCodeInput() {
		if ($data.otp.length === 6) submitForm();
	}

	startCountdown();
</script>

<Form {form}>
	{#if verificationType === 'email' || verificationType === 'email_change'}
		<span>{$t('common.codeSentToEmail', { email: input })}</span>
	{:else if verificationType === 'sms' || verificationType === 'phone_change'}
		<span>{$t('common.codeSentToPhone', { phone: input })}</span>
	{/if}
	<FormItem label={$t('common.verificationCode')} errors={$errors.otp}>
		<Input
			type="text"
			inputmode="numeric"
			placeholder={$t('common.enterSixDigitCode')}
			autocomplete="one-time-code"
			bind:value={$data.otp}
			oninput={onCodeInput}
		/>
	</FormItem>
	<PopUpButtons>
		{#snippet primaryButton()}
			<Button
				type="submit"
				label={$t('common.submitCode')}
				icon={Check}
				isLoading={isLoadingVerification}
			/>
		{/snippet}
		{#snippet secondaryButton()}
			<Button
				preset="ghost"
				label={`${$t('common.didntReceiveResend')} ${countdown > 0 ? `${countdown}${$t('common.s')}` : ''}`}
				full
				isLoading={isLoadingResending}
				disabled={isDisabled}
				onclick={onResend}
			/>
		{/snippet}
	</PopUpButtons>
</Form>
