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

# OAuth

- 创建一个 github-app
  - 登录 github
  - 点击右上角用户头像
  - 点击 Settings
  - 点击 Developer settings
  - 点击 New GitHub App

- 用浏览器登录获取 auth code (publish-tool)
  - 用浏览器访问 https://github.com/login/oauth/authorize?client_id=Iv1.a841d13f0ce2a88a&redirect_uri=http://localhost:8080/&state=123abc

- 在服务端发送请求 (publish-server)

- 完整流程
  1. 启动 publish-server
  2. 启动 publish-tool 会自动打开浏览器
  3. 点击浏览器中的 publish 按钮
  4. 浏览器显示 publish success, server 项目中多了两个文件即发布成功