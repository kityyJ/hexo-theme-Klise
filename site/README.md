# JIA Klise 站点

此目录补齐 Hexo 站点，仓库根目录保留 Klise 主题及其 Apache 许可证。

- 正式域名： https://blog.jia.nz 。备用访问地址： https://jia-klise.pages.dev 。文章从原博客只读导入，旧站的数据和服务保留。
- 已发布文章快照： `import/published-posts.json`，共 41 篇；不包含草稿、待审核修改、私密字段。
- GitHub Actions 在 Node 22 上安装依赖、生成 Markdown、编译 Sass、运行 Hexo 并逐篇校验正文、日期、分类、标签和固定路径。
- 构建成功后，Markdown 和锁文件提交至 `main`；静态产物提交至 `gh-pages`。没有定时同步任务。
- Cloudflare Pages 使用 `gh-pages`，构建命令 `exit 0`，输出根目录，设置 `SKIP_DEPENDENCY_INSTALL=true`；仅发布 GitHub 已构建产物；正式域名通过独立 Worker 访问 Pages。
- 发布产物包含 `import-verification.json`，记录全部路径、元数据和正文 SHA-256。
- 保持正文原样；提示框和标签页在渲染时适配，未配置评论服务所以禁用评论。

回退站点版本：在 GitHub 撤销对应提交，或在 Pages 选择已有成功部署回滚。

当前域名入口（2026-11-05）：
- `blog.jia.nz` CNAME 指向 `cdn.yigeyao.com`，DNS only，TTL 自动；保留自动维护的优选 IP 池。
- `blog.jia.nz/*` → `jia-klise-proxy` → `https://jia-klise.pages.dev`，浏览器地址保持 `blog.jia.nz`。
- `routing/edge-proxy.mjs` 为转发源码；GitHub Actions 验证路径、查询参数、请求体、重定向和错误状态保留。
- 保留 `blog.jia.nz/admin*` → `sjk`，不修改旧 Worker、后台或文章数据。
- Pages 不直接绑定 `blog.jia.nz`，避免 DNS 指向优选 IP 池时与 Pages 域名校验冲突。
- 如需退回旧站，只需将 `blog.jia.nz/*` 的脚本改回 `jia-blog`，CNAME 和优选 IP 池保持原样。
