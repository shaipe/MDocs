import { isObject } from '../index';
import { isNumber, isString } from './is';

// 样式组
const styleGroups = {
	border: {
		label: '边框',
		width: {
			min: 0,
			max: 100,
		},
	},
	background: {
		label: '背景',
	},
	margin: {
		label: '外边距',
	},
	padding: {
		label: '填充',
	},
	text: {
		label: '文本',
	},
	size: {
		label: '大小',
	},
};

// 样式项定义
const styleItems = {
	fontSize: {
		label: '字体大小',
		type: 'number',
		defaultValue: 0,
		min: 8,
		max: 48,
	},
	fontWeight: {
		label: '文本加粗',
		type: 'radio',
		options: [
			{ label: '正常', value: 'normal' },
			{ label: '加粗', value: 'bold' },
		],
	},
	color: {
		label: '颜色',
		type: 'color',
		defaultValue: '#000000',
	},
	align: {
		label: '对齐方式',
		type: 'radio',
		options: [
			{ label: '居左', value: 'left' },
			{ label: '居中', value: 'center' },
			{ label: '居右 ', value: 'right' },
		],
	},
	textAlign: {
		label: '文本对齐',
		type: 'radio',
		options: [
			{ label: '居左', value: 'left' },
			{ label: '居中', value: 'center' },
			{ label: '居右 ', value: 'right' },
		],
	},
	top: {
		label: '上边距',
		type: 'number',
		defaultValue: 0,
		min: -100,
		max: 100,
	},
	right: {
		label: '右边距',
		type: 'number',
		defaultValue: 0,
		min: -100,
		max: 100,
	},
	bottom: {
		label: '下边距',
		type: 'number',
		defaultValue: 0,
		min: -100,
		max: 100,
	},
	left: {
		label: '左边距',
		type: 'number',
		defaultValue: 0,
		min: -100,
		max: 100,
	},
	width: {
		label: '宽度',
		type: 'string',
	},
	height: {
		label: '高度',
		type: 'string',
	},
	radius: {
		label: '圆角',
		type: 'number',
		min: 0,
		max: 100,
	},
	gradient: {
		label: '渐变',
		type: 'radio',
		name: 'gradient',
		options: [
			{ label: '无渐变', value: '' },
			{ label: '线性', value: 'linear-gradient' },
			{ label: '径向', value: 'radial-gradient' },
		],
	},
	styleValue: { label: '样式值', type: 'textarea' },
	style: {
		label: '样式',
		type: 'radio',
		name: 'style',
		options: [
			{ label: '无边框', value: 'none' },
			{ label: '实线', value: 'solid' },
			{ label: '虚线', value: 'dashed' },
		],
	},
	repeat: {
		label: '重复',
		name: 'repeat',
		type: 'select',
		options: [
			{ label: 'no-repeat', value: 'no-repeat' },
			{ label: 'repeat-x', value: 'repeat-x' },
			{ label: 'repeat-y', value: 'repeat-y' },
			{ label: 'repeat', value: 'repeat' },
			{ label: 'space', value: 'space' },
			{ label: 'round', value: 'round' },
		],
	},
	position: {
		label: '位置',
		type: 'select',
		options: [
			{ label: '顶部', value: 'top' },
			{ label: '底部', value: 'bottom' },
			{ label: '左边', value: 'left' },
			{ label: '右边', value: 'right' },
			{ label: '居中', value: 'center' },
		],
	},
	image: {
		label: '图片',
		type: 'image',
	},
};

// 获取样式值
const getStyleValue = (val: any): string | null => {
	if (val != null && val !== undefined) {
		if (isNumber(val)) {
			return val + 'px';
		} else if (val !== '') {
			// 判断是否为纯数字字符串
			if (/^\d+$/.test(val)) {
				return val + 'px';
			}
			return val;
		}
	}
	return null;
};

// 获取通用型样式
const getCommonStyle = (group: string, style: Record<string, any>, isPrefix: boolean = true): Record<string, string> => {
	let obj: Record<string, string> = {};
	for (let key in style) {
		let val = getStyleValue(style[key]);
		if (val) {
			// 对图片背景图的值做特别的处理
			if (group === 'background' && key === 'image') {
				val = 'url(' + val + ')';
			}
			// 对size中的宽高进行特殊处理
			else if (group === 'size' && (key === 'width' || key === 'height')) {
				if (val.indexOf('px') < 0 && val.indexOf('%') < 0 && val !== 'auto') {
					val = val + 'px';
				}
			}
			let name = key;
			if (isPrefix) {
				name = group + key.replace(key[0], key[0].toUpperCase());
			}
			obj[name] = val;
		}
	}
	return obj;
};

// 获取样式信息
const getStyle = (style: Record<string, any>): Record<string, string> => {
	let sty: Record<string, string> = {};
	for (let g in style) {
		// 是否加上组的前缀名
		let isPrefix = true;
		let item = style[g];
		// 文本和大小不加前缀
		if (g === 'text' || g === 'size') {
			isPrefix = false;
		}
		if (isObject(item)) {
			sty = { ...sty, ...getCommonStyle(g, item, isPrefix) };
		} else if (isString(g) && g !== '') {
			sty[g] = getStyleValue(item) || '';
		}
	}

	return sty;
};

export { styleItems, styleGroups, getStyle };
