import { openWindow } from './utils';
import dayjs from 'dayjs';

/**
 * @description: base64 to blob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
	const arr = base64Buf.split(',');
	const typeItem = arr[0];
	const mime = typeItem.match(/:(.*?);/)![1];
	const bstr = window.atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

/**
 * img url to base64
 * @param url
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
	return new Promise((resolve, reject) => {
		let canvas = document.createElement('CANVAS') as HTMLCanvasElement | null;
		const ctx = canvas!.getContext('2d');

		const img = new Image();
		img.crossOrigin = '';
		img.onload = function () {
			if (!canvas || !ctx) {
				return reject();
			}
			canvas.height = img.height;
			canvas.width = img.width;
			ctx.drawImage(img, 0, 0);
			const dataURL = canvas.toDataURL(mineType || 'image/png');
			canvas = null;
			resolve(dataURL);
		};
		img.src = url;
	});
}

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
	urlToBase64(url).then(base64 => {
		downloadByBase64(base64, filename, mime, bom);
	});
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
	const base64Buf = dataURLtoBlob(buf);
	downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
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

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({ url, target = '_blank', fileName }: { url: string; target?: '_self' | '_blank'; fileName?: string }): boolean {
	if (!url) {
		console.error('下载地址不能为空');
		return false;
	}

	const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;

	if (/(iP)/g.test(window.navigator.userAgent)) {
		console.error('Your browser does not support download!');
		return false;
	}
	if (isChrome || isSafari) {
		const link = document.createElement('a');
		link.href = url;
		link.target = target;

		if (link.download !== undefined) {
			link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length);
		}

		if (document.createEvent) {
			const e = document.createEvent('MouseEvents');
			e.initEvent('click', true, true);
			link.dispatchEvent(e);
			return true;
		}
	}
	if (url.indexOf('?') === -1) {
		url += '?download';
	}

	openWindow(url, { target });
	return true;
}

// 下载图片
export const downloadImage = (imageSrc: string, name?: string): Promise<void> => {
	console.log('downloadImage', imageSrc);
	return new Promise((resolve, reject) => {
		const image = new Image();

		// 解决跨域 Canvas 污染问题
		image.setAttribute('crossOrigin', 'anonymous');

		image.src = imageSrc;

		image.onload = function () {
			const canvas = document.createElement('canvas');

			canvas.width = image.width;

			canvas.height = image.height;

			const context = canvas.getContext('2d');

			if (context) {
				context.drawImage(image, 0, 0, image.width, image.height);

				const url = canvas.toDataURL('image/png'); //得到图片的base64编码数据

				const a: HTMLAnchorElement = document.createElement('a'); // 生成一个a元素

				const event: MouseEvent = new MouseEvent('click'); // 创建一个单击事件

				a.download = name || `pic_${dayjs().valueOf()}`; // 设置图片名称

				a.href = url; // 将生成的URL设置为a.href属性

				a.dispatchEvent(event); // 触发a的单击事件

				resolve();
			}
		};

		image.onerror = function () {
			reject();
		};
	});
};
