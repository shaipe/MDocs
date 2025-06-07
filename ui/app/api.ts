import { Api } from '@htui/request';

// 模块名定义
const moduleName: string = '';

// 区域信息
class DocumentClass extends Api {
    constructor() {
        super(moduleName);
    }

    getContent(path: string) {
        return this.get(path);
    }
}

// 区域信息加载接口
export const documentApi = new DocumentClass();
