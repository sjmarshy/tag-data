module.exports = {
    extends: ['last', 'prettier/react', 'plugin:react/recommended'], // extending recommended config and config derived from eslint-config-prettier
    plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
    rules: {
        'prettier/prettier': [
            // customizing prettier rules (unfortunately not many of them are customizable)
            'error',
            {
                singleQuote: true,
                trailingComma: 'es5',
                tabWidth: 4,
            },
        ],
        eqeqeq: ['error', 'always'], // adding some custom ESLint rules
    },
};
