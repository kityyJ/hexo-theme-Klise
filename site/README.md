# JIA Klise 站点

此目录补齐 Hexo 站点，仓库根目录保留 Klise 主题及其 Apache 许可证。

- 正式域名： https://blog.jia.nz 。备用访问地址： https://jia-klise.pages.dev 。文章从原博客只读导入，旧站的数据和服务保留。
- 已发布文章快照： `import/published-posts.json`，共 41 篇；不包含草稿、待审核修改、私密字段。
- GitHub Actions 在 Node 22 上安装依赖、生成 Markdown、编译 Sass、运行 Hexo 并逐篇校验正文、日期、分类、标签和固定路径。
- 构建成功后，Markdown 和锁文件提交至 `main`；静态产物提交至 `gh-pages`。没有定时同步任务。
- Cloudflare Pages 使用 `gh-pages`，构建命令 `exit 0`，输出根目录，设置 `SKIP_DEPENDENCY_INSTALL=true`；仅发布 GitHub 已构建产物；自定义域名为 `blog.jia.nz`。
- 发布产物包含 `import-verification.json`，记录全部路径、元数据和正文 SHA-256。
- 保持正文原样；提示框和标签页在渲染时适配，未配置评论服务所以禁用评论。

回退站点版本：在 GitHub 撤销对应提交，或在 Pages 选择已有成功部署回滚。

域名切换记录（2026-11-05）：
- `blog.jia.nz` CNAME 从 `cdn.yigeyao.com`（DNS only，TTL 自动）切换为 `jia-klise.pages.dev`（代理开启）。
- 移除原 `blog.jia.nz/*` → `jia-blog` 的 Worker 路由，保留 `blog.jia.nz/admin*` → `sjk`。
- 原 Worker、后台和文章数据不删除。
- 若需退回原站：先恢复 `blog.jia.nz/*` → `jia-blog`，再恢复原 CNAME `cdn.yigeyao.com` 和 DNS only；最后移除 Pages 的 `blog.jia.nz` 自定义域名，并恢复 Hexo 的主地址配置。
