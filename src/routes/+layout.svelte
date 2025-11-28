<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BottomMenu from '$lib/components/widgets/BottomMenu.svelte';
	import PopUp from '$lib/components/widgets/PopUp.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { previousUrl } from '$lib/stores/navigation';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import type { Route } from '$lib/constants/routes';
	import { closeAllPopUps } from '$lib/stores/popUp';
	import { SafeArea } from 'capacitor-plugin-safe-area';
	import { onMount } from 'svelte';
	import { initSafeArea } from '$lib/helpers/safeArea';
	import { Keyboard } from '@capacitor/keyboard';

	let { children } = $props();
	let layout: HTMLElement;

	beforeNavigate(({ from }) => {
		previousUrl.set(from?.url.pathname as Route);
		closeAllPopUps();
	});

	onMount(async () => {
		await initSafeArea();
		Keyboard.addListener('keyboardWillShow', () => {
			layout.classList.add('kb-open');
		});

		Keyboard.addListener('keyboardDidHide', () => {
			layout.classList.remove('kb-open');
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	bind:this={layout}
	class="Layout m-auto flex min-h-dvh max-w-xl flex-col gap-4 self-center p-4 pb-30"
>
	<PopUp />
	<Toaster />
	{@render children()}
	<BottomMenu />
</div>

<style>
	.Layout {
		margin-top: var(--safe-area-inset-top, env(safe-area-inset-top));
		margin-bottom: var(--safe-area-inset-bottom, env(safe-area-inset-bottom));
	}

	.kb-open {
		margin-bottom: 1rem;
	}
</style>
