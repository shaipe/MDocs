// 用户信息
export interface UserState {
	// 信息过期时间戳
	expire: number;
	// 登录ip
	ip?: string;
	// 数据提供者
	provider?: IProvider;
	// 租户平台
	rent: number;
	// 租户id
	rentId: number;
	// token应用终端
	terminal?: string;
	// 访问者信息
	visitor?: IVisitor;
	// token信息
	token: string;
	// 刷新token
	refreshToken?: string;
}

// 数据提供者
export interface IProvider {
	// id
	id: number;
	// 代码
	code: string;
	// 名称
	name: string;
	// 平台标识
	platform: number;
	// 标志
	logo: string;
	// 父级id
	parentId?: number;
	// 是否为连锁总店
	chainOverall: boolean;
}

// 角色
export interface IRole {
	// 编号
	code: string;
	// 名称
	name: string;
	// 值
	value: number;
}

// 访问者
export interface IVisitor {
	// 用户id
	id: number;
	// 用户代码
	code: string;
	// 所属平台
	platform: number;
	// 平台用户表id
	platformUserId?: number;
	// 真实姓名
	name: string;
	// 昵称
	nickName?: string;
	// 用户名
	username?: string;
	// 手机号
	mobile: string;
	// 角色集
	roles: Array<IRole>;
	// 等级id
	levelId?: number;
	// 头象
	avatar?: string;
	// 第三方平台
	openPlat?: string;
	// 第三方平台的openid
	openId?: string;
	// 是否管理员
	isMaster: boolean;
	// 有权限的平台集
	platforms?: Array<any>;
	// 登录后首页地址
	homePath?: string;
	// 职位
	positionArray?: Array<any>;
	// 职位
	position?: any;
}
