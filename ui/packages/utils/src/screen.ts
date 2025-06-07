import { useMediaQuery, useWindowSize } from '@vueuse/core';
import { isNumber, isString } from '.';

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/// 获取屏幕大小
export const getScreenSize = () => {
	// 使用 useMediaQuery 函数来检测不同的屏幕大小
	const isXs = useMediaQuery('(max-width: 575px)'); // Extra Small (xs)
	const isSm = useMediaQuery('(min-width: 576px) and (max-width: 767px)'); // Small (sm)
	const isMd = useMediaQuery('(min-width: 768px) and (max-width: 991px)'); // Medium (md)
	const isLg = useMediaQuery('(min-width: 992px) and (max-width: 1199px)'); // Large (lg)
	const isXl = useMediaQuery('(min-width: 1200px)'); // Extra Large (xl)

	// console.log(isXs.value, isMd.value, isSm.value, isLg.value, isXl.value);

	// 根据不同的屏幕大小设置屏幕大小值
	let screenSize = 'xl';

	if (isXs.value) {
		screenSize = 'xs';
	} else if (isSm.value) {
		screenSize = 'sm';
	} else if (isMd.value) {
		screenSize = 'md';
	} else if (isLg.value) {
		screenSize = 'lg';
	} else if (isXl.value) {
		screenSize = 'xl';
	}

	return screenSize;
};

// 获取窗口大小
export const getWindowSize = () => {
	const size = useWindowSize();
	return {
		width: unref(size.width),
		height: unref(size.height),
	};
};

// 组装样式大小
export const packStyleSize = (size: string | number, totalWidth: number = 0) => {
	let s = size;
	if (isNumber(s)) {
		s = `${s}px`;
	} else {
		if (isString(s) && s.indexOf('%') > -1 && totalWidth > 0) {
			s = s.replace('%', '');
			s = (s / 100) * totalWidth + 'px';
		}
	}
	return s;
};
