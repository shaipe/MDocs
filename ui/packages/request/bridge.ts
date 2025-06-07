import type { ErrorMessageMode } from '@htui/types';

export interface ContextOptions {
	modalFunction: AnyFunction<any>;
	msgFunction: AnyFunction<any>;
	msgBoxFunction: AnyFunction<any>;
	noticeFunction: AnyFunction<any>;
	getTokenFunction: () => unknown;
	unauthorizedFunction: (msg?: string) => void;
	timeoutFunction: () => void;
	handleErrorFunction: (message?: string, mode?: ErrorMessageMode) => void;
	headerFunction: () => Record<string, string>;
	apiUrl?: string;
}

export let context: ContextOptions = {
	getTokenFunction: () => undefined,
	unauthorizedFunction: () => {},
	modalFunction: () => {},
	msgFunction: () => {},
	noticeFunction: () => {},
	msgBoxFunction: () => {},
	handleErrorFunction: () => {},
	headerFunction: () => {
		return {};
	},
	timeoutFunction: () => {},
	apiUrl: '/api',
};

export const initRequest = async (func: AnyFunction<any>) => {
	context = func();
};
export const setMsg = (func: AnyFunction<any>) => {
	context.msgFunction = func;
};
export const setNotice = (func: AnyFunction<any>) => {
	context.noticeFunction = func;
};
