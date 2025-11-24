<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	let {
		checked = $bindable(),
		label,
		children,
		disabled,
		onchange
	}: {
		checked: boolean;
		label?: string;
		children?: any;
		disabled?: boolean;
		onchange: () => void;
	} = $props();
</script>

<Switch {checked} {onchange} {disabled}>
	<Switch.Control>
		<Switch.Thumb />
	</Switch.Control>
	<Switch.Label>
		{#if label}
			{label}
		{/if}
		{@render children?.()}
	</Switch.Label>
	<Switch.HiddenInput />
</Switch>
