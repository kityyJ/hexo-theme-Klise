---
title: "免费 1TB 私人网盘搭建指南：文件直链生成器 + Alist 完美挂载！"
date: "2019-03-31T04:32:00.000Z"
updated: "2026-09-16T13:19:31.102Z"
categories: ["GitHub与开源"]
tags: ["免费 1TB 私人网盘搭建指南：文件直链生成器 + Alist 完美挂载！"]
permalink: "github/alist/"
jia_id: "46"
source_url: "https://blog.yigeyao.com/github/alist/"
cover: ""
excerpt: "最近在技术圈发现了一个非常香的“羊毛”——云服务商（Hi168）注册就免费送 500GB 实名后送1T  的 S3 对象存储空间 ！对于喜欢折腾服务器、经常需要中转大文件或分享素材的玩家来说，这简直是天降的神仙级后备仓库。 今天，我就带大家实战演示，如何将这 1TB 空间“榨干”..."
---
# 

最近在技术圈发现了一个非常香的“羊毛”——云服务商（Hi168）注册就免费送 500GB 实名后送1T &nbsp;的 S3 对象存储空间 ！对于喜欢折腾服务器、经常需要中转大文件或分享素材的玩家来说，这简直是天降的神仙级后备仓库。

今天，我就带大家实战演示，如何将这 1TB 空间“榨干”，玩出两种截然不同用法：

- 轻量级玩法 ：利用 Cloudflare Workers 零成本手搓一个极简的 &nbsp;私人直链网盘 ，随时随地拖拽上传，极速获取文件直链。

- 终极完全体 ：将 S3 空间完美挂载到你服务器的 Alist 中，打造一个可以在线预览视频、管理目录的全功能私人云盘！

## &nbsp;方案一：极客专属，Cloudflare Workers 零成本搭建专属极速云盘

如果你手里没有服务器，或者只想弄个轻量级的工具用来快速分享文件，Cloudflare Workers 是最完美的方案。

### 1.获取 S3 凭证与“避坑指南”

在开始之前，我们需要从服务商后台拿到 S3 的连接配置。

来到注册网站：[https://www.hi168.com](https://www.hi168.com/) 注册后登陆进去-储存管理-创建储存桶-获取参数

这里有一个 极其容易踩坑的致命点 ！

通常 S3 需要四个参数，请对照你的后台严格记录：

- Endpoint（端点） ： OSS服务地址

- Access Key（访问密钥） ：后台密钥列表获取。

- Secret Key（安全密钥） ：后台密钥列表获取。

- Bucket（存储桶名称） ： 【超级大坑】 千万不要用后台显示的那个为了好看的“短桶名”（比如 webs3 ）！一定要使用系统分配的一长串 “挂载名称” （例如 hi168-30042-xxxxxx ）。API 接口只认这个底层真实的挂载名称，否则会一直报 NoSuchBucket 的错误！

### 2. 创建 Worker

进入 Cloudflare 后台，新建一个 Worker，将以下代码全部复制进去并部署：

&nbsp;Cloudflare Worker 源码（前后端合一）

直接复制代码的地址 ：[https://blog.020915.xyz/archives/s3web](https://blog.020915.xyz/archives/s3web)

### 3. 创建数据库

#### 第一步：创建一个免费的 KV 数据库

- 回到 Cloudflare 的主界面（Dashboard），在左侧菜单找到 Storage & Databases -> KV 。

- 点击右上角的 Create a namespace （创建命名空间）。

- 名字随便起，比如叫 MY_S3_RECORDS ，然后点击 Add 添加。

#### 第二步：把数据库和密码绑定给 Worker

- 回到你刚才那个 Worker 的详情页。

- 进入 Settings（设置） -> Variables and Secrets（变量和机密） 。

- 设置访问密码： 在你之前填 S3_BUCKET 的地方，再新增一个文本变量： 变量名： MY_PASSWORD

- 值：填一个你自己记得住的密码（比如 eianun666 ）。

- 绑定 KV 数据库： 往下滚动，找到 KV Namespace Bindings（KV 命名空间绑定） 这一块。 点击 Add binding。

- Variable name（变量名）填： RECORDS 。

- KV namespace（命名空间）下拉选择你刚才创建的 MY_S3_RECORDS 。

- 点击最下方的 Save and deploy（保存并部署）。

## 4. 配置环境变量

在 Worker 的 Settings -> Variables and Secrets 中添加以下变量：

- S3_ENDPOINT (文本): https://s3.hi168.com

- S3_BUCKET (文本): 你的挂载名称（不是短桶名！）

- S3_ACCESS_KEY (密钥): 你的 AK

- S3_SECRET_KEY (密钥): 你的 SK

保存部署后，访问你的 Worker 专属域名，就能看到一个支持拖拽、支持并发极速上传的极简云盘界面了！

## 方案二：终极体验，挂载 Alist 打造全功能私人网盘

如果你有一台云服务器，并且部署了 Alist ，那体验可以直接拉满！不仅能在线预览视频、图片，还能通过 WebDAV 挂载到电脑本地当硬盘用。

在 Alist 中添加存储，选择 Amazon S3 协议，并按以下参数填写：

- 挂载路径 ： /Hi168云盘 （自定义）

- 端点 (Endpoint) ： https://s3.hi168.com （结尾不要带 / ）

- 存储桶 (Bucket) ：填入那一长串 挂载名称 （血泪教训，再次强调）。

- 区域 (Region) ：填 us-east-1

- Access Key & Secret Key ：正常填入。

## 致命报错解决： no such host

如果你填完后状态报红，提示 dial tcp: lookup xxx.s3.hi168.com ... no such host ，这是因为中小服务商不支持 S3 的“虚拟主机样式（Virtual Hosted-Style）”。

解决办法 ：在 Alist 配置中往下划，找到 【强制路径样式 (Force Path Style)】 ，将这个开关 开启 (True) ，保存后瞬间变绿！

## 总结

通过以上两种方案，我们成功把白嫖来的 1TB 空间玩出了花。日常高频发图，用 Cloudflare Worker 随时随地拖拽秒传；大文件归档、视频素材管理，用 Alist 统一调度，美滋滋。

安全提醒： &nbsp;千万记得给你的 Access Key 和 Secret Key 保管好！这俩钥匙一旦泄露，你的 1TB 空间就会变成别人的跑马场。

如果你在折腾过程中遇到了其他问题，欢迎在评论区交流。我们下期教程再见！👋
