<script lang="ts">
	import { t } from '$lib/translations/translations';
	import type { AcceptedSelectOptionValues, SelectOption } from '$lib/types/ui';
	import { untrack } from 'svelte';

	let {
		options,
		value = $bindable(),
		onchange
	}: {
		options: SelectOption[];
		value?: AcceptedSelectOptionValues;
		onchange?: (value: AcceptedSelectOptionValues) => void;
	} = $props();

	let optionsRefs: HTMLElement[] = $state([]);

	if (!value && options && !options.find((option) => option.value === value))
		selectFirstAvaliableOption();

	function chooseOption(option: SelectOption) {
		value = option.value;
		if (onchange) onchange(value);
		optionsRefs[options.findIndex((item) => item.value === option.value)]?.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	}

	function selectFirstAvaliableOption() {
		if (options.length === 0) {
			return;
		}

		for (const option of options) {
			if (option.disabled) continue;
			chooseOption(option);
			break;
		}
	}

	$effect(() => {
		const currentOptions = options;
		const foundOption = currentOptions.find((option) => option.value === value);

		if (!foundOption || foundOption.disabled) {
			untrack(() => {
				selectFirstAvaliableOption();
			});
		}
	});
</script>

<div class="flex gap-2 overflow-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
	{#if options.length === 0}
		<div class="grid w-full grid-cols-3 gap-2">
			<div class="h-9 placeholder animate-pulse"></div>
			<div class="h-9 placeholder animate-pulse"></div>
			<div class="h-9 placeholder animate-pulse"></div>
		</div>
	{/if}
	{#each options as option, index}
		{@const Icon = option.icon}
		<button
			type="button"
			class="btn flex min-h-9 flex-1 flex-col gap-0 {option.value === value
				? `bg-primary-500 text-white `
				: `preset-tonal`}"
			disabled={option.disabled}
			bind:this={optionsRefs[index]}
			onclick={() => chooseOption(option)}
		>
			<div class="flex items-center gap-2">
				{#if Icon}
					<Icon size={20} />
				{/if}
				<span class="pb-0.5">{$t(option.label)}</span>
			</div>
			{#if option.caption}
				<span class="label-text pb-1">{$t(option.caption)}</span>
			{/if}
		</button>
	{/each}
</div>
