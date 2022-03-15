module.exports = {
    extends: ['@nighttrax/eslint-config-tsx', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 2,
        'no-restricted-syntax': [2, 'ForStatement'],
        'import/no-extraneous-dependencies': 0,
        'no-param-reassign': 0,
        'no-underscore-dangle': 0,
        'no-empty-function': 0,
        'no-case-declarations': 0,
        'default-case': 0,
        'class-methods-use-this': 0,
        'no-await-in-loop': 0,
        'no-unneeded-ternary': 0,
        'comma-dangle': 0,
        'no-constant-condition': 0,
    },
};
