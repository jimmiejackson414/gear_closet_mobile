module.exports = {
  extends: ['expo'],
  plugins: ['@stylistic', 'react'],
  root: true,
  rules: {
    '@stylistic/comma-dangle': [1, 'always-multiline'],
    '@stylistic/indent': [1, 2, { SwitchCase: 1 }],
    '@stylistic/jsx-sort-props': [1, { ignoreCase: true }],
    '@stylistic/no-trailing-spaces': ['warn', { skipBlankLines: true }],
    '@stylistic/object-curly-newline': [
      1,
      {
        ExportDeclaration: {
          minProperties: 2,
          multiline: true,
        },
        ImportDeclaration: 'never', // Disable the rule for import statements
        ObjectExpression: {
          minProperties: 3,
          multiline: true,
        },
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
        },
      },
    ],
    '@stylistic/object-curly-spacing': [1, 'always'],
    '@stylistic/quotes': [1, 'single'],
    '@stylistic/semi': [1, 'always'],
    '@stylistic/newline-per-chained-call': [1, { ignoreChainWithDepth: 1 }],
    'import/newline-after-import': [1, { count: 1 }],
    'import/order': [1, { 'newlines-between': 'never' }],
    'react/jsx-closing-bracket-location': [1, 'after-props'],
    'react/jsx-indent': [1, 2],
    'react/jsx-indent-props': [1, 2],
    '@stylistic/jsx-first-prop-new-line': [2, 'multiprop'],
    'react/jsx-max-props-per-line': [
      2,
      {
        maximum: 1,
        when: 'always',
      },
    ],
    'react/jsx-one-expression-per-line': [2, { allow: 'literal' }],
    'react/jsx-props-no-multi-spaces': 2,
    'react/jsx-tag-spacing': [1, { beforeSelfClosing: 'always' }],
    'sort-imports': [1, { ignoreDeclarationSort: true }],
    '@typescript-eslint/no-unused-vars': ['error', { 'caughtErrors': 'none' }],
  },
};
