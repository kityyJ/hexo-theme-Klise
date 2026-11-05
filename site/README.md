# JIA Klise 站点

此目录补齐 Hexo 站点，仓库根目录保留 Klise 主题及其 Apache 许可证。

- 原博客： https://blog.jia.nz ，本次只读，不改动原博客和域名。
- 已发布文章快照： `import/published-posts.json`，共 41 篇；不包含草稿、待审核修改、私密字段。
- GitHub Actions 在 Node 22 上安装依赖、生成 Markdown、编译 Sass、运行 Hexo 并逐篇校验正文、日期、分类、标签和固定路径。
- 构建成功后，Markdown 和锁文件提交至 `main`；静态产物提交至 `gh-pages`。没有定时同步任务。
- Cloudflare Pages 使用 `gh-pages`，构建命令 `exit 0`，输出根目录，设置 `SKIP_DEPENDENCY_INSTALL=true`；仅发布 GitHub 已构建产物，不绑定自定义域名。
- 发布产物包含 `import-verification.json`，记录全部路径、元数据和正文 SHA-256。
- 保持正文原样；提示框和标签页在渲染时适配，未配置评论服务所以禁用评论。

回退：在 GitHub 撤销本次提交；Pages 可选择已有成功部署回滚。不要修改原博客、DNS 或删除历史文章。
