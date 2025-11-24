import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.teweb.indafa',
	appName: 'Indafa',
	webDir: 'build',
	plugins: {
		LocalNotifications: {
			smallIcon: 'ic_stat_icon'
		}
	}
};

export default config;
