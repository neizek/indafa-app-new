<script lang="ts">
	import { formatCompact } from '$lib/helpers/string';

	let {
		value,
		label,
		percent
	}: {
		value: number | null;
		label: string;
		percent?: number;
	} = $props();

	let shownPercentage = $state('');

	const badgeColor = (() => {
		if (!percent) {
			shownPercentage = 'N/A';
			return 'preset-tonal-surface';
		}

		if (percent > 0) {
			shownPercentage = `+ ${percent.toFixed(1)}%`;
			return 'preset-tonal-success';
		}

		if (percent < 0) {
			shownPercentage = `${percent.toFixed(1)}%`;
			return 'preset-tonal-error';
		}
	})();
</script>

<div class="relative flex flex-col items-center gap-2">
	<span class="text-4xl">{value !== null ? formatCompact(value) : 0}</span>
	<span class="label-text text-center">{label}</span>
	{#if percent}
		<div class="badge {badgeColor}">{shownPercentage}</div>
	{/if}
</div>
