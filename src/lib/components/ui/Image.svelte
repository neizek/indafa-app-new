<script lang="ts">
	import { fade } from 'svelte/transition';

	let {
		src,
		alt,
		cover = 'object-cover',
		ratio = 'aspect-video'
	}: {
		src: string;
		alt: string;
		cover?: 'object-cover' | 'object-contain';
		ratio?: 'aspect-video' | 'aspect-square';
	} = $props();

	let isLoading: boolean = $state(true);

	$effect(() => {
		if (!src) return;

		isLoading = true;

		const image = new Image();
		const handleLoad = () => (isLoading = false);
		const handleError = () => (isLoading = false);

		image.addEventListener('load', handleLoad);
		image.addEventListener('error', handleError);
		image.src = src;

		if (image.complete) {
			isLoading = false;
		}

		return () => {
			image.removeEventListener('load', handleLoad);
			image.removeEventListener('error', handleError);
		};
	});
</script>

{#key src}
	{#if isLoading}
		<div class={[ratio, 'w-full', cover, 'placeholder animate-pulse border-0']}></div>
	{/if}
	<img
		in:fade
		{src}
		{alt}
		class={[ratio, 'w-full', cover, isLoading ? 'hidden' : 'text-[0px]']}
		loading="lazy"
		decoding="async"
	/>
{/key}
