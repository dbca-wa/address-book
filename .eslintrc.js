module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    "no-console": 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ['error', {'args': 'none'}]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
