<script lang="ts">
	let { primaryButton, secondaryButton } = $props();
</script>

<div class="mt-2 flex flex-wrap justify-between gap-2">
	<div class="min-w-0 grow">
		{@render primaryButton?.()}
	</div>
	<div class="flex-1">
		{@render secondaryButton?.()}
	</div>
</div>
