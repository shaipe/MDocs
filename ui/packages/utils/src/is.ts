/// 类型判断
import { isObject } from '@vueuse/core';
const opt = Object.prototype.toString;

// 是否为指字的对象
export function is(val: unknown, type: string) {
	return opt.call(val) === `[object ${type}]`;
}

// 是否为未定义对象
export function isDef<T = unknown>(val?: T): val is T {
	return typeof val !== 'undefined';
}

// 是否为数组
export function isArray(obj: any): obj is any[] {
	return opt.call(obj) === '[object Array]';
}

// // 是否为大对象
// export function isObject(obj: any): obj is { [key: string]: any } {
// 	return opt.call(obj) === '[object Object]'
// }

// 是否为字符串
export function isString(obj: any): obj is string {
	return opt.call(obj) === '[object String]';
}

// 是否为数字类型
export function isNumber(obj: any): obj is number {
	return opt.call(obj) === '[object Number]' && obj === obj; // eslint-disable-line
}

// 是否为正则表达式
// export function isRegExp(obj: any) {
// 	return opt.call(obj) === '[object RegExp]';
// }

export function isRegExp(val: unknown): val is RegExp {
	return is(val, 'RegExp');
}

// 是否为文件
export function isFile(obj: any): obj is File {
	return opt.call(obj) === '[object File]';
}

// 是否为二进制流
export function isBlob(obj: any): obj is Blob {
	return opt.call(obj) === '[object Blob]';
}

// 是否未定义
export function isUndefined(obj: any): obj is undefined {
	return obj === undefined;
}

// 是不为null值
export function isNull(obj: any): obj is null {
	return obj === null;
}

// 是否为函数
export function isFunction(obj: any): obj is (...args: any[]) => any {
	return typeof obj === 'function';
}

// 是否为Promise
export function isPromise(value: any): boolean {
	return !!value && typeof value.then === 'function';
}

// 是否为Bool型
export function isBoolean(val: unknown): val is boolean {
	return is(val, 'Boolean');
}

// 是否为空对象
export function isEmptyObject(obj: any): boolean {
	return isObject(obj) && Object.keys(obj).length === 0;
}

// 是否存在
export function isExist(obj: any): boolean {
	return obj || obj === 0;
}

// 是否为Window对象
export function isWindow(el: any): el is Window {
	return el === window;
}

// 是否为node服务端定义
export const isServer = typeof window === 'undefined';
// 是否为客户端
export const isClient = !isServer;

// 是否为url对象
export function isUrl(path: string): boolean {
	const reg =
		/^(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?(\/#\/)?(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
	return reg.test(path);
}

// 判断是否为图片类型名称
export function isImgTypeByName(name: string) {
	return /\.(jpg|jpeg|png|gif|bpm|webp)$/i.test(name);
}

// 根据名称判断是否为视频
export const isVideoTypeByName = (name: string) => {
	return /\.(mp4|ogg|webm)$/i.test(name);
};

export function isEmpty<T = unknown>(val: T): val is T {
	if (isArray(val) || isString(val)) {
		return val.length === 0;
	}

	if (val instanceof Map || val instanceof Set) {
		return val.size === 0;
	}

	if (isObject(val)) {
		return Object.keys(val).length === 0;
	}

	return false;
}

/**
 * 判断路径是否包含扩展名
 * @param path 需要检查的路径
 * @returns 如果路径包含扩展名返回true，否则返回false
 */
export function hasExtension(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  
  // 获取路径的最后一部分（文件名）
  const fileName = path.split('/').pop();
  
  // 检查文件名是否包含至少一个点，且点不在开头
  return !!fileName && fileName.indexOf('.') > 0;
}
