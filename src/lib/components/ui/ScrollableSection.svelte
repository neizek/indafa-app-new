<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		header,
		items,
		noItemsText,
		itemRenderer,
		controls
	}: {
		header?: string;
		items?: any;
		noItemsText: string;
		itemRenderer: Snippet<[item: any]>;
		controls?: any;
	} = $props();

	let scrollContainer: HTMLDivElement | undefined = $state(undefined);
	let activeIndex = $state(0);

	// Track scroll position to update active dot
	function handleScroll() {
		if (!scrollContainer || !items) return;

		const scrollLeft = scrollContainer.scrollLeft;
		const containerWidth = scrollContainer.offsetWidth;
		const newIndex = Math.round(scrollLeft / containerWidth);

		activeIndex = newIndex;
	}

	// Scroll to specific slide when dot is clicked
	function scrollToSlide(index: number) {
		if (!scrollContainer) return;

		const containerWidth = scrollContainer.offsetWidth;
		scrollContainer.scrollTo({
			left: index * containerWidth,
			behavior: 'smooth'
		});
	}
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
	{#if items && items.length > 0}
		<div
			class="flex snap-x gap-2 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			bind:this={scrollContainer}
			onscroll={handleScroll}
		>
			{#each items as item}
				<div
					class="flex min-w-full flex-1 snap-center flex-col gap-4 overflow-hidden rounded-xl bg-surface-100/50 dark:bg-surface-900/50"
				>
					{@render itemRenderer(item)}
				</div>
			{/each}
		</div>
		{#if items.length > 1}
			<div class="flex items-center justify-center gap-2 py-2">
				{#each items as _, index}
					<button
						type="button"
						onclick={() => scrollToSlide(index)}
						class="h-2 w-2 rounded-full transition-all duration-300 {index === activeIndex
							? 'w-6 bg-primary-500'
							: 'bg-surface-400 dark:bg-surface-600'}"
						aria-label="Go to slide {index + 1}"
					></button>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="flex flex-col gap-4 rounded-xl bg-surface-100/50 p-4 dark:bg-surface-900/50">
			<span>{noItemsText}</span>
		</div>
	{/if}
</div>
