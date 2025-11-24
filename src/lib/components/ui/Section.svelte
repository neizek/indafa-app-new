<script lang="ts">
	let {
		header,
		children,
		controls,
		transparent = false
	}: {
		header?: string;
		children?: any;
		controls?: any;
		transparent?: boolean;
	} = $props();

	const clases = [
		'flex',
		'flex-col',
		'gap-4',
		'rounded-xl',
		'p-4',
		transparent ? 'bg-transparent' : 'bg-surface-100/50 dark:bg-surface-900/50'
	];
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		{#if header}
			<span class="text-lg font-bold">{header}</span>
		{/if}
		{#if controls}
			{@render controls()}
		{/if}
	</div>
	<div class={clases}>
		{@render children?.()}
	</div>
</div>
