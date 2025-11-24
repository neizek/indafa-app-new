<script lang="ts">
	// import '../mapbox.css';
	// import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BottomMenu from '$lib/components/widgets/BottomMenu.svelte';
	import PopUp from '$lib/components/widgets/PopUp.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { previousUrl } from '$lib/stores/navigation';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import type { Route } from '$lib/constants/routes';
	import { closeAllPopUps } from '$lib/stores/popUp';
	import { createClient } from '@supabase/supabase-js';

	let { children } = $props();

	beforeNavigate(({ type, from }) => {
		previousUrl.set(from?.url.pathname as Route);
		closeAllPopUps();
	});

	const supabase = createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_ANON_KEY,
		{
			auth: {
				autoRefreshToken: true,
				persistSession: true,
				detectSessionInUrl: false
			}
		}
	);
	console.log(supabase);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<PopUp />
<Toaster />

<div class="m-auto flex min-h-dvh max-w-xl flex-col gap-4 self-center p-4 pb-30">
	{@render children()}
</div>

<BottomMenu />
