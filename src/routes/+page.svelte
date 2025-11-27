<script lang="ts">
	import { ClockPlus } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import IndafaLogo from '$lib/assets/indafa.svg?raw';
	import OffersBlock from '$lib/components/widgets/OffersBlock.svelte';
	import AppointmentsBlock from '$lib/components/widgets/AppointmentsBlock.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import { t } from '$lib/translations/translations';
	import BannerBlock from '$lib/components/widgets/BannerBlock.svelte';
</script>

<div class="h-auto w-full px-10 pt-5 dark:invert">
	{@html IndafaLogo}
</div>
<OffersBlock />
<BannerBlock />
<AppointmentsBlock />
<Section transparent>
	<Button
		label={$t('common.makeAnAppointment')}
		icon={ClockPlus}
		onclick={() => goto(ROUTES.APPOINTMENT)}
		full
	/>
</Section>
