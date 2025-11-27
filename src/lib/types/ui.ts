import type { IconProps } from '@lucide/svelte';
import type { Component } from 'svelte';

export type AcceptedSelectOptionValues = string | number | Date | null;

export interface SelectOption {
	value: AcceptedSelectOptionValues;
	label: string;
	caption?: string;
	icon?: Component<IconProps>;
	disabled?: boolean;
}

export interface ButtonProps {
	type?: 'submit' | 'button';
	label?: string;
	preset?: 'primary' | 'cancel' | 'tonal' | 'ghost' | 'menu';
	full?: boolean;
	icon?: Component<IconProps>;
	isLoading?: boolean;
	disabled?: boolean;
	onclick?: () => void;
}
