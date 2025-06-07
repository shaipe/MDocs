import { GlobEnvConfig } from '@htui/types';
import { warn } from './log';

// /**
//  * Get the configuration file variable name
//  * @param env
//  */
// export const getConfigFileName = (env: Record<string, any>) => {
// 	return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
// };

// 获取应用配置
export const getAppEnvConfig = () => {

	const ENV: GlobEnvConfig = import.meta.env as unknown as GlobEnvConfig;

	const {
		VITE_PORT,
		VITE_GLOB_APP_TITLE,
		VITE_GLOB_PLATFORM,
		VITE_GLOB_API_URL,
		VITE_GLOB_WSS_URL,
		VITE_GLOB_APP_SHORT_NAME,
		VITE_GLOB_API_URL_PREFIX,
		VITE_GLOB_UPLOAD_URL,
		VITE_GLOB_SITE_DOMAIN,
		VITE_GLOB_IMAGE_DOMAIN,
		VITE_PROJECT_CODE,
        VITE_GLOB_PASSPORT_NAME
	} = ENV;

	// if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
	// 	warn(`VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`);
	// }

	return {
		VITE_PORT: VITE_PORT || 3100,
		VITE_GLOB_APP_TITLE,
		VITE_GLOB_PLATFORM,
		VITE_GLOB_API_URL,
		VITE_GLOB_WSS_URL,
		VITE_GLOB_APP_SHORT_NAME,
		VITE_GLOB_API_URL_PREFIX,
		VITE_GLOB_UPLOAD_URL,
		VITE_GLOB_SITE_DOMAIN,
		VITE_GLOB_IMAGE_DOMAIN,
		VITE_PROJECT_CODE,
        VITE_GLOB_PASSPORT_NAME
	};
};

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
	return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
	return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
	return import.meta.env.PROD;
}
