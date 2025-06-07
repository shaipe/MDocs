export interface Layout {
	// 是否显示抽屉
	showDrawer: boolean; // 控制抽屉的显示状态
	// 侧边栏收缩状态
	shrink: boolean; // 控制侧边栏是否收缩
	layoutMode: string; // 布局模式
	mainAnimation: string; // 主动画效果
	isDark: boolean; // 是否为暗黑模式
	menuWidth: number; // 菜单宽度
	menuDefaultIcon: string; // 默认菜单图标
	menuCollapse: boolean; // 菜单是否收起
	menuUniqueOpened: boolean; // 是否只允许一个菜单项展开
	menuShowTopBar: boolean; // 是否显示顶部菜单栏
	menuBackground: string[]; // 菜单背景颜色
	menuColor: string[]; // 菜单文字颜色
	menuActiveBackground: string[]; // 活动菜单背景颜色
	menuActiveColor: string[]; // 活动菜单文字颜色
	menuTopBarBackground: string[]; // 顶部菜单背景颜色
	headerBarTabColor: string[]; // 头部标签颜色
	headerBarBackground: string[]; // 头部背景颜色
	headerBarHoverBackground: string[]; // 头部悬停背景颜色
	headerBarTabActiveBackground: string[]; // 活动头部标签背景颜色
	headerBarTabActiveColor: string[]; // 活动头部标签文字颜色
	qrLogin: boolean; // 是否启用二维码登录
	showProvider: boolean;
	showFooter: boolean;
	sideShowHeadTitle: boolean;
	showChatIcon: boolean;
	loginMode: 'account' | 'qr' | 'all' | string;
    // 默认主题颜色
	themeColor: string;
	// 背景图
	backgroundImage?: string;
}

export interface Menus {
	id: number; // 菜单项的唯一标识符
	name: string; // 菜单项名称
	type: string; // 菜单项类型
	path: string; // 菜单项路径
	title: string; // 菜单项标题
	url: string; // 菜单项的URL
	meta: {
		type: 'tab' | 'link' | 'iframe'; // 菜单项的元数据类型
	};
	children: Menus[]; // 子菜单项
}

export interface NavTabs {
	activeIndex: number; // 当前活动的标签索引
	activeRoute: any; // 当前活动的路由
	tabsView: any[]; // 标签视图数组
	tabFullScreen: boolean; // 是否全屏显示标签
	authNode: Map<string, string[]>; // 授权节点
}

export interface MemberCenter {
	open: boolean; // 会员中心是否打开
	layoutMode: string; // 布局模式
	activeRoute: any; // 当前活动的路由
	viewRoutes: any; // 视图路由数组
	showHeadline: boolean; // 是否显示标题
	authNode: Map<string, string[]>; // 授权节点
	shrink: boolean; // 是否收缩
	menuExpand: boolean; // 菜单是否展开
	navUserMenus: Menus[]; // 用户菜单项
}

export interface Copyright {
	author: string;
	website: string;
}

export interface AppState {
	siteName: string; // 网站名称
	imageDomain: string; // 图片域名
	failedImage: string; // 失败图片的URL
	copyright: Copyright;
}
