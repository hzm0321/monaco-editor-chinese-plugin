# monaco-editor-chinese-plugin

```bash
npm install --save-dev monaco-editor-chinese-plugin
```

<h2 align="center">Usage</h2>

**webpack config**
```js
const MonacoChinesePlugin = require('monaco-editor-chinese-plugin');

module.exports = {
    ...
    plugins: [
        new MonacoChinesePlugin({
            //defaultLanguage: "getLanguageSetting()",
            /**
             * log on console if unmatched
             */
            logUnmatched: false,
            /**
             * self languages map, .eg {"zh-cn": {"Find": "查找", "Search": "搜索"}, "de":{}, ... }
             */
            mapLanguages: {},
        })
    ]
}
```

<h2 align="center">HzeroJs Usage</h2>

**webpack config**
```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MonacoChinesePlugin = require('monaco-editor-chinese-plugin');

const config: IConfig = {
  chainWebpack: (c) => {
    c.plugin('monaco-editor-webpack-plugin').use(new MonacoWebpackPlugin({
      languages: ['javascript', 'typescript', 'sql', 'json'],
    }));
    c.plugin('monaco-editor-chinese-plugin').use(new MonacoChinesePlugin({
      logUnmatched: true,
    }));
    // ......
  },
  // 其余配置 ......
};
export default config;
```
