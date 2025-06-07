import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { useGlobSetting } from '@htui/utils';
import tailwindcss from '@tailwindcss/vite';
import dayjs from 'dayjs';
import { loadEnv } from 'vite';
import pkg from './package.json';

const currentDir = dirname(fileURLToPath(import.meta.url));

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
    const script = process.env.npm_lifecycle_script as string;
    const reg = /--mode ([\d_a-z]+)/;
    const result = reg.exec(script);

    if (result) {
        const mode = result[1];
        if (mode && mode !== '') {
            return mode;
        }
        return 'prod';
    }
    return 'prod';
}

const env_mode = getConfFiles();
// 读取环境变量,有多个文件时，模式不生效
const envData = loadEnv(env_mode, process.cwd(), 'VITE_'); // 获取.env文件中的配置
Object.assign(process.env, envData); // 将环境配置信息，添加到process.env

// 获取package.json的定义信息
const { dependencies, devDependencies, name, version } = pkg;

// 导入APP信息
const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

// 从环境变量中导入配置信息
const globSetting = useGlobSetting();

export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        'shadcn-nuxt',
        '@vueuse/nuxt',
        '@ztl-uwu/nuxt-content',
        '@nuxt/image',
        '@nuxt/icon',
        '@nuxtjs/color-mode',
        'nuxt-og-image',
        '@nuxt/scripts',
        '@nuxtjs/i18n',
        // '@nuxt/fonts',
    ],
    shadcn: {
        prefix: 'Ui',
        componentDir: join(currentDir, './components/ui'),
    },
    components: {
        dirs: [
            {
                path: './components',
                ignore: ['**/*.ts'],
            },
        ],
    },
    i18n: {
        bundle: {
            optimizeTranslationDirective: false,
        },
        strategy: 'prefix_except_default',
    },
    colorMode: {
        classSuffix: '',
        disableTransition: true,
    },
    css: [join(currentDir, './assets/css/themes.css'), '~/assets/css/tailwind.css'],
    content: {
        documentDriven: true,
        highlight: {
            theme: {
                default: 'github-light',
                dark: 'github-dark',
            },
            preload: [
                'json',
                'js',
                'ts',
                'html',
                'css',
                'vue',
                'diff',
                'shell',
                'markdown',
                'mdc',
                'yaml',
                'bash',
                'ini',
                'dotenv',
            ],
        },
        navigation: {
            fields: [
                'icon',
                'navBadges',
                'navTruncate',
                'badges',
                'toc',
                'sidebar',
                'collapse',
                'editLink',
                'prevNext',
                'breadcrumb',
                'fullpage',
            ],
        },
        experimental: {
            search: {
                indexed: true,
            },
        },
    },
    icon: {
        clientBundle: {
            scan: true,
            sizeLimitKb: 512,
        },
    },
    fonts: {
        defaults: {
            weights: ['300 800'],
        },
    },
    typescript: {
        tsConfig: {
            compilerOptions: {
                baseUrl: '.',
            },
        },
    },
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: ['debug'],
        },
        server: {
            proxy: {
                '/api': {
                    target: globSetting.apiUrl,
                    changeOrigin: true,
                    prependPath: true,
                    rewrite: (path: any) => path.replace(new RegExp(`^/api`), ''),
                },
                '/upload': {
                    target: globSetting.uploadUrl,
                    changeOrigin: true,
                    prependPath: true,
                    rewrite: (path: any) => path.replace(new RegExp(`^/upload`), ''),
                },
            },
        },
    },
    compatibilityDate: '2025-05-13',
});
