<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import FormItem from '$lib/components/ui/FormItem.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { openOTPVerificationPopUp, sendOTP } from '$lib/helpers/auth';
	import z from 'zod';
	import Form from '../ui/Form.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { LogIn } from '@lucide/svelte';
	import Selector from '../ui/Selector.svelte';
	import type { SignInType } from '$lib/types/auth';
	import { t } from '$lib/translations/translations';
	import PhoneInput from '../ui/PhoneInput.svelte';
	import { showErrorToast } from '$lib/helpers/toaster';

	let { closePopUp } = $props();
	let isLoading: boolean = $state(false);
	let signInWay: SignInType = $state('email');

	const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

	const emailVerificationSchema = z.object({
		type: z.literal('email'),
		email: z.string({ message: 'common.errors.required' }).email('common.errors.enterValidEmail')
	});

	const smsVerificationSchema = z.object({
		type: z.literal('sms'),
		phone: z
			.string({ message: 'common.errors.required' })
			.regex(phoneRegex, 'common.errors.enterValidPhone')
	});

	const verificationSchema = z.discriminatedUnion('type', [
		emailVerificationSchema,
		smsVerificationSchema
	]);

	type FormValues = z.infer<typeof verificationSchema>;
	type SignInErrors = {
		email?: string[];
		phone?: string[];
		type?: string[];
	};

	const { form, errors, data } = createForm<FormValues>({
		extend: validator({ schema: verificationSchema }),
		onSubmit: (values) => {
			isLoading = true;

			const input = values.type === 'email' ? values.email : values.phone;
			sendOTP(values.type, input)
				.then(() => {
					closePopUp();
					openOTPVerificationPopUp(input, values.type);
				})
				.catch((error) => {
					showErrorToast({ error });
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});

	const signInOptions = [
		{ value: 'sms', label: 'common.mobilePhone' },
		{ value: 'email', label: 'common.email' }
	];

	$effect(() => {
		$data.type = signInWay;
	});
</script>

<FormItem label={$t('common.chooseYourSignInWay')}>
	<Selector options={signInOptions} bind:value={signInWay} />
</FormItem>
<Form {form}>
	{#if signInWay === 'email' && $data.type === 'email'}
		<FormItem label={$t('common.email')} errors={($errors as SignInErrors).email}>
			<Input type="email" bind:value={$data.email} placeholder="info@indafa.lv" />
		</FormItem>
	{:else if signInWay === 'sms' && $data.type === 'sms'}
		<FormItem label={$t('common.mobilePhone')} errors={($errors as SignInErrors).phone}>
			<PhoneInput bind:value={$data.phone} code="+371" placeholder="67391995" />
		</FormItem>
	{/if}
	<div class="mt-4">
		<Button type="submit" label={$t('common.signInOrSignUp')} {isLoading} icon={LogIn} full />
	</div>
</Form>
