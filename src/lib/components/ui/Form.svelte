<script lang="ts">
	let { form, children } = $props();
</script>

<form use:form class="flex flex-col gap-4">
	{@render children?.()}
</form>
