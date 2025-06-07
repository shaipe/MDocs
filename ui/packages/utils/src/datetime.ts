/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs, { type Dayjs } from 'dayjs';
import { formatDate } from './format';

export const dateUtil = dayjs;

/// 获取下个月的今天
export const nextMonthDay = () => {
	const d = new Date();
	d.setMonth(d.getMonth() + 1);
	return d;
};
/**
 * 对时间戳进行格式化
 * @param s 时间戳
 * @param format 格式化字符
 */
export const stampDate = (s: string | number, format = 'yyyy-MM-dd HH:mm:ss') => {
	if (s == null || s == undefined) {
		return '';
	}
	if (typeof s == 'string') {
		s = s.replace('Z', '');
	}
	// 对时间戳进和埏理
	if (typeof s == 'number') {
		// 对10位的时间戳转换为13位的时间戳
		if (s < 10000000000) {
			s = s * 1000;
		}
	}
	const dateTime = new Date(s);
	if (dateTime < new Date('2015-1-1 00:00:00')) {
		return '';
	}
	const o: Record<string, any> = {
		'M+': dateTime.getMonth() + 1, //month
		'd+': dateTime.getDate(), //day
		'h+': dateTime.getHours(), //hour
		'm+': dateTime.getMinutes(), //minute
		's+': dateTime.getSeconds(), //second
		'q+': Math.floor((dateTime.getMonth() + 3) / 3), //quarter
		'f+': dateTime.getMilliseconds(), //millisecond
		S: dateTime.getMilliseconds(), //millisecond
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (const k in o)
		if (new RegExp('(' + k + ')', 'gi').test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	return format;
};

// 转换为时间单为：x天x时x分x秒
export function convertTimeUnit(interval: number) {
	const minute = 60 * 1000;
	const hour = 60 * minute;
	const day = 24 * hour;

	// 时
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	// 剩余
	let residue = interval;

	// 天
	if (residue > day) {
		days = Math.floor(residue / day);
		residue = residue - days * day;
	}

	// 小时
	if (residue > hour) {
		hours = Math.floor(residue / hour);
		residue = residue - hours * hour;
	}

	// 分
	if (residue > minute) {
		minutes = Math.floor(residue / minute);
		residue = residue - minutes * minute;
	}

	// 秒
	if (residue > 1000) {
		seconds = Math.floor(residue / 1000);
		residue = residue - seconds * 1000;
	}

	return {
		days,
		hours,
		minutes,
		seconds,
		ms: residue,
	};
}

export const convertTimeUnitToString = (interval: number, className: string = '') => {
	const { days, hours, minutes, seconds, ms } = convertTimeUnit(interval);
	if (days > 0) {
		return `${days}<span class="${className}">天</span>${hours}<span class="${className}">时</span>${minutes}<span class="${className}">分</span>${seconds}${ms > 0 ? `.${ms}` : ''}<span class="${className}">秒</span>`;
	}
	if (hours > 0) {
		return `${hours}<span class="${className}">时</span>${minutes}<span class="${className}">分</span>${seconds}${ms > 0 ? `.${ms}` : ''}<span class="${className}">秒</span>`;
	}
	if (minutes > 0) {
		return `${minutes}<span class="${className}">分</span>${seconds}${ms > 0 ? `.${ms}` : ''}<span class="${className}">秒</span>`;
	}
	if (seconds > 0) {
		return `${seconds}${ms > 0 ? `.${ms}` : ''}<span class="${className}">秒</span>`;
	}

	return `${ms > 0 ? `0.${ms}` : ''}<span class="${className}">秒</span>`;
};

//   // 示例
//   const targetTime1 = new Date("2023-10-25T12:00:00"); // 60分钟前
//   const targetTime2 = new Date("2023-10-25T06:00:00"); // 6小时前
//   const targetTime3 = new Date("2023-10-20T12:00:00"); // 5天前

//   console.log(formatTimeDifference(targetTime1)); // "60 分钟前"
//   console.log(formatTimeDifference(targetTime2)); // "6 小时前"
//   console.log(formatTimeDifference(targetTime3)); // "5 天前"

/**
 * 比较两个日期相差的天数
 * @param startDate
 * @param endDate
 * @returns
 */
export const diffDays = (startDate: string | Dayjs | Date, endDate: string | Dayjs | Date) => {
	const start = dayjs(startDate);
	const end = dayjs(endDate);

	return end.diff(start, 'd');
};

/**
 * 过期时间的输出
 * @param expTime 过期时间
 * @returns
 */
export const expireRender = (expTime: Date | string, showDate = true) => {
	if (!expTime) return '';

	let dateStr = formatDate(expTime || '', 'YYYY年MM月DD日');
	if (dateStr === '2015年06月07日') return '';

	let color = '';
	let days = diffDays(new Date(), expTime);
	if (days >= 15 && days < 60) {
		color = '#E6A23C';
	} else if (days < 15) {
		color = '#FF0000';
	}

	let txt = '还有';
	let suffix = '天到期';
	if (days < 0) {
		txt = '已过期';
		days = 0 - days;
		suffix = '天';
	}

	return h('span', { style: { color: color } }, (showDate ? `${dateStr} - ` : '') + `${txt}${days}${suffix}`);
};

/**
 * 增加日期时间并格式化
 * @param dateString - 原始日期时间字符串
 * @param amount - 增加的数量
 * @param unit - 增加的单位（'day' | 'hour' | 'minute' 等）
 * @param format - 输出格式化字符串（默认 'YYYY-MM-DD HH:mm:ss'）
 * @returns 增加后的日期时间字符串
 */
export const increaseDateTime = (
	dateString: string,
	amount: number,
	unit: 'day' | 'hour' | 'minute' | 'second',
	format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
	// 检查输入日期是否合法
	if (!dayjs(dateString).isValid()) {
		throw new Error('Invalid date string');
	}

	// 增加指定的时间单位
	const newDateTime = dayjs(dateString).add(amount, unit);

	// 格式化并返回新日期时间
	return newDateTime.format(format);
};

/**
 * 获取当前月的第一天和最后一天
 * @returns {Object} 包含第一天和最后一天的日期对象
 */
export const getCurrentMonthDays = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();

	// 获取当月第一天
	const firstDay = new Date(year, month, 1);

	// 获取当月最后一天
	const lastDay = new Date(year, month + 1, 0);

	return {
		firstDay,
		lastDay,
	};
};

/**
 * 获取当前月的第一天和最后一天（格式化版本）
 * @returns {Object} 包含格式化后的第一天和最后一天的字符串
 */
export const getCurrentMonthDaysFormatted = () => {
	const { firstDay, lastDay } = getCurrentMonthDays();
	return {
		firstDay: formatDate(firstDay),
		lastDay: formatDate(lastDay),
	};
};
