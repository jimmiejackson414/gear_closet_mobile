// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: 'expo',
  plugins: [
    '@stylistic',
  ],
  rules: {
    'react/jsx-max-props-per-line': [1, {
      maximum: 1,
      when: 'always',
    }],
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-indent': [1, 2],
    'react/jsx-indent-props': [1, 2],
    'react/jsx-closing-bracket-location': [1, 'after-props'],
    'react/jsx-tag-spacing': [1, { beforeSelfClosing: 'always' }],
    'react/jsx-one-expression-per-line': [1, { allow: 'single-child' }],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    '@stylistic/jsx-sort-props': [1, { ignoreCase: true }],
    '@stylistic/semi': [2, 'always'],
    '@stylistic/indent': [2, 2, { 'SwitchCase': 1 }],
    '@stylistic/quotes': [2, 'single'],
    '@stylistic/comma-dangle': [1, 'always-multiline'],
    '@stylistic/no-trailing-spaces': ['warn', { skipBlankLines: true }],
    '@stylistic/object-curly-spacing': [2, 'always'],
    '@stylistic/object-curly-newline': ['error', {
      ObjectExpression: {
        multiline: true, minProperties: 2,
      },
      ObjectPattern: {
        multiline: true, minProperties: 2,
      },
      ImportDeclaration: 'never',
      ExportDeclaration: {
        multiline: true, minProperties: 2,
      },
    }],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': ['error', {
      'newlines-between': 'never',
      groups: [['builtin', 'external', 'internal']],
    }],
  },
};
