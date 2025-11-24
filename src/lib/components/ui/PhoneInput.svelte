<script lang="ts">
	import { parsePhoneNumber } from 'libphonenumber-js/min';
	import { onMount } from 'svelte';

	// import { countries } from '$lib/constants/countries';

	let {
		code = '+371',
		number = '',
		value = $bindable(),
		placeholder
	}: {
		code?: string;
		number?: string;
		value: string;
		placeholder?: string;
	} = $props();

	// const codeOptions = countries.map((country) => ({
	// 	label: country.dial_code,
	// 	value: country.dial_code
	// }));

	onMount(() => {
		if (value) {
			const phoneNumber = parsePhoneNumber(value);
			code = `+${phoneNumber.countryCallingCode}`;
			number = phoneNumber.nationalNumber;
		}
	});

	function onInputNumber() {
		value = code + number;
	}
</script>

<div class="input-group grid-cols-[auto_1fr]">
	<div class="ig-cell preset-tonal">{code}</div>
	<input
		class="ig-input"
		inputmode="tel"
		type="tel"
		{placeholder}
		bind:value={number}
		oninput={onInputNumber}
	/>
</div>
