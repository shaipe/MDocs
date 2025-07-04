import type { CreateAxiosOptions } from './axiosTransform';
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { RequestOptions, RequestResult } from '@htui/types';
import axios from 'axios';
import qs from 'qs';
import { isFunction } from '@htui/utils';
import { AxiosCanceler } from './axiosCancel';
import { ContentTypeEnum, RequestEnum } from './constants';
import { cloneDeep } from 'lodash-es';
export * from './axiosTransform';

/**
 * @description: axios module
 */
export class HAxios {
	private axiosInstance: AxiosInstance;
	private readonly options: CreateAxiosOptions;

	constructor(options: CreateAxiosOptions) {
		this.options = options;
		this.axiosInstance = axios.create(options);
		this.setupInterceptors();
	}

	/**
	 * @description: Create axios instance
	 */
	private createAxios(config: CreateAxiosOptions): void {
		this.axiosInstance = axios.create(config);
	}

	private getTransform() {
		const { transform } = this.options;
		return transform;
	}

	getAxios(): AxiosInstance {
		return this.axiosInstance;
	}

	/**
	 * @description: Reconfigure axios
	 */
	configAxios(config: CreateAxiosOptions) {
		if (!this.axiosInstance) {
			return;
		}
		this.createAxios(config);
	}

	/**
	 * @description: Set general header
	 */
	setHeader(headers: any): void {
		if (!this.axiosInstance) {
			return;
		}
		Object.assign(this.axiosInstance.defaults.headers, headers);
	}

	/**
	 * @description: Interceptor configuration
	 */
	private setupInterceptors() {
		const transform = this.getTransform();
		if (!transform) {
			return;
		}
		const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;

		const axiosCanceler = new AxiosCanceler();

		// Request interceptor configuration processing
		this.axiosInstance.interceptors.request.use((config: any) => {
			// If cancel repeat request is turned on, then cancel repeat request is prohibited
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			const { ignoreCancelToken } = config.requestOptions;
			const ignoreCancel = ignoreCancelToken !== undefined ? ignoreCancelToken : this.options.requestOptions?.ignoreCancelToken;

			!ignoreCancel && axiosCanceler.addPending(config);
			if (requestInterceptors && isFunction(requestInterceptors)) {
				config = requestInterceptors(config, this.options);
			}
			return config;
		}, undefined);

		// Request interceptor error capture
		requestInterceptorsCatch &&
			isFunction(requestInterceptorsCatch) &&
			this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

		// Response result interceptor processing
		this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
			res && axiosCanceler.removePending(res.config);
			if (responseInterceptors && isFunction(responseInterceptors)) {
				res = responseInterceptors(res);
			}
			return res;
		}, undefined);

		// Response result interceptor error capture
		responseInterceptorsCatch &&
			isFunction(responseInterceptorsCatch) &&
			this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
	}

	// support form-data
	supportFormData(config: AxiosRequestConfig) {
		const headers = config.headers || this.options.headers;
		const contentType = headers?.['Content-Type'] || headers?.['content-type'];

		if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data') || config.method?.toUpperCase() === RequestEnum.GET) {
			return config;
		}

		return {
			...config,
			data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
		};
	}

	get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'GET' }, options);
	}

	post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'POST' }, options);
	}

	put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'PUT' }, options);
	}

	delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'DELETE' }, options);
	}

	request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		let conf: CreateAxiosOptions = cloneDeep(config);
		const transform = this.getTransform();

		const { requestOptions } = this.options;

		const opt: RequestOptions = Object.assign({}, requestOptions, options);

		const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};

		if (beforeRequestHook && isFunction(beforeRequestHook)) {
			conf = beforeRequestHook(conf, opt);
		}
		conf.requestOptions = opt;

		conf = this.supportFormData(conf);

		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request<any, AxiosResponse<RequestResult>>(conf)
				.then((res: AxiosResponse<RequestResult>) => {
					if (transformRequestHook && isFunction(transformRequestHook)) {
						try {
							const ret = transformRequestHook(res, opt);
							resolve(ret);
						} catch (err) {
							reject(err || new Error('request error!'));
						}
						return;
					}
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					if (requestCatchHook && isFunction(requestCatchHook)) {
						reject(requestCatchHook(e, opt));
						return;
					}
					if (axios.isAxiosError(e)) {
						// rewrite error message from axios in here
					}
					reject(e);
				});
		});
	}

	download(config: AxiosRequestConfig, options?: RequestOptions) {
		let conf: CreateAxiosOptions = cloneDeep({ ...config, method: 'POST' });
		const transform = this.getTransform();

		const { requestOptions } = this.options;

		const opt: RequestOptions = Object.assign({}, requestOptions, options);

		const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};

		if (beforeRequestHook && isFunction(beforeRequestHook)) {
			conf = beforeRequestHook(conf, opt);
		}
		conf.requestOptions = opt;

		conf = this.supportFormData(conf);

		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request(conf)
				.then((res: AxiosResponse<RequestResult>) => {
					const filename = res.headers['content-disposition']?.split(';')[1]?.split('=')[1]?.replace(/['"]/g, '') || 'download';
                    // download
					downloadByData(res.data as any, filename);
					resolve('download');
				})
				.catch((e: Error | AxiosError) => {
					console.log(e);
					if (requestCatchHook && isFunction(requestCatchHook)) {
						reject(requestCatchHook(e, opt));
						return;
					}
					if (axios.isAxiosError(e)) {
						// rewrite error message from axios in here
					}
					reject(e);
				});
			// .then((res: AxiosResponse<Blob>) => {
			// 	const blob = res.data;
			// 	console.log(res);
			// 	const filename = res.headers['content-disposition']?.split(';')[1]?.split('=')[1]?.replace(/['"]/g, '') || 'download';
			// 	const link = document.createElement('a');
			// 	link.href = window.URL.createObjectURL(blob);
			// 	link.download = filename;
			// 	link.click();
			// 	window.URL.revokeObjectURL(link.href);
			// 	resolve(res);
			// })
			// .catch(e => {
			// 	reject(e);
			// });
		});
	}
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
	const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
	const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

	const blobURL = window.URL.createObjectURL(blob);
	const tempLink = document.createElement('a');
	tempLink.style.display = 'none';
	tempLink.href = blobURL;
	tempLink.setAttribute('download', filename);
	if (typeof tempLink.download === 'undefined') {
		tempLink.setAttribute('target', '_blank');
	}
	document.body.appendChild(tempLink);
	tempLink.click();
	document.body.removeChild(tempLink);
	window.URL.revokeObjectURL(blobURL);
}
