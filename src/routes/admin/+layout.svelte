<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Selector from '$lib/components/ui/Selector.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import { CalendarClock, ChartNoAxesColumn, ClipboardClock } from '@lucide/svelte';
	let { children } = $props();

	const menuOptions = [
		{ label: 'common.stats', icon: ChartNoAxesColumn, value: ROUTES.ADMIN.DASHBOARD },
		{ label: 'common.appointments', icon: ClipboardClock, value: ROUTES.ADMIN.APPOINTMENTS },
		{ label: 'common.businessHours', icon: CalendarClock, value: ROUTES.ADMIN.BUSINESSHOURS }
	];

	let selectedOption = $state(page.url.pathname);

	function onChange() {
		if (selectedOption) goto(selectedOption);
	}
</script>

<Selector options={menuOptions} bind:value={selectedOption} onchange={onChange} />

{@render children()}
