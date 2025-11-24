<script lang="ts">
	import AppointmentsList from '$lib/components/widgets/AppointmentsList.svelte';
	import { isAdmin } from '$lib/stores/auth';
</script>

<AppointmentsList adminMode={$isAdmin} />
