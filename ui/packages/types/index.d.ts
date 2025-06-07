export * from './src';

// 工作时间
export const WORKING_TIME = 'workingTime';

// 切换到手机端前的上次布局方式
export const BEFORE_RESIZE_LAYOUT = 'beforeResizeLayout';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$globals: {
			apiKey: string;
			apiUrl: string;
			// 前端静态目录
			frontStaticDir: string;
			// 其他全局属性的类型定义
		};
	}
}

