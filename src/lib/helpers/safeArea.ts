import { SafeArea } from 'capacitor-plugin-safe-area';

export async function initSafeArea() {
	const { insets } = await SafeArea.getSafeAreaInsets();
	for (const [key, value] of Object.entries(insets)) {
		document.documentElement.style.setProperty(`--safe-area-inset-${key}`, `${value}px`);
	}

	await SafeArea.addListener('safeAreaChanged', ({ insets }) => {
		for (const [key, value] of Object.entries(insets)) {
			document.documentElement.style.setProperty(`--safe-area-inset-${key}`, `${value}px`);
		}
	});
}
