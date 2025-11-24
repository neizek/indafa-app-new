<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import { isAdmin, isOperator, isReviewer } from '$lib/stores/auth';
	import { t } from '$lib/translations/translations';
	import { UserLock, UserStar } from '@lucide/svelte';
</script>

{#if $isAdmin || $isOperator || $isReviewer}
	<Section header={$t('common.management')}>
		<Button
			preset="menu"
			icon={UserLock}
			label={$t('common.operatorsDashboard')}
			onclick={() => goto(ROUTES.OPERATOR)}
		/>
		{#if $isAdmin || $isReviewer}
			<Button
				preset="menu"
				icon={UserStar}
				label={$t('common.adminsDashboard')}
				onclick={() => goto(ROUTES.ADMIN.DASHBOARD)}
			/>
		{/if}
	</Section>
{/if}
