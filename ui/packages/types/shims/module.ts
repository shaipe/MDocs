declare module '*.vue' {
	import { DefineComponent } from 'vue';
	const Component: DefineComponent<object, object, any>;
	export default Component;
}

declare module 'virtual:*' {
	const result: any;
	export default result;
}
