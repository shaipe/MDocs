import type { GlobConfig } from '@htui/types';
import { version } from '../package.json';
import { getAppEnvConfig } from './env';
import { warn } from './log';

// /**
//  * Get the configuration file variable name
//  * @param env
//  */
// export function getAppConfigFileName(env: Record<string, any>) {
// 	return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
// }

// export function getGlobalConfig(env: Record<string, any>): Readonly<GlobConfig> {
// 	const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_APP_SHORT_NAME } = getAppConfig(env);

// 	// Take global configuration
// 	const glob: Readonly<GlobConfig> = {
// 		title: VITE_GLOB_APP_TITLE,
// 		apiUrl: VITE_GLOB_API_URL,
// 		shortName: VITE_GLOB_APP_SHORT_NAME,
// 	};
// 	return glob as Readonly<GlobConfig>;
// }

function createStorageKeyPrefix(env: Record<string, any>) {
	const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
	return `${VITE_GLOB_APP_SHORT_NAME}_${env.MODE}`.toUpperCase();
}

// Generate cache key according to version
export function createStorageName(env: Record<string, any>) {
	// console.log(createStorageKeyPrefix(env), version);
	return `${createStorageKeyPrefix(env)}${`_${version}`}_`.toUpperCase();
}

// function getAppConfig(env: Record<string, any>) {
// 	const ENV_NAME = getAppConfigFileName(env);

// 	const ENV = (
// 		env.DEV
// 			? // Get the global configuration (the configuration will be extracted independently when packaging)
// 			  env
// 			: (window as any)[ENV_NAME]
// 	) as GlobEnvConfig;

// 	if (!ENV) {
// 		return {
// 			VITE_GLOB_APP_SHORT_NAME: 'htui',
// 			VITE_GLOB_API_URL: '/api',
// 			VITE_GLOB_APP_TITLE: '宏推'
// 		};
// 	}

// 	const { VITE_GLOB_APP_SHORT_NAME } = ENV;

// 	if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
// 		console.warn(
// 			`VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
// 		);
// 	}

// 	return ENV;
// }

export const useGlobSetting = (): Readonly<GlobConfig> => {
	const {
		VITE_GLOB_APP_TITLE,
		VITE_GLOB_PLATFORM,
		VITE_PORT,
		VITE_GLOB_API_URL,
		VITE_GLOB_APP_SHORT_NAME,
		VITE_GLOB_WSS_URL,
		VITE_GLOB_UPLOAD_URL,
		VITE_GLOB_SITE_DOMAIN,
		VITE_GLOB_IMAGE_DOMAIN,
		VITE_PROJECT_CODE,
        VITE_GLOB_PASSPORT_NAME
	} = getAppEnvConfig();

	// console.log(VITE_GLOB_API_URL, VITE_GLOB_APP_TITLE);

	// if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
	// 	warn(`VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`);
	// }

	// Take global configuration
	const glob: Readonly<GlobConfig> = {
		port: VITE_PORT,
		title: VITE_GLOB_APP_TITLE,
		platform: VITE_GLOB_PLATFORM,
		apiUrl: VITE_GLOB_API_URL,
		wssUrl: VITE_GLOB_WSS_URL,
		shortName: VITE_GLOB_APP_SHORT_NAME,
		uploadUrl: VITE_GLOB_UPLOAD_URL,
		siteDomain: VITE_GLOB_SITE_DOMAIN,
		imageDomain: VITE_GLOB_IMAGE_DOMAIN,
		projectCode: VITE_PROJECT_CODE || '',
        passportName: VITE_GLOB_PASSPORT_NAME
	};
	return glob as Readonly<GlobConfig>;
};
