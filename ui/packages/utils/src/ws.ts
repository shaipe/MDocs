// import { useGlobSetting } from "../hooks/setting";
// import { formatToDateTime } from "./dateUtil";

export interface IWSSetting {
	url?: string;
	params?: string;
	opened?: Function;
	received?: Function;
	closed?: Function;
	error?: Function;
	debug?: boolean;
}

export class WSocket {
	ws: any;

	settings: IWSSetting;

	sessionId: String;

	// 初始化对象
	constructor(props: IWSSetting) {
		const support = 'MozWebSocket' in window ? 'MozWebSocket' : 'WebSocket' in window ? 'WebSocket' : null;
		if (support == null) {
			alert('您的浏览器不支持,建议使用Chrome浏览器!');
		}
		this.settings = props;
		this.sessionId = '';
		// 如果没有给定url直接获取配置
		if (!this.settings.url) {
			const local = window.location;
			this.settings.url = (local.protocol.startsWith('https') ? 'wss://' : 'ws://') + local.host + 'ws';
		}
		this.connect();
		return this;
	}

	send(data: any) {
		if (this.ws.readyState == 1) {
			this.ws.send(JSON.stringify(data));
		}
	}

	close() {
		this.ws.close();
	}

	// 连接成功
	connect() {
		try {
			const wsImpl = window.WebSocket;
			const url = `${this.settings.url}` + (this.settings.params === '' ? '' : `?${this.settings.params}`);
			// console.log(url);
			this.ws = new wsImpl(url) as any;
			const ws = this.ws;
			// socket.binaryType = 'arraybuffer';
			// if (ws.readyState === WebSocket.CONNECTING) {
			//     console.log(`[${formatToDateTime(new Date())}] connect ...`)
			// }
			// 绑定webSocket的处理事件
			ws.onopen = this.onOpen.bind(this);
			ws.onmessage = this.onMessage.bind(this);
			ws.onclose = this.onClose.bind(this);
			ws.onerror = this.onError.bind(this);
		} catch (e) {}
	}

	// 打开连接
	onOpen(evt: any) {
		const ws = this.ws;
		const opts = this.settings;
		if (ws.readyState === WebSocket.OPEN) {
			// 回调打开方法
			if (typeof opts.opened == 'function') {
				opts.opened.apply(this, [evt]);
			}

			// // 每5秒进行一次心跳检测
			// setInterval(function () {
			// 	console.log('----心跳检测----');
			// 	ws.send('ping');
			// }, 5000);
		}
	}

	// 接收到消息
	onMessage(evt: any) {
		const opts = this.settings;
		if (typeof opts.received == 'function') {
			opts.received.apply(this, [evt]);
		}
	}

	// 连接关闭
	onClose(evt: any) {
		const opts = this.settings;
		if (typeof opts.closed == 'function') {
			opts.closed.apply(this, [evt]);
		}
	}

	// 发生错误时处理
	onError(evt: any) {
		const opts = this.settings;
		if (typeof opts.error == 'function') {
			opts.error.apply(this, [evt]);
		}
	}

	// private getWebSocketState(ws: WebSocket) {
	//     var result = "";
	//     switch (ws.readyState) {
	//         case 0:
	//             result = "连接正在进行中，但还未建立";
	//             break;
	//         case 1:
	//             result = "连接已经建立。消息可以在客户端和服务器之间传递";
	//             break;
	//         case 2:
	//             result = "连接正在进行关闭握手";
	//             break;
	//         case 3:
	//             result = "连接已经关闭，不能打开";
	//             break;
	//     }

	//     return result;
	// }
}
