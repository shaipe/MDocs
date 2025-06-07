/// 基础处理单元

export * from './src';

export {
	isEqual,
	omit,
	cloneDeep,
	isUndefined,
	clone,
	isArray,
	isString,
	toString,
	assign as _assign,
	merge as _merge,
	omit as _omit,
	uniqBy,
} from 'lodash-es';

export { isObject, useIntervalFn, set, useDebounceFn, tryOnBeforeUnmount, containsProp, useLocalStorage } from '@vueuse/core';
