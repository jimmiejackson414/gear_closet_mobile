// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: 'expo',
  plugins: [
    '@stylistic'
  ],
  rules: {
    'react/jsx-max-props-per-line': [1, { maximum: 1, when: 'always' }],
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-indent': [1, 2],
    'react/jsx-indent-props': [1, 2],
    'react/jsx-closing-bracket-location': [1, 'after-props'],
    'react/jsx-tag-spacing': [1, { beforeSelfClosing: 'always' }],
    'react/jsx-one-expression-per-line': [1, { allow: 'single-child' }],
    '@stylistic/semi': [2, 'always'],
    '@stylistic/indent': [2, 2, { 'SwitchCase': 1 }],
    '@stylistic/quotes': [2, 'single'],
  },
};
