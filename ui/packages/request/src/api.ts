import { isFunction, isObject } from '@htui/utils';
import { createAxios } from '.';
import { context } from '../bridge';

// 自定义消息处理
const getMsg = () => {
	if (isFunction(context.msgFunction)) {
		return context.msgFunction();
	} else {
		return console.log;
	}
};

// 消息盒子
const getMsgBox = () => {
	if (isFunction(context.msgBoxFunction)) {
		return context.msgBoxFunction();
	} else {
		return {
			confirm: new Promise((resolve, reject) => {
				resolve({});
			}),
		};
	}
};

// Api请求对象
export class Api {
	request;
	namespace = '';
	// 构造方法
	constructor(ns: string, opt?: object) {
		this.namespace = ns;
		this.request = createAxios(opt);
	}

	/**
	 * 添加数据
	 * POST /mbr/member
	 * @param params 需要添加的数据
	 */
	add<T = any>(params?: any) {
		return this.request.post<T>({
			url: this.namespace,
			params,
		});
	}

	/**
	 * 删除数据
	 * DELETE /mbr/member/{id}
	 * @param id 需要删除数据的唯一标识
	 */
	del<T = any>(id: string | number | object | Array<string | number>) {
		let param: any = {
			id: id,
		};
		// 如果为object时直接使用，其他类型需要赋值给id
		if (isObject(id)) {
			param = id;
		}

		return this.request.delete<T>({
			url: `${this.namespace}`,
			params: param,
		});
	}

	/**
	 * 单条数据更新
	 * PUT /mbr/member
	 * 传入的数据对象中要包含主键：id
	 * @param params 更新需要推送的数据，{id:"",name:""}
	 */
	update<T = any>(params?: any) {
		return this.request.put<T>({
			url: this.namespace,
			params,
		});
	}

	/**
	 * 获取单数据的详情
	 * GET /mbr/member/{id}
	 * @param id 获取数据的唯一标识
	 */
	get<T = any>(id: string | number) {
		return this.request.get<T>({
			url: `${this.namespace}/${id}`,
		});
	}

	/**
	 * 获取列表数据,不分页，后台限制最大输出为1000行
	 * POST /mbr/member/list
	 * @param params 查询或分页等信息的参数对象
	 */
	getList<T = any>(params?: any) {
		return this.request.post<T>({
			url: `${this.namespace}/list`,
			method: 'POST',
			params,
		});
	}

	/**
	 * 获取分页列表数据
	 * POST /mbr/member/page
	 * @param params
	 */
	getPage<T = any>(params?: any) {
		return this.request.post<T>({
			url: `${this.namespace}/page`,
			params,
		});
	}

	/**
	 * 管理员获取分页列表数据
	 * POST /mbr/member/page
	 * @param params
	 */
	getProviderPage<T = any>(params?: any) {
		return this.request.post<T>({
			url: `${this.namespace}/provider/page`,
			params,
		});
	}

	/**
	 * 管理员获取分页列表数据
	 * POST /mbr/member/page
	 * @param params
	 */
	getProviderDetail<T = any>(id: string | number) {
		return this.request.post<T>({
			url: `${this.namespace}/provider/detail`,
			params: { id: id },
		});
	}

	/**
	 * 获取树型列表数据
	 * POST /dre/menu/tree
	 * @param params
	 */
	getTree<T = any>(params?: any) {
		return this.request.post<T>({
			url: `${this.namespace}/tree`,
			params,
		});
	}

	/**
	 * 获取字典列表表数据
	 * POST /cms/category/dict
	 * @param params
	 */
	getDict<T = any>(params?: any) {
		return this.request.post<T>({
			url: `${this.namespace}/dict`,
			params,
		});
	}

	// 获取模板列表
	getDetail<T = any>(params: any): ApiPromise<any> {
		return this.request.post<T>({
			url: `${this.namespace}/detail`,
			params,
		});
	}

	status(record: any) {
		// console.log(context);
		// 修改数据状态
		let status = record?.status == 1 ? 0 : 1;
		this.post('status/update', { status, id: record?.id })
			.then(() => {
				getMsg()({
					type: 'success',
					message: '更新数据成功', // t('sys.updateSuccess'),
				});

				record.status = status;
			})
			.catch(err => {
				getMsg()({
					type: 'error',
					message: '更新数据失败' + err, // t('sys.updateFailed') + err,
				});
			});
	}

	// 删除数据，删除数据成功后回调
	confirmDelete(params: any, callback?: Function) {
		// 删除菜单
		getMsgBox()
			.confirm('您确认要删除数据吗?', '警告', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
			.then(() => {
				this.del(params)
					.then(() => {
						if (isFunction(context.msgFunction)) {
							context.msgFunction()({
								type: 'success',
								message: '删除数据成功',
							});
						}

						if (isFunction(callback)) {
							callback();
						}
					})
					.catch(err => {
						if (isFunction(context.msgFunction)) {
							context.msgFunction()({
								type: 'error',
								message: '删除数据失败' + err,
							});
						}
					});
			});
	}

	/**
	 * 通用的请求方法
	 * @param path 请求的路径
	 * @param method 请求方法
	 * @param params 请求的参数
	 */
	post<T = any>(path?: string, params?: any) {
		// 对url进行处理
		let url = this.namespace;
		if (path && path.length > 0) {
			url = `${this.namespace}/${path}`;
		}

		return this.request.post<T>({
			url: url,
			params,
		});
	}

	/**
	 * 通用的请求方法
	 * @param path 请求的路径
	 * @param method 请求方法
	 * @param params 请求的参数
	 */
	put<T = any>(path?: string, params?: any) {
		// 对url进行处理
		let url = this.namespace;
		if (path && path.length > 0) {
			url = `${this.namespace}/${path}`;
		}

		return this.request.put<T>({
			url: url,
			params,
		});
	}

	/**
	 * 通用删除方法
	 * @param path 请求的路径
	 * @param method 请求方法
	 * @param params 请求的参数
	 */
	delete<T = any>(path?: string | number[] | any[], params?: any) {
		// 对url进行处理
		let url = this.namespace;
		if (path && path.length > 0) {
			url = `${this.namespace}/${path}`;
		}

		return this.request.delete<T>({
			url: url,
			params,
		});
	}

	// 统计用户增长
	statistics(params: object = {}): ApiPromise {
		return this.post('statistics', params);
	}
}
