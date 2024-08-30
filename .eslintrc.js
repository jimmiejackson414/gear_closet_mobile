module.exports = {
  root: true,
  extends: ['expo'],
  plugins: ['@stylistic', 'react'],
  rules: {
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-max-props-per-line': [
      2,
      {
        maximum: 1,
        when: 'multiline',
      },
    ],
    'react/jsx-indent': [1, 2],
    'react/jsx-indent-props': [1, 2],
    'react/jsx-closing-bracket-location': [1, 'after-props'],
    'react/jsx-tag-spacing': [1, { beforeSelfClosing: 'always' }],
    'react/jsx-one-expression-per-line': [1, { allow: 'single-child' }],
    'react/jsx-props-no-multi-spaces': 2,
    'sort-imports': [1, { ignoreDeclarationSort: true }],
    'sort-keys': [1, 'asc', {
      caseSensitive: true, natural: true,
    }],
    '@stylistic/jsx-sort-props': [1, { ignoreCase: true }],
    '@stylistic/semi': [1, 'always'],
    '@stylistic/indent': [1, 2, { SwitchCase: 1 }],
    '@stylistic/quotes': [1, 'single'],
    '@stylistic/comma-dangle': [1, 'always-multiline'],
    '@stylistic/no-trailing-spaces': ['warn', { skipBlankLines: true }],
    '@stylistic/object-curly-spacing': [1, 'always'],
    '@stylistic/object-curly-newline': [
      1,
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 2,
        },
        ImportDeclaration: 'never', // Disable the rule for import statements
        ExportDeclaration: {
          multiline: true,
          minProperties: 2,
        },
      },
    ],
    'import/newline-after-import': [1, { count: 1 }],
    'import/order': [1, { 'newlines-between': 'never' }],
  },
};
