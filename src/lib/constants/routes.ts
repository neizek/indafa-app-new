export const ROUTES = {
	HOME: '/',
	MAP: '/map',
	APPOINTMENT: '/appointment',
	RULES: '/rules',
	USER: {
		PROFILE: '/user/profile'
	},
	OPERATOR: '/operator',
	ADMIN: {
		DASHBOARD: '/admin/dashboard',
		APPOINTMENTS: '/admin/appointments',
		BUSINESSHOURS: '/admin/businesshours'
	}
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
