---
title: "在局域网中部署 Dokploy 并配合 dnsChallenge(Cloudflare) 签发证书"
date: "2019-03-10T03:02:00.000Z"
updated: "2026-09-10T13:27:34.131Z"
categories: ["GitHub与开源"]
tags: ["Let's Encrypt","Cloudflare","Dokploy"]
permalink: "github/dokploy/"
jia_id: "36"
source_url: "https://blog.yigeyao.com/github/dokploy/"
cover: ""
excerpt: "之前看见过很多人推荐 Dokploy，可以方便的部署、管理项目，印象颇深。 但是我还是一直在使用古法手动 docker compose 以及 pnpm start 运行一些项目。 随着现在 AI 的进步，整的小工具多了起来，确实管理起来略微麻烦，当然之前使用过 Dpanel 管理一些 Docker 应用，但是 Dpanel 的 2FA 是付费功能，略微不喜..."
---
之前看见过很多人推荐 [Dokploy](https://dokploy.com/)，可以方便的部署、管理项目，印象颇深。 但是我还是一直在使用古法手动 docker compose 以及 pnpm start 运行一些项目。

随着现在 AI 的进步，整的小工具多了起来，确实管理起来略微麻烦，当然之前使用过 Dpanel 管理一些 Docker 应用，但是 Dpanel 的 2FA 是付费功能，略微不喜。

于是打算先在我的局域网设备上体验一下。

## 安装 Dokploy

装了一个全新的 Debian 13 给 Dokploy 用 ，安装也是非常的简单，一条命令就可以了。

```
curl -sSL https://dokploy.com/install.sh | sh
```

然后访问 http://:3000 就可以了。

## 连接 GitHub

点击左侧的菜单的 Git ，右侧 Git Providers，点击 Github ，然后点击 Create GitHub App ，填写一个不重复的项目名称。

设置一下项目权限，然后就可以在 Dokploy 中部署对应的项目了。

## 部署项目

### 首先创建一个 Project

在左侧菜单栏选择 Projects 后，右侧可以创建 Project。

Project（项目）是一个整体，在项目内部可以创建不同 Service（服务），创建服务时才会使用到 Github 。

### 创建 Service

进入项目后，可以点击 Create Service 创建应用程序，可以选择以下的方式创建。

- Application : 我们是从 GitHub 拉取镜像创建，选择这一个

- Database : 创建数据库应用

- Compose : 使用 Docker Compose 创建

- Template : 内建的模板市场

选择 Application 创建后：

- 打开对应的 Service，选择之前连接的 Github 账户与项目

- 环境变量在 Environment 中设置

我的应用程序有提供 Dockerfile 文件，因此 Build Type 选择 Docckerfile 即可。

Dockerfile 文件位于根目录，下面的路径直接填写 Dockerfile 即可，另外的保持默认。

然后点击顶部的 Deploy 即可拉取镜像进行部署。

### 设置域名

部署完成后，发现无法访问，点击 Logs 会查看的下面的内容：

```
2025-12-15T09:38:31.197Z ▲ Next.js 15.5.9
2025-12-15T09:38:31.197Z - Local:        http://14888c5aa2db:3000
2025-12-15T09:38:31.197Z - Network:      http://14888c5aa2db:3000
2025-12-15T09:38:31.197Z ✓ Starting...
2025-12-15T09:38:31.276Z ✓ Ready in 88ms
```

这是因为没有设置 Domains ，无法访问到项目，Dokploy 使用的是 Traefik 进行反代与设置证书。

Dokploy 中默认使用的是 httpChallenge 签发 Let’s Encrypt 证书，如果 Dokploy 部署在公网服务器上，只要简单的填写 Host ，并将 Certificate Provider 选择 Let’s Encrypt 就可以打开 HTTPS 使用了。

可是我的 Dokploy 服务器位于局域网中，无法完成 httpChallenge ，不过 Traefik 是支持使用 Cloudflare API 进行 dnsChallenge 的，需要修改一些设置。

## 设置 dnsChallenge(Cloudflare)

### 获取 Cloudflare API Token

- 登录 Cloudflare Dashboard: [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)

- 选择创建令牌

- 记得编辑一下 令牌名称 用于区分用途

- 令牌模板选择 编辑区域 DNS

- 根据最小化授权的原则，区域资源选择对应的域名

- 根据需求设置允许的 IP 地址以及生效时间

点击继续，最后显示对应的 Token ，保存备用，Token 只会显示这一次，以后无法查看。

### 修改 traefik.yml

在 Dokploy 左侧菜单栏选择 Home > Traefik File System ，右侧点击 traefik.yml ，需要点击 Unlock 才可以编辑，将底部的

```
certificatesResolvers: 
  letsencrypt: 
    acme: email: [email protected] 
    storage: /etc/dokploy/traefik/dynamic/acme.json 
    httpChallenge: entryPoint: web
```

修改为

```
certificatesResolvers:
  letsencrypt:
    acme:
      email: [email protected]
      storage: /etc/dokploy/traefik/dynamic/acme.json
      dnsChallenge:
        provider: cloudflare
        delayBeforeCheck: 10
```

点击 Update 后再点击右上角 Lock

### 设置 Cloudflare API Token

在 Dokploy 左侧菜单栏选择 Settings > Web Server ，右侧点击 Traefik ， Actions 中选择 Modify Environment ，加入 Cloudflare API token 的设置。

修改后显示如下

```
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
CF_DNS_API_TOKEN=your_cloudflare_api_token
```

然后就可以签发证书了， 访问 Dokploy 的域名也是在这个页面的 Server Domain 部分中进行设置。

## 安全设置

确认可以通过 HTTPS 域名访问 Dokploy 后，我们需要关闭 ip:port 的访问， 在服务器上执行下面的命令即可

```
docker service update --publish-rm "published=3000,target=3000,mode=host" dokploy
```

更多的安全内容请查看 [Dokploy Docs: Security](https://docs.dokploy.com/docs/core/remote-servers/security)