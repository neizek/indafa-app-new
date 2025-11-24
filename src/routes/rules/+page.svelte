<script>
	import Section from '$lib/components/ui/Section.svelte';
	import SectionSkeleton from '$lib/components/ui/Skeletons/SectionSkeleton.svelte';
	import { getRules } from '$lib/helpers/rules';
	import { locale } from '$lib/translations/translations';

	const rulesPromise = $derived.by(() => getRules($locale));
</script>

{#await rulesPromise}
	{#each Array(3) as _}
		<SectionSkeleton />
	{/each}
{:then rules}
	{#each rules as rule}
		<Section header={rule.title}>
			<span>{rule.description}</span>
		</Section>
	{/each}
{/await}
