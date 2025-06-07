export interface TabProps {
	title: string;
	name: string;
	fullPath: string;
	query?: any;
	ignoreCache?: boolean;
	index?: number;
	icon?: string;
}

export interface TabBarState {
	// 标签列表
	tabList: TabProps[];
	// 标题集
	titles: Record<string, string>;
	// 缓存标签列表
	cacheTabList: Set<string>;
	// 当前标签
	currTab?: TabProps;
}
