<script lang="ts">
	import type { FullAutoFill } from 'svelte/elements';

	let {
		type = 'text',
		inputmode = 'text',
		placeholder,
		value = $bindable(),
		autocomplete,
		oninput
	}: {
		type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'time';
		inputmode?: 'text' | 'tel' | 'numeric';
		placeholder?: string;
		value: any;
		autocomplete?: FullAutoFill | null | undefined;
		oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
	} = $props();
</script>

<input {type} {inputmode} class="input w-full" {autocomplete} {placeholder} bind:value {oninput} />
