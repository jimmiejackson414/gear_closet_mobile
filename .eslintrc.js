module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['expo', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  plugins: ['@stylistic', 'react', 'import', '@typescript-eslint', 'no-relative-import-paths'],
  root: true,
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.js', 'babel.config.js'],
  rules: {
    '@stylistic/comma-dangle': [1, 'always-multiline'],
    '@stylistic/indent': [1, 2, { SwitchCase: 1 }],
    '@stylistic/jsx-sort-props': [1, { ignoreCase: true }],
    '@stylistic/no-trailing-spaces': ['warn', { skipBlankLines: true }],
    '@stylistic/object-curly-newline': [
      1,
      {
        ImportDeclaration: { multiline: false },
        ExportDeclaration: { multiline: true, minProperties: 3 },
        ObjectExpression: { multiline: true, minProperties: 3 },
        ObjectPattern: { multiline: true, minProperties: 3 },
      },
    ],
    '@stylistic/object-curly-spacing': [1, 'always'],
    '@stylistic/quotes': [1, 'single'],
    '@stylistic/semi': [1, 'always'],
    '@stylistic/newline-per-chained-call': [1, { ignoreChainWithDepth: 1 }],
    '@stylistic/space-infix-ops': [1, { int32Hint: false }],
    '@stylistic/arrow-parens': ['warn', 'as-needed'],
    '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
    'import/newline-after-import': [1, { count: 1 }],
    'import/no-duplicates': 'warn',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin', // Built-in modules like 'fs' or 'path'
          'external', // External modules like 'react' or 'lodash'
          'internal', // Internal modules like 'src/utils'
          'parent', // Parent imports like '../utils'
          'sibling', // Sibling imports like './Button'
          'index', // Index imports like './'
          'type', // Type imports
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-native',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'expo-router',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['type'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
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
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { 'allowSameFolder': true, 'prefix': '@' },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['default'],
            message: 'React import is not necessary with the new JSX transform.',
          },
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none'
      }
    ],
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
  },
  settings: {
    react: {
      version: 'detect'
    },
  },
};