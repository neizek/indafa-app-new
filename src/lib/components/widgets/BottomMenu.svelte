<script lang="ts">
	import { goto } from '$app/navigation';
	import { createPopUp } from '$lib/stores/popUp';
	import { UserIcon, Settings, House, Map, type IconProps } from '@lucide/svelte';
	import { t } from '$lib/translations/translations';
	import { page } from '$app/state';
	import type { Component } from 'svelte';
	import SettingsForm from '../forms/SettingsForm.svelte';
	import { ROUTES } from '$lib/constants/routes';

	interface MenuItem {
		icon: Component<IconProps>;
		label: string;
		link?: string;
		action?: () => void;
	}

	const menu: MenuItem[] = [
		{ icon: House, link: ROUTES.HOME, label: 'common.home' },
		{ icon: UserIcon, link: ROUTES.USER.PROFILE, label: 'common.profile' },
		{ icon: Map, link: ROUTES.MAP, label: 'common.map' },
		{ icon: Settings, action: () => createSettingsPopup(), label: 'common.settings' }
	];

	function createSettingsPopup() {
		createPopUp({
			title: 'common.settings',
			content: {
				component: SettingsForm
			},
			icon: Settings
		});
	}

	function onAction(action?: () => void, link?: string) {
		if (link) goto(link);
		if (action) action();
	}

	const isActive = (link?: string) => {
		return page.url.pathname === link;
	};
</script>

<div class="fixed right-4 bottom-0 left-4 mx-auto mb-4 max-w-sm">
	<div
		class="preset-glass-surface flex w-full items-center justify-around card bg-surface-100/5 px-3 dark:bg-surface-500/50"
	>
		{#each menu as { icon: Icon, link, label, action }}
			<button
				class="flex flex-col items-center gap-1.5 p-3 {isActive(link) ? `text-primary-400` : ``}"
				on:click={() => onAction(action, link)}
			>
				<Icon size={24} />
				<span class="label-text leading-none">{$t(label)}</span>
			</button>
		{/each}
	</div>
</div>
