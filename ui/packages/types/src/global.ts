import type { VNodeChild, PropType as VuePropType } from 'vue';
// import type { RouteRecordItem as IRouteRecordItem } from './router'

declare global {
    // define global
    const __VITE_USE_MOCK__: boolean;

    /* Vite */
    type Recordable<T = any> = Record<string, T>;

    const __APP_INFO__: {
        pkg: {
            name: string;
            version: string;
            dependencies: Recordable<string>;
            devDependencies: Recordable<string>;
        };
        lastBuildTime: string;
    };

    // router
    //   type RouteRecordItem = IRouteRecordItem

    // vue
    type PropType<T> = VuePropType<T>;
    type VueNode = VNodeChild | Element;
    type ApiPromise<T = any> = Promise<T>;

    // utils
    type AnyFunction<T> = (...args: any[]) => T;
    type PartialReturnType<T extends (...args: unknown[]) => unknown> = Partial<ReturnType<T>>;
    type Nullable<T> = T | null;
    type TimeoutHandle = ReturnType<typeof setTimeout>;
    type IntervalHandle = ReturnType<typeof setInterval>;
    type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    };

    interface Fn<T = any, R = T> {
        (...arg: T[]): R;
    }

    interface PromiseFn<T = any, R = T> {
        (...arg: T[]): Promise<R>;
    }

    type RefType<T> = T | null;

    type LabelValueOptions = {
        label: string;
        value: any;
        [key: string]: string | number | boolean;
    }[];

    type EmitType = (event: string, ...args: any[]) => void;

    type TargetContext = '_self' | '_blank';

    interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
        $el: T;
    }

    type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

    type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

    // import.meta
    interface ImportMetaEnv extends ViteEnv {
        __: never;
    }

    interface ViteEnv {
        VITE_USE_MOCK: boolean;
        VITE_PUBLIC_PATH: string;
        VITE_PORT: number;
        VITE_PROXY: [string, string][];
        VITE_OPEN: boolean;
        VITE_GLOB_APP_TITLE: string;
        // 系统全局平台
        VITE_GLOB_PLATFORM: number;
        // VITE_GLOB_APP_SHORT_NAME: string;
        VITE_GLOB_API_URL: string;
        VITE_DROP_CONSOLE: boolean;
        VITE_USE_HTTPS: boolean;
        VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none';
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
        VITE_USE_IMAGEMIN: boolean;
        VITE_BASE_PATH: string;
        VITE_REPORT: boolean;
        VITE_PWA: boolean;
        // 项目代码
        VITE_PROJECT_CODE?: string;
    }

    interface Window {
        existLoading: boolean;
        lazy: number;
        unique: number;
        tokenRefreshing: boolean;
        requests: Function[];
        eventSource: EventSource;
        loadLangHandle: Record<string, any>;
    }
}

// declare module '@vue/runtime-core' {
// 	interface ComponentCustomProperties {
// 		$globals: {
// 			apiKey: string;
// 			apiUrl: string;
// 			// 前端静态目录
// 			frontStaticDir: string;
// 			// 其他全局属性的类型定义
// 		};
// 	}
// }
