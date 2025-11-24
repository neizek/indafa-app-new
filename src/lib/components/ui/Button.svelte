<script lang="ts">
	import type { ButtonProps } from '$lib/types/ui';
	import { ChevronRight, LoaderCircle } from '@lucide/svelte';

	let {
		type = 'button',
		label,
		preset = 'primary',
		full = true,
		isLoading = false,
		disabled = false,
		icon,
		onclick
	}: ButtonProps = $props();

	const Icon = icon;
	const presets = {
		primary: 'bg-primary-600 text-white',
		cancel: 'bg-error-950/20 text-error-900 dark:text-error-300',
		tonal: 'bg-surface-100 dark:bg-surface-800/50',
		ghost: 'bg-transparent',
		menu: 'bg-transparent grid grid-cols-[auto_1fr_auto] text-left indent-2'
	};

	let classes = [
		'h-9',
		icon && !label ? 'btn-icon' : 'btn',
		full ? 'w-full' : '',
		presets[preset],
		disabled ? 'opacity-50' : ''
	];
</script>

<button {type} class={classes} {onclick} {disabled}>
	{#if isLoading}
		<LoaderCircle size={20} class="animate-spin" />
	{:else}
		{#if icon}
			<Icon size={20} />
		{/if}
		{#if label}
			<span class="pb-0.5">{label}</span>
		{/if}
		{#if preset === 'menu'}
			<ChevronRight size={20} />
		{/if}
	{/if}
</button>
