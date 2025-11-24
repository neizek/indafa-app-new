<script lang="ts">
	let {
		label,
		clases = '',
		onclick
	}: {
		label: string;
		clases: string;
		onclick?: () => void;
	} = $props();
</script>

<button class="{clases} badge" {onclick}>
	{label}
</button>
