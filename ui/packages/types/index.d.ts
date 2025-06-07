export * from './src';
export declare const WORKING_TIME = "workingTime";
export declare const BEFORE_RESIZE_LAYOUT = "beforeResizeLayout";
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $globals: {
            apiKey: string;
            apiUrl: string;
            frontStaticDir: string;
        };
    }
}
//# sourceMappingURL=index.d.ts.map