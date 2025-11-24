<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { carWashes, carWashesMap } from '$lib/stores/carWashes';
	import { openCarWashDetailsPopUp } from '$lib/helpers/carWashes';
	import { page } from '$app/stores';

	let mapContainer: HTMLElement;
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

	onMount(() => {
		if (mapContainer === null || !mapContainer) {
			return;
		}

		const queriedCarWash = $carWashesMap.get(Number($page.url.hash?.replace('#', '')));

		const map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/navigation-night-v1',
			center: [24.198310039551963, 56.990224093655414],
			zoom: 9,
			logoPosition: 'top-left',
			attributionControl: false
		});

		map.addControl(new mapboxgl.FullscreenControl());

		const bounds = new mapboxgl.LngLatBounds();
		$carWashes.forEach((carWash) => {
			if (carWash.long && carWash.lat) {
				const marker = new mapboxgl.Marker()
					.setLngLat({ lng: carWash.long, lat: carWash.lat })
					.addTo(map);
				marker.getElement().addEventListener('click', () => openCarWashDetailsPopUp(carWash));
				if ((queriedCarWash && queriedCarWash.id === carWash.id) || !queriedCarWash) {
					bounds.extend({ lng: carWash.long, lat: carWash.lat });
				}
			}
		});

		map.fitBounds(bounds, {
			padding: 50,
			maxZoom: 15,
			duration: 1000
		});

		if (queriedCarWash) openCarWashDetailsPopUp(queriedCarWash);
	});
</script>

<div class="Map fixed top-0 right-0 bottom-0 left-0">
	<div bind:this={mapContainer} class="fixed inset-0 h-full w-full"></div>
</div>
