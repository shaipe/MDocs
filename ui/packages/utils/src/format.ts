import dayjs, { type ConfigType } from 'dayjs';
import { convertTimeUnit } from './datetime';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

// 格式化日期时间
export function formatDateTime(date: ConfigType, format = DATE_TIME_FORMAT): string {
	return dayjs(date).format(format);
}

// 格式化日期
export function formatDate(date: ConfigType, format = DATE_FORMAT): string {
	if (!date) {
		return '';
	}
	return dayjs(date).format(format);
}

// 获取当前日期时间
export const nowFormatDate = (format = DATE_FORMAT) => formatDate(new Date(), format);

// 格式化时长
export function formatDuration(seconds: number): string {
	const days = Math.floor(seconds / (24 * 3600));
	const hours = Math.floor((seconds % (24 * 3600)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	let result = '';

	if (days > 0) {
		result += `${days}天`;
	}
	if (hours > 0) {
		result += `${hours}时`;
	}
	// 分
	if (minutes > 0) {
		result += `${minutes}分`;
	}
	// 秒
	if (remainingSeconds > 0) {
		result += `${remainingSeconds}秒`;
	}

	return result;
}

// 格式化显示距离时间
export function formatDistanceTime(interval: number): string {
	let bytes: string[] = [];
	const units = convertTimeUnit(interval);
	if (units.days !== 0) {
		bytes.push(units.days + '天');
	}

	if (units.hours !== 0) {
		bytes.push(units.hours + '小时');
	}

	if (units.minutes !== 0) {
		bytes.push(units.minutes + '分');
	}

	if (units.seconds !== 0) {
		bytes.push(units.seconds + '秒');
	}

	if (units.ms !== 0) {
		bytes.push(units.ms + '毫秒');
	}

	return bytes.join('');
}

// 时间差
export function formatTimeDifference(targetTime: Date): string {
	const currentTime = new Date();
	const timeDifference = currentTime.getTime() - targetTime.getTime(); // 时间差（毫秒）

	// 小于60分钟显示分钟
	if (timeDifference < 60 * 60 * 1000) {
		const minutes = Math.floor(timeDifference / (60 * 1000));
		return `${minutes} 分钟前`;
	}

	// 小于24小时显示小时
	if (timeDifference < 24 * 60 * 60 * 1000) {
		const hours = Math.floor(timeDifference / (60 * 60 * 1000));
		return `${hours} 小时前`;
	}

	// 大于24小时显示天
	const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
	return `${days} 天前`;
}

// 处理查询时使用的日期
// 开始日期时间设置为： 00:00:00 结束时间设置为： 23:59:59
export const formatQueryDate = (t: string, isStart = true) => {
	const dts = t.split(' ');
	return dts[0] + (isStart ? ' 00:00:00' : ' 23:59:59');
};
/*
 * 字符串补位
 */
const padStart = (str: string, maxLength: number, fillString = ' ') => {
	if (str.length >= maxLength) return str;

	const fillLength = maxLength - str.length;
	let times = Math.ceil(fillLength / fillString.length);
	while ((times >>= 1)) {
		fillString += fillString;
		if (times === 1) {
			fillString += fillString;
		}
	}
	return fillString.slice(0, fillLength) + str;
};

/*
 * 格式化时间戳
 */
export const formatTime = (dateTime: string | number | null = null, fmt = 'yyyy-mm-dd hh:MM:ss') => {
	if (dateTime == 'none') return dateTime;
	if (!dateTime) dateTime = Number(new Date());
	if (dateTime.toString().length === 10) {
		dateTime = +dateTime * 1000;
	}

	const date = new Date(dateTime);
	let ret;
	const opt: any = {
		'y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月
		'd+': date.getDate().toString(), // 日
		'h+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		's+': date.getSeconds().toString(), // 秒
	};
	for (const k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : padStart(opt[k], ret[1].length, '0'));
		}
	}
	return fmt;
};

// 金额转大写
export const formatRMB = (amount: number): string => {
	if (amount < 0 || amount > 9999999999999.99) {
		throw new Error('金额超出转换范围');
	}

	const units = ['元', '角', '分'];
	const bigNumbers = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
	const bigUnits = ['', '拾', '佰', '仟'];
	const bigGroupUnits = ['', '万', '亿', '兆'];

	const [integerPart, decimalPart] = amount.toFixed(2).split('.'); // 保留两位小数并分割
	let result = '';

	// 处理整数部分
	const intLen = integerPart.length;
	if (parseInt(integerPart, 10) !== 0) {
		let zeroFlag = false; // 用于标记是否需要添加“零”
		for (let i = 0; i < intLen; i++) {
			const digit = parseInt(integerPart[i], 10);
			const position = intLen - i - 1;
			const groupIndex = Math.floor(position / 4); // 获取组索引（万、亿等）
			const unitIndex = position % 4; // 获取小单位索引（拾、佰等）

			if (digit === 0) {
				zeroFlag = true; // 记录零的状态
			} else {
				if (zeroFlag) {
					result += bigNumbers[0]; // 补零
					zeroFlag = false;
				}
				result += bigNumbers[digit] + bigUnits[unitIndex];
			}

			// 添加组单位
			if (unitIndex === 0 && groupIndex > 0) {
				result += bigGroupUnits[groupIndex];
			}
		}
		result += units[0];
	}

	// 处理小数部分
	if (decimalPart !== '00') {
		for (let i = 0; i < decimalPart.length; i++) {
			const digit = parseInt(decimalPart[i], 10);
			if (digit !== 0) {
				result += bigNumbers[digit] + units[i + 1];
			}
		}
	} else {
		result += '整';
	}

	return result.replace(/零+/g, '零').replace(/零元/g, '元').replace(/元整$/, '元整');
};

// 对数字进行格式化输出
export const formatNumber = (val: number | string, fixed: number) => {
	// console.log(typeof val, fixed);
	if (typeof val == 'string') {
		return parseFloat(val).toFixed(fixed);
	} else if (typeof val == 'number') {
		return val.toFixed(fixed);
	}
	return val;
};

const UNIT_SIZE: any = {
	EB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
	PB: 1024 * 1024 * 1024 * 1024 * 1024,
	TB: 1024 * 1024 * 1024 * 1024,
	GB: 1024 * 1024 * 1024,
	MB: 1024 * 1024,
	KB: 1024,
};

/**
 * 格式化数字输出,将数字转为合适的单位输出,默认按照1024层级转为文件单位输出
 * @param size
 * @param format
 */
export const formatSize = (size: number) => {
	if (isNaN(size) || size == undefined || size < 0) {
		return '--';
	}
	const UNITS_FILE_SIZE = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
	// 给定的判断暂时只从GB开邕
	for (let i = 3; i > -1; i--) {
		const unit = UNITS_FILE_SIZE[i];
		if (size > UNIT_SIZE[unit]) {
			return (size / UNIT_SIZE[unit]).toFixed(2) + unit;
		}
	}
	return size + UNITS_FILE_SIZE[0];
};

// 格式化金额显示
export const formatAmount = (amount: number, prefix = '', isMaxUnit = true): string => {
	if (typeof amount === 'string') {
		amount = parseFloat(amount);
	}

	if (isNaN(amount) || amount == undefined || amount === null) {
		return '--';
	}

	if (amount > 99999999 && isMaxUnit) {
		return prefix + (amount / 100000000).toFixed(2) + '亿';
	} else if (amount > 9999 && isMaxUnit) {
		return prefix + (amount / 10000).toFixed(2) + '万';
	} else {
		return prefix + amount.toFixed(2) + '元';
	}
};

// 格式化数据
export const formatData = (data: any, formatType: 'date' | 'datetime' | 'time' | 'number' | 'size' | 'amount' | null | '' = '') => {
	if (formatType === 'date') {
		return formatDate(data);
	} else if (formatType === 'datetime') {
		return formatDateTime(data, 'YYYY年MM月DD日 HH:mm:ss');
	} else if (formatType === 'time') {
		return formatTime(data);
	} else if (formatType === 'number') {
		return formatNumber(data, 0);
	} else if (formatType === 'size') {
		return formatSize(data);
	} else if (formatType === 'amount') {
		return formatAmount(data);
	} else {
		return data;
	}
};
