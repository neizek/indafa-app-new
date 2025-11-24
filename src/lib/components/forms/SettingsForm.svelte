<script lang="ts">
	import { applyTheme, currentTheme, Theme, themesOptions } from '$lib/stores/theme';
	import { supportedLocalesOptions, switchLocale, locale, t } from '$lib/translations/translations';
	import { CircleQuestionMark } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import FormItem from '../ui/FormItem.svelte';
	import Selector from '../ui/Selector.svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';

	let language = $state($locale);
	let theme = $state($currentTheme);

	$effect(() => {
		if (language == null) language = supportedLocalesOptions[0]?.value ?? 'en';
	});
	$effect(() => {
		if (theme == null) theme = Theme.Light;
	});
</script>

<div class="flex flex-col gap-4">
	<FormItem label={$t('common.language')}>
		<Selector
			options={supportedLocalesOptions}
			bind:value={language}
			onchange={() => switchLocale(language)}
		/>
	</FormItem>
	<FormItem label={$t('common.theme')}>
		<Selector
			options={themesOptions}
			bind:value={theme}
			onchange={(value) => applyTheme(value as Theme)}
		/>
	</FormItem>
	<FormItem label={$t('common.others')}>
		<Button
			preset="ghost"
			icon={CircleQuestionMark}
			label={$t('common.rulesAndPolicy')}
			full
			onclick={() => goto(ROUTES.RULES)}
		/>
	</FormItem>
</div>
