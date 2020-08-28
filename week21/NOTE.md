# githook

在 .git 文件夹的 hooks 文件夹下有如下脚本文件：

- pre-commit.sample
- pre-push.sample

我们在 hooks 文件夹新建一个 pre-commit 文件, 并在该文件的第一行加上 shebang:

```
#!/usr/bin/env node
# ...
```