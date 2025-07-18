/**
 * Listening to routes alone would waste rendering performance. Use the publish-subscribe model for distribution management
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import mitt from 'mitt';
import type { Handler } from 'mitt';
import type { RouteLocationNormalized } from 'vue-router';

const emitter = mitt();

const key = Symbol('ROUTE_CHANGE');

let latestRoute: RouteLocationNormalized;

// 设置路由监听
export function setRouteEmitter(to: RouteLocationNormalized) {
    emitter.emit(key, to);
    latestRoute = to;
}

// 监控路由改变
export function listenerRouteChange(handler: (route: RouteLocationNormalized) => void, immediate = true) {
    emitter.on(key, handler as Handler);
    if (immediate && latestRoute) {
        handler(latestRoute);
    }
}

// 删除路由监听
export function removeRouteListener() {
    emitter.off(key);
}
