---
title: "利用 AgentDock，让 ChatGPT 网页端变成一个「Codex 平替」"
date: "2026-09-08T15:00:00.000Z"
updated: "2026-09-16T13:44:30.882Z"
categories: ["GitHub与开源"]
tags: ["利用 AgentDock，让 ChatGPT 网页端变成一个「Codex 平替」"]
permalink: "github/agentdock/"
jia_id: "47"
source_url: "https://blog.yigeyao.com/github/agentdock/"
cover: "https://www.acofork.com/img/agentdock-chatgpt-codex/cover.webp"
excerpt: "用 AgentDock 把自己电脑和服务器接进 ChatGPT 网页端，让它能直接读项目、改代码、跑命令、测试和 Git。"
---
2026-09-09 · 2015 字
 
# 利用 AgentDock，让 ChatGPT 网页端变成一个「Codex 平替」
 
用 AgentDock 把自己电脑和服务器接进 ChatGPT 网页端，让它能直接读项目、改代码、跑命令、测试和 Git。
 
svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80"> AI svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80"> AgentDock svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80"> ChatGPT svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80"> MCP svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80"> 开发
 

 
![](https://www.acofork.com/img/agentdock-chatgpt-codex/cover.webp) 本文由 AI 编写。我提供实际使用场景和截图，技术内容按 [AgentDock 当前源码](https://github.com/uvwt/agentdock) 核对。 我之前开发基本都在用 Codex，也专门买了对应的套餐。 问题是 Codex 有自己的一份开发额度。用完以后，就得等它恢复。 而 ChatGPT 里的普通「聊天」还有另一套额度。于是我就在想：既然聊天里的模型也很强，能不能把它也接到我的电脑上？这样 Codex 的额度用完了，我还能直接在聊天里继续开发。 AgentDock 刚好把这件事补上了。 本文讲的就是这套用法： 让 ChatGPT 的「聊天」也能像 Codex 一样直接操作真实项目。 我自己用 Pro 5x 高强度开发到现在，还没在这套聊天工作流里撞到过限额。不过网页端具体能用多少并没有一个简单的固定数字，我也不打算在这里猜。 ## 把自己的电脑接进 ChatGPT ChatGPT 的开发者模式允许你添加第三方 MCP，并把它作为「应用」接进聊天。这个能力由 OpenAI 官方提供。它走的是 ChatGPT 原生的 MCP 接入流程，不需要反代网页、注入脚本或劫持 Tool Call。 调用工具时，是 ChatGPT 去连接你配置的 MCP 服务。MCP 如果跑在自己的电脑或内网里，也需要通过 Tunnel 之类的方式让 ChatGPT 能访问到它。 这里也有一个很直接的安全问题： 不要乱接你不控制、也不信任的 MCP。 MCP 能看到什么、能改什么，取决于你给它暴露了哪些工具和权限。不可信的 MCP 还可能带来提示注入等风险。OpenAI 官方文档也明确要求，只连接你信任并且审查过的 MCP。 所以开发者模式默认不开启是合理的。打开以后，相当于允许 ChatGPT 从纯聊天进一步调用外部系统，尤其是文件修改、命令执行这类写操作，权限要自己管好。 AgentDock 本身就是一个 MCP 工具运行时，装在 Windows、Linux、服务器或者容器上，把文件、命令、Git 等能力交给 ChatGPT 调用。 ![](https://www.acofork.com/img/agentdock-chatgpt-codex/developer-mode.png) 接好以后，它会出现在 ChatGPT 的工具列表里。 ![](https://www.acofork.com/img/agentdock-chatgpt-codex/agentdock-plugin.png) 如果你之前一直用「工作」里的 Codex，这里会有一点不习惯： 聊天没有让你先选代码仓库、再指定工作目录的那套界面。 可以简单理解为，AgentDock 把这台机器上的文件、命令、Git 等能力直接交给了 ChatGPT。它不会在每次聊天开始时弹窗问你「这次在哪个项目里工作」。 所以我的习惯是，每次开头先 @AgentDock，然后直接把机器和目录一起说清楚： @AgentDock-af C:\Users\acofo\Documents\GitHub\af-frontend-svelte，改一下博客文章页面的链接图标。 后面它就在这个上下文里继续读文件、改代码、跑命令和 Git。 相比 Codex 的工作区选择，这一步确实麻烦一点。但也更直接：不需要先创建一个“工作”，告诉它去哪台机器、哪个目录、干什么就行。 ![](https://www.acofork.com/img/agentdock-chatgpt-codex/agentdock-running.png) 这就是我说它可以做 ChatGPT 网页端「Codex 平替」的原因。 AgentDock 没有替代 Codex 模型。它补上的是日常开发最关键的执行能力。 ## 安装 安装直接看官方文档：[安装 AgentDock](https://uvwt.github.io/agentdock-docs/zh-CN/docs/getting-started/install)。Windows、Linux、macOS 和 Docker 都有对应方式，普通用户不需要下载源码，也不用自己装 Go 编译。 如果懒得自己折腾，也可以把安装文档丢给 AI，让它照着文档帮你装。尤其是 Linux 服务器，这类安装、配置服务和检查运行状态的活很适合直接交给 AI 代劳。 ## 公网怎么接 本机用的话，AgentDock 可以直接提供 MCP 地址。 但 ChatGPT 网页端要访问你自己的电脑或服务器，一般还需要一个公网 HTTPS 入口。我这里用 Cloudflare Tunnel。 链路大概就是： text

```text
ChatGPT
  ↓
公网 HTTPS
  ↓
Cloudflare Tunnel
  ↓
AgentDock
  ↓
我的电脑 / 服务器
```

Tunnel 在这里负责提供公网入口，和 AgentDock 是两层东西。你也可以用别的方式解决公网访问。

公网使用时要开认证。AgentDock 支持 Bearer Token 和 OAuth。

这里别理解成「开了 OAuth，请求就一定来自 OpenAI」。OAuth/Bearer 解决的是谁有权限调用你的 AgentDock。

## 它不只是一个裸 Shell

如果只是给 AI 一个 SSH，其实也能执行命令。

AgentDock 做得更适合 AI 一点。

文件有单独的读取、搜索、编辑工具；命令支持超时、输出限制和长任务 session；参数会做校验；stdout、stderr、退出码也会分开返回。

所以模型不需要什么都靠一条超长 Shell 命令硬搓。

这些细节我不会在这里展开，想看实现直接去官方仓库：

[https://github.com/uvwt/agentdock](https://github.com/uvwt/agentdock)

## 多设备很好用

这是我很喜欢的一点。

我可以在本机 Windows、Linux 服务器、其他机器上分别装 AgentDock，然后都接进同一个 ChatGPT 会话。

于是我可以直接说：

text

```text
Windows 机改前端
Linux 机看日志
另一台服务器查容器状态
最后一起验证
```

不用自己开三四个 SSH 窗口，也不用反复告诉 AI「现在我切到哪台机子了」。

这也是为什么我平时会直接说「XXX 机子，执行一下 fastfetch」。

还有一个我很喜欢