<script lang="ts">
	let { children } = $props();
</script>

<div class="flex flex-col gap-4 rounded-xl bg-surface-100/50 p-4 dark:bg-surface-900/50">
	{@render children?.()}
</div>
