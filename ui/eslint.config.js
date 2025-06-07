import antfu from '@antfu/eslint-config';

export default antfu(
    {
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },
        typescript: true,
        vue: true,
        ignores: ['/content/**/*.md', '**/node_modules/**'],
    },
    {
        rules: {
            'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
            'vue/block-order': [
                'error',
                {
                    order: ['template', 'script', 'style'],
                },
            ],
        },
    }
);
