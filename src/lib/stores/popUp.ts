import type { PopUp, PopUpCreationData } from '$lib/types/widgets';
import { writable, type Writable } from 'svelte/store';

export function createPopUp(data: PopUpCreationData) {
	popUps.update((items) => {
		const randomId = crypto.randomUUID();

		const newPopUp: PopUp = {
			id: randomId,
			title: data.title,
			content:
				typeof data.content === 'string'
					? data.content
					: {
							component: data.content.component,
							props: {
								...data.content.props,
								closePopUp: () => closePopUp(randomId)
							}
						},
			icon: data.icon
		};
		return [...items, newPopUp];
	});
}

export function closePopUp(id: string) {
	popUps.update((items) => items.filter((item) => item.id !== id));
}

export function closeAllPopUps() {
	popUps.set([]);
}

const popUps: Writable<PopUp[]> = writable([]);

export { popUps };
