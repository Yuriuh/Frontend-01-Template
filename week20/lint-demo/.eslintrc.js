module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // 换行使用 /r/n 还是 /n
    'linebreak-style': ['error', 'windows'],
    // 文件的最后一行是否需要换行
    'eol-last': ["error", "never"],
    // 是否使用分号 ;
    'semi': ["error", "never", { "beforeStatementContinuationChars": "never"}]
  },
};
