<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import UserProfileCard from './UserProfileCard.svelte';
	import UserVehiclesCard from './UserVehiclesCard.svelte';
	import UserAppointments from './UserAppointments.svelte';
	import { t } from '$lib/translations/translations';
	import UserManagementBlock from './UserManagementBlock.svelte';
</script>

<Tabs defaultValue="tab-1">
	<Tabs.List>
		<Tabs.Trigger value="tab-1">{$t('common.profile')}</Tabs.Trigger>
		<Tabs.Trigger value="tab-2">{$t('common.appointments')}</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="tab-1">
		<div class="flex flex-col gap-4">
			<UserProfileCard />
			<UserVehiclesCard />
			<UserManagementBlock />
		</div>
	</Tabs.Content>
	<Tabs.Content value="tab-2">
		<UserAppointments />
	</Tabs.Content>
</Tabs>
