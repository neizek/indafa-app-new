<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<div class="placeholder w-40 animate-pulse"></div>
	</div>
	<div class="flex flex-col gap-4 rounded-xl bg-surface-100/50 p-4 dark:bg-surface-900/50">
		{#each Array(6) as _}
			<span class="placeholder animate-pulse"></span>
		{/each}
	</div>
</div>
