import { SafeArea } from 'capacitor-plugin-safe-area';

export async function initSafeArea() {
	SafeArea.getSafeAreaInsets().then(({ insets }) => {
		for (const [key, value] of Object.entries(insets)) {
			document.documentElement.style.setProperty(`--safe-area-inset-${key}`, `${value}px`);
		}
	});

	SafeArea.addListener('safeAreaChanged', ({ insets }) => {
		for (const [key, value] of Object.entries(insets)) {
			document.documentElement.style.setProperty(`--safe-area-inset-${key}`, `${value}px`);
		}
	});
}
