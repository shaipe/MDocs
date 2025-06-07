export type LocaleType = 'zh-cn' | 'en';

export interface LocaleConfig {
	// Current language
	locale: LocaleType;
	// default language
	fallback: LocaleType;
	// available Locales
	availableLocales: LocaleType[];
}

export interface StaticConfig {
	/**
	 * Permission Type:
	 * frontend: indicates that permissions are controlled by the front end
	 * backend: indicates that the permissions are controlled by the backend
	 */
	authType: 'frontend' | 'backend';

	// Display a progress bar at the top when switching pages
	enableProgress: boolean;
}

export interface DynamicConfig {
	__: string;
}

// 全局配置
export interface GlobConfig {
	// Site title
	title: string;
	// 系统全局平台
	platform: number;
	// Project abbreviation
	shortName: string;
	// Service interface url
	apiUrl: string;
	// wss interface url
	wssUrl: string;
	// Upload url
	uploadUrl?: string;
	// 站点域名
	siteDomain?: string;
	// 图片域名
	imageDomain?: string;
	// Vite 本地运行端口
	port: number;
	// 项目代码
	projectCode: string;
    // 账户名
    passportName?: string
}

// 全局环境变量配置
export interface GlobEnvConfig {
	// 运行端口
	VITE_PORT: number;
	// Site title
	VITE_GLOB_APP_TITLE: string;
	// 系统全局平台
	VITE_GLOB_PLATFORM: number;
	// Service interface url
	VITE_GLOB_API_URL: string;
	// Project abbreviation
	VITE_GLOB_APP_SHORT_NAME: string;
	// wss interface url
	VITE_GLOB_WSS_URL: string;
	// Service interface url prefix
	VITE_GLOB_API_URL_PREFIX?: string;
	// Upload url
	VITE_GLOB_UPLOAD_URL?: string;
	// 站点域名
	VITE_GLOB_SITE_DOMAIN?: string;
	// image domain
	VITE_GLOB_IMAGE_DOMAIN?: string;
	// 项目代码
	VITE_PROJECT_CODE?: string;
    // 账户名
    VITE_GLOB_PASSPORT_NAME?: string
}

export interface DefineAppConfigOptions {
	// Navigation bar mode
	// navBarMode: NavBarModeEnum;
	// Theme
	// theme: ThemeEnum;
	// Theme color
	themeColor: string;
	// Whether to show the theme switch button
	showThemeModeToggle: boolean;
	// pageLayout whether to enable keep-alive
	openKeepAlive: boolean;
	// Whether to open back to top
	useOpenBackTop: boolean;
	// Is it possible to embed iframe pages
	canEmbedIFramePage: boolean;
	// Whether to delete unclosed messages and notify when switching the interface
	closeMessageOnSwitch: boolean;
	closeMixSidebarOnChange: boolean;
	// Whether to cancel the http request that has been sent but not responded when switching the interface.
	removeAllHttpPending: boolean;
	// Storage location of permission related information
	// permissionCacheType: CacheTypeEnum;
	// Configure where the button is displayed
	// settingButtonPosition: SettingButtonPositionEnum;
	// Configuration setting drawer open
	openSettingDrawer: boolean;
	// Permission mode
	// permissionMode: PermissionModeEnum;
	// Session timeout processing
	// sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
	// Website gray mode, open for possible mourning dates
	grayMode: boolean;
	// Whether to turn on the color weak mode
	colorWeak: boolean;
	// Lock screen time
	lockTime: number;
	// Whether to show the lock screen
	useLockPage: boolean;
	sidebar: SidebarConfigOptions;
	menu: MenuConfigOptions;
	header: HeaderConfigOptions;
	logo: LogoConfigOptions;
	tabTar: TabTbrConfigOptions;
	content: ContentConfigOptions;
	footer: FooterConfigOptions;
	transition: TransitionConfigOptions;
}

export interface SidebarConfigOptions {
	// theme: ThemeEnum;
	show: boolean;
	visible: boolean;
	fixed: boolean;
	bgColor: string;
	collapsed: boolean;
	width: number;
	// trigger: TriggerEnum;
	readonly mixSidebarWidth: number;
	readonly collapsedWidth: number;
}
export interface MenuConfigOptions {
	canDrag: boolean;
	split: boolean;
	// mode: MenuModeEnum;
	accordion: boolean;
	collapsedShowTitle: boolean;
	// mixSideTrigger: MixSidebarTriggerEnum;
	mixSideFixed: boolean;
	topMenuAlign: 'start' | 'center' | 'end';

	subMenuWidth: number;
	dropdownPlacement:
		| 'top-start'
		| 'top'
		| 'top-end'
		| 'right-start'
		| 'right'
		| 'right-end'
		| 'bottom-start'
		| 'bottom'
		| 'bottom-end'
		| 'left-start'
		| 'left'
		| 'left-end';
}

export interface HeaderConfigOptions {
	// theme: ThemeEnum;
	show: boolean;
	visible: boolean;
	bgColor: string;
	fixed: boolean;
	showFullScreen: boolean;
	showDoc: boolean;
	showNotice: boolean;
	showSearch: boolean;
	showLocalePicker: boolean;
	showSetting: boolean;
	readonly height: number;
	// Show breadcrumbs
	showBreadCrumb: boolean;
	// Show breadcrumb icon
	showBreadCrumbIcon: boolean;
}

export interface LogoConfigOptions {
	show: boolean;
	visible: boolean;
	showTitle: boolean;
}

export interface TabTbrConfigOptions {
	show: boolean;
	visible: boolean;
	cache: boolean;
	canDrag: boolean;
	showQuick: boolean;
	showRedo: boolean;
	showFold: boolean;
	readonly height: number;
}

export interface ContentConfigOptions {
	fullScreen: boolean;
	// mode: ContentLayoutEnum;
}

export interface FooterConfigOptions {
	show: boolean;
	visible: boolean;
	readonly height: number;
}

export interface TransitionConfigOptions {
	//  Whether to open the page switching animation
	enable: boolean;
	// Route basic switching animation
	// basicTransition: RouterTransitionEnum;
	// Whether to open page switching loading
	openPageLoading: boolean;
	// Whether to open the top progress bar
	openNProgress: boolean;
}

export interface FooterLinkOptions {
	label?: string;
	icon?: string;
	target?: '_self' | '_blank';
	url: string;
}


export interface DefineSiteGeneralOptions {
	// Logo url
	logo: string;
	// Site title
	title: string;
	// Copyright Information
	copyright: string;
	// Footer link
	links: FooterLinkOptions[];
	// Avatar url
	avatar: string;
	// username
	username: string;
}
