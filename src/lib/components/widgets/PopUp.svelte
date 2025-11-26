<script lang="ts">
	import { closePopUp, popUps } from '$lib/stores/popUp';
	import { t } from '$lib/translations/translations';
	import { XIcon } from '@lucide/svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
</script>

{#each $popUps as popUp (popUp.id)}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="fixed inset-0 z-50 bg-surface-50-950/50 backdrop-blur-xs will-change-auto backface-hidden transform-gpu"
		role="dialog"
		tabindex="-1"
		transition:fade={{ duration: 200 }}
		on:click|self={() => closePopUp(popUp.id)}
	></div>
	<div
		class="fixed right-4 z-51 bottom-0 left-4 mx-auto mb-4 max-w-sm space-y-4 card bg-surface-50 p-4 shadow-xl dark:bg-surface-900 will-change-auto backface-hidden transform-gpu"
		transition:fly={{ y: 200, duration: 300, easing: cubicOut }}
	>
		<header class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				{#if popUp.icon}
					<svelte:component this={popUp.icon} />
				{/if}
				<span class="text-lg font-bold">
					{$t(popUp.title)}
				</span>
			</div>
			<button class="btn-icon preset-tonal" on:click={() => closePopUp(popUp.id)}>
				<XIcon />
			</button>
		</header>
		<article class="hide-scroll">
			{#if typeof popUp.content === 'string'}
				{popUp.content}
			{:else}
				<svelte:component this={popUp.content.component} {...popUp.content.props} />
			{/if}
		</article>
	</div>
{/each}
