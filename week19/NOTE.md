# 如何实现一个线上 Web 服务

- 三个项目
  - server
  - publish-server
  - publish-tool

这三者的关系：先开启 publish-server 项目, 再开启 publish-tool 项目, publish-tool 相当于类似浏览器的客户端向 publish-server 发送请求, 把 publish-tool 文件夹的 package 目录下的文件上传到 publish-server 服务器, publish-server 服务器把文件写入 server 的 public 文件夹

- 搭一个 express 服务器
  - 新建 server 文件夹 (PS: md server)
  - cd server
  - npx express-generator --no-view (生成 express 目录)
  - npm i (安装依赖)