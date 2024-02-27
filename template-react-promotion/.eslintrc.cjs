module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime', // 启用新jsx规则
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/jsx-uses-react': 'off', // 关闭旧模式校验
    'react/react-in-jsx-scope': 'off', // 关闭旧模式校验
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // 启用JSX
    },
  },
};
