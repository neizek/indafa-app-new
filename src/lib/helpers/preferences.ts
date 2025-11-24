import { Preferences } from '@capacitor/preferences';

export interface StorageItem<T> {
	value: T;
	/**
	 * In milliseconds.
	 */
	lifetime: number;
	/**
	 * Timestasmp in milliseconds.
	 */
	createdAt: number;
}

class AppStorage {
	public async get<T>(key: string): Promise<T | null> {
		// const encoded = localStorage.getItem(key);
		const encoded = await Preferences.get({ key });

		if (!encoded || !encoded.value) {
			return null;
		}

		const { value, lifetime, createdAt }: StorageItem<T> = JSON.parse(encoded.value);

		if (lifetime && Date.now() - createdAt > lifetime) {
			// localStorage.removeItem(key);
			Preferences.remove({ key });

			return null;
		}

		if (value === undefined) {
			return null;
		}

		return value;
	}

	/**
	 * @param key
	 * @param value
	 * @param lifetime in milliseconds.
	 */
	public set<T>(key: string, value: T, lifetime?: number): void {
		Preferences.set({
			key,
			value: JSON.stringify({
				value,
				lifetime,
				createdAt: Date.now()
			})
		});
	}

	public remove(key: string): void {
		// localStorage.removeItem(key);
		Preferences.remove({ key });
	}
}

export default new AppStorage();
