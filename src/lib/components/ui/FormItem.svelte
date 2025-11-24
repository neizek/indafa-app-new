<script lang="ts">
	import { t } from '$lib/translations/translations';

	let {
		children,
		label,
		errors,
		optional = false
	}: {
		children: any;
		label?: string;
		errors?: string[] | null;
		optional?: boolean;
	} = $props();
</script>

<label class="label">
	{#if label}
		<span class="label-text">
			{label}
			{optional ? `(${$t('common.optional').toLowerCase()})` : ''}
		</span>
	{/if}
	{@render children()}
	{#if errors && errors.length > 0}
		<div class="flex flex-col gap-2">
			{#each errors as error}
				<span class="label-text text-red-500">{$t(error)}</span>
			{/each}
		</div>
	{/if}
</label>
