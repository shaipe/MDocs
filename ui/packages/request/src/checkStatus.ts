import type { ErrorMessageMode } from '@htui/types';
// import { useI18n } from '@htui/locale';
import { context } from '../bridge';

export function checkStatus(status: number, msg: string, errorMessageMode: ErrorMessageMode = 'message'): void {
    // const { t } = useI18n();
    let errMessage = '';

    switch (status) {
        case 400:
            errMessage = `${msg}`;
            break;
        // 401: Not logged in
        // Jump to the login page if not logged in, and carry the path of the current page
        // Return to the current page after successful login. This step needs to be operated on the login page.
        case 401:
            context.unauthorizedFunction?.(msg);
            break;
        case 403:
            errMessage = '无权限'; // t('sys.api.errMsg403');
            break;
        // 404请求不存在
        case 404:
            errMessage = '请求不存在'; // t('sys.api.errMsg404');
            break;
        case 405:
            errMessage = '请求方法不支持'; // t('sys.api.errMsg405');
            break;
        case 408:
            errMessage = '请求超时'; // t('sys.api.errMsg408');
            break;
        case 500:
            errMessage = '服务器错误'; // t('sys.api.errMsg500');
            break;
        case 501:
            errMessage = '未实现'; // t('sys.api.errMsg501');
            break;
        case 502:
            errMessage = '网关错误'; // t('sys.api.errMsg502');
            break;
        case 503:
            errMessage = '服务不可用'; // t('sys.api.errMsg503');
            break;
        case 504:
            errMessage = '网关超时'; // t('sys.api.errMsg504');
            break;
        case 505:
            errMessage = 'HTTP版本不支持'; // t('sys.api.errMsg505');
            break;
        default:
    }

    if (errMessage) {
        context.handleErrorFunction?.(errMessage, errorMessageMode);
    }
}
