import { isFunction } from '@htui/utils';
import { fetchEventSource } from '@microsoft/fetch-event-source';

class MyEventSource {
	eventSourceUrl = '';
	onMessage: any = null;
	eventSource: any = null;

	options: Record<string, any> = {
		method: 'GET',
		headers: {},
	};

	// 构造函数
	constructor(url: string, opts: Record<string, any>) {
		this.eventSourceUrl = url;
		this.options = opts;

		if (this.options.method === 'POST') {
			this.initPostEventSource();
		} else {
			this.eventSource = null;
			this.initEventSource();
		}
	}

	//初始化eventSource
	initEventSource() {
		//兼容判断
		if ('EventSource' in window) {
			const that = this;

			//实例化EventSource
			this.eventSource = new EventSource(that.eventSourceUrl);

			//EventSource打开
			this.eventSource.onopen = function () {
				console.log('EventSource连接成功', that.eventSourceUrl);
			};

			//EventSource接收到新消息
			this.eventSource.onmessage = function (event: any) {
				try {
					if (event.data && typeof event.data === 'string') {
						// console.log(event.data);
						let data = JSON.parse(event.data);
						if (data.isOver) {
							that.close();
						}
						//业务逻辑回调
						if (typeof that.options.message === 'function') {
							that.options.message(data);
						}
					}
				} catch (error) {
					console.log('EventSource初始化异常', error);
				}
			};

			//EventSource关闭
			this.eventSource.onclose = function () {
				console.log('EventSource连接断开', that.eventSourceUrl);
			};

			//EventSource错误
			this.eventSource.onerror = function (error: any) {
				// 监听错误
				console.log('EventSource连接错误', error);
				this.close();
			};
		} else {
			throw new Error('浏览器不支持EventSource对象');
		}
	}

	initPostEventSource() {
		// 当前是否回答中
		// let showLoading = ref(false);
		// 结束流时使用
		let ctrl: AbortController;
		let that = this;
		// showLoading.value = true;
		ctrl = new AbortController();

		console.log(this.options.headers);

		fetchEventSource(that.eventSourceUrl, {
			method: 'POST',
			// 请求头参数
			headers: {
				'Content-Type': 'application/json',
				...this.options.headers,
			},
			// 具体传参
			body: JSON.stringify(this.options.data),
			// 在调用失败时禁止重复调用
			openWhenHidden: true,
			//
			signal: ctrl.signal,

			// 连接打开
			onopen: async function (e: any) {
				console.log('open');
			},

			onmessage(msg: any) {
				try {
					if (msg.data && typeof msg.data === 'string') {
						//业务逻辑回调
						if (typeof that.options.message === 'function') {
							that.options.message(msg);
						}
					}
					else if (msg.event) {
						// 通过event传出结束标识
						if ( msg.event == 'DONE' && ctrl) {
							ctrl.abort();
							// console.log('SSE closed');
							// 调用给定的结束回调方法
							if (isFunction(that.options.closed)) {
								that.options.closed();
							}
						}
					}
				} catch (error) {
					console.log('EventSource初始化异常', error);
				}
			},
			// onclose: async (e: any) =>{
			// 	console.log('close');
			// 	console.log(e);
			// 	ctrl.abort();
			// 	//   showLoading.value = false;
			// },
			onerror(err) {
				// ElMessage.error(err.msg || '询问人数过多请稍后在试！');
				console.log('error', err);
				// showLoading.value = false;
				// 此方法会报错，但可以解决ts语法打包报错问题
				// ctrl.signal[0].aborted = false;
				try {
					// onerror后关闭请求，但打包是ts语法报错
					// ctrl.signal.aborted = false;
					if (ctrl) {
						ctrl.abort();
					}
				} finally {
					console.log('finally', ctrl);
				}
			},
		});
	}

	//关闭eventSource
	close() {
		this.eventSource.close();
		this.eventSourceUrl = '';
		this.eventSource = null;
		this.onMessage = null;
	}
}

export default MyEventSource;
