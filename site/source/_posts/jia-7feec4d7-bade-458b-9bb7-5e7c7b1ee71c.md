---
title: "Google AI Studio 制作 Android App 教程：从生成原生应用到手机测试"
date: "2026-10-15T05:49:57.576Z"
updated: "2026-10-18T16:28:19.467Z"
categories: ["科技数码"]
tags: ["Google AI Studio","Android","Jetpack Compose","App教程"]
permalink: "tech/google/"
jia_id: "7feec4d7-bade-458b-9bb7-5e7c7b1ee71c"
source_url: "https://blog.yigeyao.com/tech/google/"
cover: "https://www.jia.nz/__jia/google-ai-studio-cover.png"
excerpt: "按 Google AI Studio Build 流程创建 Kotlin 与 Jetpack Compose Android 应用，用浏览器模拟器检查界面，也可连接 ADB 或 Play 内部测试。文中区分个人设备试用、内测和公开上架的账号与地区条件。"
---
::: note 适用范围与日期
Google 于 2026-05-19 公布 AI Studio 的原生 Android 构建功能，10 月 13 日说明个人应用通过 Google Play 在本人设备运行的分批开放安排。地区、账号和界面入口可能继续变化；本文按官方公告说明，不保证每个账号都已出现相同按钮。
:::

Google AI Studio 的 Build 标签页现在支持生成原生 Android 应用，输出以 Kotlin 和 Jetpack Compose 为主。网页模拟器可预览；需要在真机测试时，可用 Android Debug Bridge（ADB）安装，也可以连接 Play Developer 账号，把版本推到 Google Play 内部测试轨道。

## 先把需求写清楚

不要只输入“帮我做一个漂亮的记账 App”。先列出谁会用、核心流程、页面、数据怎么保存、异常情况和明确不做的事。这样生成结果更容易检查，也减少反复推倒重来。

可先复制下面的提示，再替换方括号内容：

```text
请创建一个原生 Android 应用，使用 Kotlin 与 Jetpack Compose。
用途：[一句话说明]
用户流程：[打开应用后依次完成什么]
页面：[列出页面及每页的主要控件]
数据：[本地保存或调用的接口；没有把握时先用本地示例数据]
异常：[空列表、输入错误、无网络时怎么显示]
要求：支持深色模式和大字体；先完成可运行的最小版本。
请说明生成了哪些页面，以及需要我提供的配置；不要在代码里写入真实密钥。
```

## 在浏览器里生成与迭代

1. 登录 Google AI Studio，进入 Build 标签页。
2. 选择 `Build an Android app`，粘贴需求提示并生成。
3. 等它完成后，先在浏览器 Android 模拟器里走完主流程，不要只看首页截图。
4. 按问题一次修一个点，例如“保存后重启应用，数据仍应存在”或“输入为空时显示错误并阻止提交”。改完后重新走一遍相关流程。
5. 检查导航返回、键盘遮挡、长文本、无数据和无网络时的表现。AI 生成的代码仍需要实际测试；按钮能显示不等于业务逻辑正确。

Google 官方还列出 ADB 真机安装支持。要把 App 装到 Android 手机上测试，可按 AI Studio 当前页面提供的连接说明启用设备调试，再通过 ADB 安装；不同系统和设备的授权界面会有差别。不要把开发者密钥或个人资料粘进公开提示。

## 个人试用、内测和公开上架是三条路

| 目标 | 官方流程与条件 |
| --- | --- |
| 只在自己的手机运行 | Google 10 月公告称，AI Studio 个人应用可经 Google Play 私下运行，不需要 Developer 账号；该能力当时开始向包括美国在内的部分市场、18 岁以上用户分批推出。若入口未显示，可能是地区或 rollout 尚未覆盖。 |
| 邀请测试人员试用 | 在 AI Studio 连接 Google Play Developer 账号，再发布到 Internal Test Track；这与无需开发者账号的个人私用功能不同。 |
| 面向公众正式发布 | 需要专业 Developer 账号，并遵循 Google Play 的 Trust & Safety 审查和质量要求。 |

先选与你目标对应的路径：自己试用时不要误以为需要先完成公开上架；团队内测不要把个人私用入口当作测试轨道；正式上架则要按 Google Play 开发者流程准备应用资料、测试和审核。

::: warning 费用与隐私
AI Studio 生成原生代码不等于 Google Cloud 后端永久免费。若 App 要联网、保存用户资料或调用付费服务，应单独核实对应服务的价格、密钥保护和数据处理要求；不要把密钥硬编码进客户端。
:::

[Google AI Studio 原生 Android 构建说明](https://blog.google/innovation-and-ai/technology/developers-tools/google-ai-studio-io-2026/) · [Google Play 个人 App 与发布范围](https://blog.google/products-and-platforms/platforms/google-play/google-play-updates-october-2026/)