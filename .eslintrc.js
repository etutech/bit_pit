const base = {
  'max-len': [1, 120],
  'semi': [1, 'never'],
  'prefer-template': 1, // 自动转化字符串拼接为 template string
  'class-methods-use-this': 0,
  'generator-star-spacing': 0,
  'function-paren-newline': 0,
  'no-confusing-arrow': 0,
  'linebreak-style': 0,
  'no-prototype-builtins': 'off',
  'arrow-body-style': 0,
  'arrow-parens': 0,
  'object-curly-newline': 0,
  'implicit-arrow-linebreak': 0,
  'operator-linebreak': 0,
  'no-param-reassign': 2,
  'space-before-function-paren': 0,
  'space-infix-ops': 'error', // 要求操作符周围有空格
  'spaced-comment': ['error', 'always'],
  'arrow-spacing': 'error',
  'consistent-return': 0,
  'no-console': 0,
  'comma-dangle': [2, 'only-multiline'],
  'no-unused-vars': 'off',
  'no-underscore-dangle': 0,
  'no-alert': 0,
  indent: [2, 2, { SwitchCase: 1 }],
  'object-curly-spacing': [2, 'always'],
  // 'key-spacing': 2,
  'sort-imports': [
    1,
    {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['single', 'none', 'all', 'multiple']
    }
  ]
}

const react = {
  'jsx-quotes': [2, 'prefer-double'],
  // 'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
  // 'react-hooks/exhaustive-deps': 'off', // Checks deps of Hooks
  'react/jsx-props-no-spreading': 0,
  'react/state-in-constructor': 0,
  'react/static-property-placement': 0,
  'react/destructuring-assignment': 'off',
  'react/jsx-filename-extension': 'off',
  'react/no-array-index-key': 'off',
  'react/require-default-props': 0,
  'react/jsx-fragments': 0,
  'react/jsx-wrap-multilines': 0,
  'react/prop-types': 0,
  'react/forbid-prop-types': 0,
  'react/sort-comp': 0,
  'react/react-in-jsx-scope': 0,
  'react/jsx-one-expression-per-line': 0,
  'react/jsx-indent': [0, 2],
  'react/jsx-no-bind': [0]
}

const typescript = {
  '@typescript-eslint/no-unused-vars': [
    1,
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: "^_", 
      ignoreRestSiblings: true
    }
  ],
  '@typescript-eslint/no-use-before-define': [1], // 使用时还未定义
  '@typescript-eslint/no-explicit-any': [0], // 允许 any
  '@typescript-eslint/camelcase': [0], // 允许非驼峰 后端字段独有
  '@typescript-eslint/array-type': [1] // 允许 Array<T> 此类写法
}
const importConfig = {
  'import/no-unresolved': 0,
  'import/order': 0,
  'import/no-named-as-default': 0,
  'import/no-cycle': 0,
  'import/no-default-export': 0,
  'import/no-extraneous-dependencies': 0,
  'import/named': 0,
  'import/no-named-as-default-member': 0,
  'import/no-duplicates': 0,
  'import/no-self-import': 0,
  'import/extensions': 0,
  'import/no-useless-path-segments': 0,
  'import/no-extraneous-dependencies': 0
}
const jsxA11y = {
  'jsx-a11y/no-noninteractive-element-interactions': 0,
  'jsx-a11y/click-events-have-key-events': 0,
  'jsx-a11y/no-static-element-interactions': 0,
  'jsx-a11y/anchor-is-valid': 0
}

const next = {
  '@next/next/no-img-element': 0,
  '@next/next/no-sync-scripts': 0,
  '@next/next/no-css-tags': 0,
  '@next/next/link-passhref': 0
}
module.exports = {
  globals: {
    JMLink: true,
    THEME: true
  },
  ignorePatterns: ['*.sql'],
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@next/next/recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true
  },
  rules: {
    ...base,
    ...react,
    ...importConfig,
    ...jsxA11y,
    ...next,
    ...typescript
  }
}
