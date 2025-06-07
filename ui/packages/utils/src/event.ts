// 添加事件监听
export const addEventListen = (target: Window | HTMLElement, event: string, handler: EventListenerOrEventListenerObject, capture = false) => {
	if (target.addEventListener && typeof target.addEventListener === 'function') {
		target.addEventListener(event, handler, capture);
	}
};

// 删除事件监听
export const removeEventListen = (target: Window | HTMLElement, event: string, handler: EventListenerOrEventListenerObject, capture = false) => {
	if (target.removeEventListener && typeof target.removeEventListener === 'function') {
		target.removeEventListener(event, handler, capture);
	}
};

import { isClient } from '@vueuse/core';

const resizeHandler = (entries: ResizeObserverEntry[]) => {
	for (const entry of entries) {
		// @ts-ignore
		const listeners = entry.target.__resizeListeners__ || [];
		if (listeners.length) {
			listeners.forEach((fn: Function) => {
				fn();
			});
		}
	}
};

export const addResizeListener = (element: any, fn: (...args: unknown[]) => unknown) => {
	if (!isClient || !element) return;
	if (!element.__resizeListeners__) {
		element.__resizeListeners__ = [];
		element.__ro__ = new ResizeObserver(resizeHandler);
		element.__ro__.observe(element);
	}
	element.__resizeListeners__.push(fn);
};

export const removeResizeListener = (element: any, fn: (...args: unknown[]) => unknown) => {
	if (!element || !element.__resizeListeners__) return;
	element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
	if (!element.__resizeListeners__.length) {
		element.__ro__?.disconnect();
	}
};

export function triggerWindowResize() {
	const event = document.createEvent('HTMLEvents');
	event.initEvent('resize', true, true);
	(event as any).eventType = 'message';
	window.dispatchEvent(event);
}
