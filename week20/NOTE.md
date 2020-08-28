# 无头浏览器 - PhantomJS

- 下载地址：https://phantomjs.org/download

- 安装步骤
  - 解压到指定文件夹 (我是放在 D:\Tools\phantomjs)
  - windows 用户添加刚才解压的文件夹的bin文件夹到用户环境变量 (D:\Tools\phantomjs\bin)
  - 在 powershell 中输入 phantomjs --version 查看是否设置成功

- 测试步骤
  - 命令行打开 component-jsx 项目
  - npm run dev 开启开发环境
  - 命令行打开 phantomjs-demo 项目
  - 输入命令 phantomjs xx.js (eg: phantomjs check.js)