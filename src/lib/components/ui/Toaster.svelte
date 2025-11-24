<script lang="ts">
	import { toaster } from '$lib/stores/toaster';
	import { t } from '$lib/translations/translations';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
</script>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message class="p-2">
				<Toast.Title class="font-bold">{$t(toast.title)}</Toast.Title>
				<Toast.Description>{$t(toast.description)}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>
