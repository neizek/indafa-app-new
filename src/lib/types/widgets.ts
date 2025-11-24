import type { Component, ComponentProps } from 'svelte';

type ComponentType = {
	component: Component<ComponentProps>;
	props?: Record<string, unknown>;
};

export interface PopUp {
	id: string;
	title: string;
	content: string | ComponentType;
	icon?: Component;
}

export type PopUpCreationData = Omit<PopUp, 'id'>;
