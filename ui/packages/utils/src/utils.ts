import type { App, Component, Plugin } from 'vue';
import { isArray } from './is';
import { isObject } from '@vueuse/core';
// 导出一个空方法
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
	return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  appendUrlParams('www.google.com', obj)
 *  ==>www.google.com?a=3&b=4
 */
export function appendUrlParams(baseUrl: string, obj: any): string {
	let parameters = '';
	for (const key in obj) {
		parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
	}
	parameters = parameters.replace(/&$/, '');
	return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
	let key: string;
	for (key in target) {
		src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
	}
	return src;
}

export function openWindow(url: string, opt?: { target?: string; noOpener?: boolean; noReferrer?: boolean }) {
	const { target = '__blank', noOpener: noOpener = true, noReferrer: noReferrer = true } = opt || {};
	const feature: string[] = [];

	noOpener && feature.push('noOpener=yes');
	noReferrer && feature.push('noReferrer=yes');

	window.open(url, target, feature.join(','));
}

export const regexUrl = new RegExp(
	'^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
	'i'
);

// // dynamic use hook props
// export function getDynamicProps<T, U>(props: T): Partial<U> {
// 	const ret: Recordable = {};

// 	Object.keys(props as Object).map((key) => {
// 		ret[key] = unref((props as Recordable)[key]);
// 	});

// 	return ret as Partial<U>;
// }

// export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
// 	if (!route) return route;
// 	const { matched, ...opt } = route;
// 	return {
// 		...opt,
// 		matched: (matched
// 			? matched.map((item) => ({
// 				meta: item.meta,
// 				name: item.name,
// 				path: item.path,
// 			}))
// 			: undefined) as RouteRecordNormalized[],
// 	};
// }

export const withInstall = <T>(component: T, alias?: string) => {
	const comp = component as any;
	comp.install = (app: App) => {
		app.component(comp.name || comp.displayName, component as Component);
		if (alias) {
			app.config.globalProperties[alias] = component;
		}
	};
	return component as T & Plugin;
};

const ordinaryArr: Array<string> = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
];

const specialArr: Array<string> = ['_', '-', '$', '%', '&', '+', '!'];

/**
 * @description 生成8位初始密码
 * @param {number} length 需要生成字符的长度
 */
export const randText = function (length: number, isSpecial = false) {
	// console.log(length, isSpecial);
	let txt = '';
	let txtArr = [...ordinaryArr];
	if (isSpecial) {
		txtArr = [...txtArr, ...specialArr];
	}
	const pasArrLen = txtArr.length;
	for (let i = 0; i < length; i++) {
		const x = Math.floor(Math.random() * pasArrLen);
		txt += txtArr[x];
	}
	return txt;
};

const numberArr: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// 随机生成多位数字
export const randNumber = (len: number): string => {
	let txt = '';
	const pasArrLen = numberArr.length;
	for (let i = 0; i < len; i++) {
		const x = Math.floor(Math.random() * pasArrLen);
		txt += numberArr[x];
	}
	return txt;
};

// 获取文件的Base64值
export const getBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
};

// 组装条件
export const getCondition = (data: any) => {
	// console.log('----', JSON.stringify(data));
	const queryCondition: any[] = [];
	const excludes = ['pageIndex', 'pageSize', 'page'];
	// delete data['pageIndex'];
	for (const key in data) {
		// console.log(info[key]);
		if (excludes.includes(key)) continue;
		if (data[key] !== undefined && data[key] !== null) {
			// console.log(typeof(info[key]), info[key],  info[key] === '');
			if (data[key] === '') continue;
			if (key == 'area' && isArray(data[key])) {
				const d = data[key];
				for (let i = 0; i < d.length; i++) {
					let k = 'province';
					if (i == 1) {
						k = 'city';
					} else if (i == 2) {
						k = 'area';
					}
					queryCondition.push({
						field: k,
						operator: '=',
						value: d[i],
					});
				}
			} else {
				const obj = {
					field: key,
					operator: typeof data[key] == 'string' ? 'like' : '=',
					value: data[key],
				};
				// console.log(obj);
				queryCondition.push(obj);
			}
		}
		delete data[key];
	}

	return queryCondition;
};

/**
 * 位数补全(单位数补全为双位数,常见的比如1补全为01)
 * @value {string | number} 需要补全的值
 * */
export const completionNumber = function (value: string | number): string {
	let num;

	if (typeof value === 'string') {
		if (!isNaN(Number(value))) {
			num = Number(value);
		} else {
			throw new Error('请传入正确的补全数字');
		}
	} else {
		num = value;
	}

	if (num < 10) {
		num = `0${num}`;
	}

	return num.toString();
};

/**
 * 正则
 * */
export const regular = {
	zeroToHundred: /^(\d{1,2}(\.[0-9]{1})?)$|^100$/,
	phone: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, //手机号码
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{6,}$/, // 密码
	email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, //电子邮箱
	letter: /[a-zA-Z]/, //只允许英文字母
	numbers: /^[0-9]*$/, // 数字
	number: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/, //数字(正数、负数，小数)
	positiveInteger: /^[1-9]+$/, //正整数
	negativeInteger: /^-[1-9]+$/, //负整数
	nonzeroInteger: /^-?[1-9]\d*$/, //非零整数
	float: /^(0|[+-]?((0|([1-9]\d*))\.\d+)?)$/, //浮点数
	nonzeroFloat: /^[+-]?((0|([1-9]\d*))\.\d+)?$/, //非零浮点数
	positiveFloat: /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+|0)$/, //正浮点数
	nonzeroPositiveFloat: /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/, //非零正浮点数
	negativeFloat: /^(0|-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))$/, //负浮点数
	nonzeroNegativeFloat: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/, //非零负浮点数
	date: /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/, //日期校验
	time: /([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, //时间校验
	dateTime:
		/^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, //日期时间校验

	url: /(http|https):\/\/\S*/, // 校验url地址
};

// 通用编码解析解析出自己及期所有父类
export const parseCode = (code: string, defBit = 2): string[] => {
	const res: string[] = [];
	const times = code.length / defBit;
	for (let i = 1; i < times + 1; i++) {
		res.push(code.substr(0, i * defBit));
	}
	return res;
};

// 将数组转换为一个指定key-value的对象
export const arrayToObject = (arr: Array<any>, keyField: string, valField: string): object => {
	const data: any = {};
	for (const item of arr) {
		if (item[keyField]) {
			data[item[keyField]] = item[valField];
		}
	}
	return data;
};

// 将对象转换为数组
export const objToArray = (obj: any, keyField: string, valField: string): Array<any> => {
	const arr: Array<any> = [];
	for (const key in obj) {
		const d: any = {};
		d[keyField] = key;
		d[valField] = obj[key];
		arr.push(d);
	}
	return arr;
};

/**
 * 是否是外部链接
 * @param path
 */
export function isExternal(path: string): boolean {
	return /^(https?|ftp|mailto|tel):/.test(path);
}

/**
 * 防抖
 * @param fn 执行函数
 * @param ms 间隔毫秒数
 */
export const debounce = (fn: Function, ms: number) => {
	return (...args: any[]) => {
		if (window.lazy) {
			clearTimeout(window.lazy);
		}
		window.lazy = window.setTimeout(() => {
			fn(...args);
		}, ms);
	};
};

// 深度比较两个对象是否相等
export const deepEqual = (obj1: any, obj2: any): boolean => {
	if (obj1 === obj2) {
		return true;
	}

	if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
		return false;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
};

// 查找比较两个对象的值
export const findDifferValues = (originValues: any, newValues: any): any => {
	const differValues: any = {};

	for (const key in newValues) {
		// 判断是否为对象的自身属性，以及两个对象中属性的值是否相等
		if (newValues.hasOwnProperty(key) && !deepEqual(originValues[key], newValues[key])) {
			differValues[key] = newValues[key];
		}
	}

	return differValues;
};

// 下载文本文件
export function downloadText(filename: string, text: string) {
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

/**
 * 将驼峰命名法的字符串转换为带下划线的字符串
 * @param str - 驼峰命名法的字符串
 * @returns 带下划线的字符串
 */
export function camelToSnakeCase(str: string): string {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// 获取文件类型
export const getFileType = (fileName: string): string => {
	if (!fileName) return '';
	// 获取文件扩展名
	const extension = fileName.split('.').pop()?.toLowerCase() || '';

	// 定义各类文件的扩展名
	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
	const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'flv', 'wmv'];
	const docExtensions = ['doc', 'docx'];
	const xlsExtensions = ['xls', 'xlsx'];
	const zipExtensions = ['zip', 'rar'];
	const pdfExtensions = ['pdf'];
	const pptExtensions = ['ppt', 'pptx'];

	// 根据扩展名返回文件类型
	if (imageExtensions.includes(extension)) {
		return 'image';
	} else if (videoExtensions.includes(extension)) {
		return 'video';
	} else if (docExtensions.includes(extension)) {
		return 'doc';
	} else if (xlsExtensions.includes(extension)) {
		return 'xls';
	} else if (zipExtensions.includes(extension)) {
		return 'zip';
	} else if (pdfExtensions.includes(extension)) {
		return 'pdf';
	} else if (pptExtensions.includes(extension)) {
		return 'ppt';
	} else {
		return 'unknown';
	}
};

// 获取组件名
export const getCompName = (components: any, pageName: string): string => {
	let compNames = Object.keys(components).filter(key => {
		let comp = components[key];
		let name = comp.__name || comp.name;
		// 先取带详情的页面
		if (name && pageName.toLowerCase() === key.toLowerCase()) {
			return key;
		}
	});

	if (compNames.length) {
		return compNames[0];
	}

	return '';
};

// 取一个数组的平均值
export const getAverage = (arr: any[]): number | undefined => {
	// 过滤并转换有效数值
	const validNumbers = arr
		.map(item => Number(item)) // 将元素转换为 Number 类型
		.filter(item => typeof item === 'number' && !isNaN(item) && item !== 0); // 过滤掉非数值和 NaN

	if (validNumbers.length === 0) {
		return undefined; // 处理空数组或没有有效数值的情况
	}

	// 计算有效数值的总和
	const sum = validNumbers.reduce((acc, current) => acc + current, 0);

	// 计算平均值，并保留最多 4 位小数
	const average = parseFloat((sum / validNumbers.length).toFixed(4));

	return average;
};

// 取一个数组的最小值和最大值
export const getMinMax = <T>(arr: T[]): { min: T | undefined; max: T | undefined } => {
	if (arr.length === 0) {
		return { min: undefined, max: undefined }; // 处理空数组
	}

	const result = arr.reduce(
		(acc, current) => {
			return {
				min: current < acc.min ? current : acc.min,
				max: current > acc.max ? current : acc.max,
			};
		},
		{ min: arr[0], max: arr[0] } // 初始值为数组的第一个元素
	);

	return result;
};

// 将table header数据转换为map
export const convertColumnsToMap = (columns: any[], excludeKeys: string[] = []): { [key: string]: string } => {
	return columns.reduce((map, column) => {
		// 隐藏的不导出
		if (!column.isShow) return map;

		// 标题为空的不导出
		if (column.label === '') return map;

		// 属性为空的和指定排除的不导出
		if (!column.prop || column.prop == '' || excludeKeys.includes(column.prop)) {
			return map;
		}
		map[column.prop] = column.label;
		return map;
	}, {});
};

/**
 * 将变量替换到给定的内容中
 * @param content - 内容
 * @param data - 变量
 * @returns 新内容
 */
export const replaceVariable = (content: string, data: { [key: string]: any }): string => {
	return content.replace(/\$\{(\w+)\}/g, (match, key) => {
		// 如果对象中存在对应的键值，则替换；否则保留原样
		return key in data ? data[key] : match;
	});
};

/**
 * 将对象转换为扁平化对象
 * @param obj - 对象
 * @param maxLevel - 最大层级
 * @param parentKey - 父级键名
 * @param currentLevel - 当前层级
 * @param result - 结果对象
 */
export const flattenObjectToLevel = (
	obj: Record<string, any>,
	maxLevel: number = 0,
	parentKey: string = '',
	currentLevel: number = 0,
	result: Record<string, any> = {}
): Record<string, any> => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			// console.log('key', key, obj[key]);
			const newKey = parentKey ? `${parentKey}.${key}` : key; // 构建新的键名
			if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
				// console.log('obj[key]', obj[key], currentLevel, maxLevel);
				if (currentLevel < maxLevel) {
					// 递归处理嵌套对象
					flattenObjectToLevel(obj[key], maxLevel, newKey, currentLevel + 1, result);
				} else {
					// 超过指定层级，将嵌套对象转为字符串
					result[newKey] = JSON.stringify(obj[key]);
				}
			} else if (Array.isArray(obj[key])) {
				// 如果是数组，直接赋值
				result[newKey] = JSON.stringify(obj[key]);
			} else {
				// 如果是基本类型，直接赋值
				result[newKey] = obj[key];
			}
		}
	}
	return result;
};

/**
 * 将对象中指定字段的数组或对象值转换为字符串
 * @param obj 要处理的对象
 * @param fields 需要检查的字段名数组
 * @returns 处理后的新对象
 */
export const convertComplexValuesToString = <T extends Record<string, any>>(obj: T, fields: (keyof T)[]): T => {
	// 创建新对象避免修改原对象
	const result: T = { ...obj };

	fields.forEach(field => {
		if (field in result) {
			const value = result[field];

			if (Array.isArray(value)) {
				// 如果是数组，转换为JSON字符串
				result[field] = JSON.stringify(value) as any;
			} else if (typeof value === 'object' && value !== null) {
				// 如果是对象，转换为JSON字符串
				result[field] = JSON.stringify(value) as any;
			}
			// 其他类型保持不变
		}
	});

	return result;
};

/**
 * 判断值是否有效
 * @param val 值
 * @returns 是否有效
 */
const isValidValue = (val: any): boolean => {
	return val !== undefined && val !== null && !(typeof val === 'string' && val.trim() === '');
};

/**
 * 合并两个对象
 * @param obj 原始对象
 * @param content 内容对象
 * @returns 合并后的新对象
 */
export const mergeObjects = (obj: Record<string, any>, content: Record<string, any>): Record<string, any> => {
	const result: Record<string, any> = {};

	const keys = new Set([...Object.keys(obj), ...Object.keys(content)]);

	for (const key of keys) {
		const outerVal = obj[key];
		const innerVal = content[key];

		if (isValidValue(outerVal)) {
			result[key] = outerVal;
		} else if (isValidValue(innerVal)) {
			result[key] = innerVal;
		}
	}

	return result;
};
