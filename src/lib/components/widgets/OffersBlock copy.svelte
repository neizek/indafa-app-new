<script lang="ts">
	import { getOffers } from '$lib/helpers/offers';
	import { t } from '$lib/translations/translations';
	import { onMount } from 'svelte';
	import Image from '../ui/Image.svelte';
	import ScrollableSection from '../ui/ScrollableSection.svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';

	let offers: { url: string }[] = [{ url: '' }];

	onMount(() => {
		getOffers().then((data) => {
			offers = data;
		});
	});
</script>

<ScrollableSection
	header={$t('common.specialOffers')}
	noItemsText={$t('common.noSpecialOffersAvaliable')}
	items={offers}
>
	{#snippet itemRenderer(offer)}
		<button onclick={() => goto(ROUTES.APPOINTMENT)}>
			<Image src={offer.url} alt={$t('common.specialOffers')} />
		</button>
	{/snippet}
</ScrollableSection>
