import { useGlobSetting } from './config';
const projectName = 'htui'; // import.meta.env.VITE_GLOB_APP_TITLE;

const globSetting = useGlobSetting();

export const warn = (message: string) => {
  console.warn(`[${projectName} warn]:${message}`);
}

export const error = (message: string) => {
  throw new Error(`[${projectName} error]:${message}`);
}

/// 输出日志
export const log = (message: string) => {
	console.log(`\u2728%c${globSetting.title}%c\n${message}`, "color: black; border-radius: 3px; padding: 3px; background: #00DC82", "border-radius: 3px 3px; padding: 5px; background: #00DC8200", "");
}

/**
 * 输出日志并显示调用位置
 * @param args 日志内容
 */
export const traceLog = (...args: any[]) => {
	const stack = new Error().stack; // 获取调用栈
	console.log(...args);
	console.log('调用位置:', stack?.split('\n')[2].trim()); // 提取关键行
}
