<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { CarWash } from '$lib/types/carWashes';
	import { MapPin, Phone } from '@lucide/svelte';
	import WorkingHours from './WorkingHours.svelte';

	let { carWash }: { carWash: CarWash } = $props();

	const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${carWash.lat}%2C${carWash.long}`;
	const wazeUrl = `https://www.waze.com/ul?ll=${carWash.lat}%2C${carWash.long}&navigate=yes`;
</script>

<div class="flex flex-col gap-4 card">
	<div class="flex items-center gap-2">
		<MapPin />
		<span>{carWash.address}</span>
	</div>
	<WorkingHours workingHours={carWash.working_hours} />
	<div class="flex flex-col gap-2">
		<div class="flex gap-2">
			<Button label="Waze" preset="tonal" onclick={() => (window.location.href = wazeUrl)} full />
			<Button
				label="Google Maps"
				preset="tonal"
				onclick={() => (window.location.href = googleMapsUrl)}
				full
			/>
		</div>
		<Button
			label={carWash.phone}
			icon={Phone}
			onclick={() => window.open(`tel:${carWash.phone}`)}
			full
		/>
	</div>
</div>
