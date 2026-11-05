---
title: "使用 Docker 与 Gitea 部署私人 Git 服务器"
date: "2025-07-17T07:22:00.000Z"
updated: "2026-09-10T13:18:01.320Z"
categories: ["GitHub与开源"]
tags: ["Docker","Docker Compose","Git","Gitea"]
permalink: "github/gitea/"
jia_id: "28"
source_url: "https://blog.jia.nz/github/gitea/"
cover: "https://m.nep.me/blog/post/gitea.png"
excerpt: "前言Git 用来同步一些文档、代码确实非常的方便，但是总会有一些文件不希望同步至 GitHub 或是其他的公共服务商，这时可以使用开源项目自建一个属于私人的 Git 服务器。 我是有一些文件在只需要局域网内同步就可以了，在这之前我是使用的 GitLab 社区版部署的私人 Git 服务器。 不得不说，GitLab 也是非常强大的，但相对的占用资源也比较高，需要..."
---
## 前言

Git 用来同步一些文档、代码确实非常的方便，但是总会有一些文件不希望同步至 GitHub 或是其他的公共服务商，这时可以使用开源项目自建一个属于私人的 Git 服务器。

我是有一些文件在只需要局域网内同步就可以了，在这之前我是使用的 GitLab 社区版部署的私人 Git 服务器。

不得不说，GitLab 也是非常强大的，但相对的占用资源也比较高，需要较多的内存，而且也遇到过跨版本升级的问题。

GitLab CE 资源占用：

```
CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O         PIDS
b20641ebf857   gitlab    17.74%    5.869GiB / 15.62GiB   37.58%    425kB / 5.35MB
```

最终，我决定迁移至轻量级的 Gitea，Gitea 完成迁移后的资源占用：

```
CONTAINER ID   NAME         CPU %     MEM USAGE / LIMIT     MEM %     NET I/O         BLOCK I/O     PIDS 
57b52a98d527   gitea        0.14%     112.2MiB / 3.823GiB   2.87%     446kB / 345kB   0B / 113MB    14 
3abf2803c22c   gitea-db-1   0.00%     26.32MiB / 3.823GiB   0.67%     347kB / 445kB   0B / 1.02MB   9
```

使用 Docker Compose 部署起来也是非常简单的。

## Gitea 介绍

Gitea 的自我介绍： 一款极易搭建的自助 Git 服务

- 易安装：通过 二进制 来运行；或者通过 Docker 来运行；或者通过 安装包 来运行。

- 跨平台：任何 Go 语言 支持的平台都可以运行 Gitea，包括 Windows、Mac、Linux 以及 ARM。

- 轻量级：一个廉价的树莓派的配置足以满足 Gitea 的最低系统硬件要求。最大程度上节省您的服务器资源！

- 开源化：所有的代码都开源在 code.gitea.io/gitea 上

## 修改主机 SSH 端口

我们将使用 Docker 部署 Gitea，由于 git 默认使用 22 端口更方便一些，22 端口将映射给 Docker 使用，所以需要修改宿主机的 SSH 端口

命令均是在 root 权限下执行

```
vim /etc/ssh/sshd_config
```

修改 Port 22 为其他数字。

```
systemctl restart sshd
```

如果是远程服务器，记得先新开一个终端创建进行连接测试，确认可以登录再退出当前的窗口。

## 使用 Docker Compose 部署

如果没有安装 docker compose， 可以查看 [Debian 12 / Ubuntu 24.04 安装 Docker 以及 Docker Compose 教程](https://u.sb/debian-install-docker/)

首先创建一个工作文件夹，然后在其中创建 docker-compose.yml 文件，填入下面的内容：

```
networks:
  gitea:
    external: false

services:
  server:
    image: docker.gitea.com/gitea:1.24.2
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=postgres
      - GITEA__database__HOST=db:5432
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=gitea
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "22:22"
    depends_on:
      - db

  db:
    image: docker.io/library/postgres:14
    restart: always
    environment:
      - POSTGRES_USER=gitea
      - POSTGRES_PASSWORD=gitea
      - POSTGRES_DB=gitea
    networks:
      - gitea
    volumes:
      - ./postgres:/var/lib/postgresql/data
```

Gitea 的文件将保存在与 docker-compose.yml 同目录的 gitea 文件夹内，postgres 数据库文件保存在 postgres 文件夹内。

启动 Gitea ：

```
docker compose up -d
```

可以省略 docker compose pull ，第一次启动会自动拉取镜像。

然后就可以访问 http://:3000 查看，第一次打开会进入安装界面。

数据库部分不需要修改，可以修改下面的部分

- 服务器域名

- 基础URL

![](https://m.nep.me/blog/post/gitea.png)

## 关闭注册

进入 docker-compose.yml 目录，编辑文件 ./gitea/gitea/conf/app.ini 文件

```
vim ./gitea/gitea/conf/app.ini
```

修改下面的内容

```
[service]
DISABLE_REGISTRATION = true  # 禁用注册
#...
SHOW_REGISTARTION_BUTTON = false # 隐藏注册按钮

[openid]
ENABLE_OPENID_SIGNIN = false # 禁用openid登录
ENABLE_OPENID_SIGNUP = false # 禁用openid注册
```

重启 Gitea:

```
docker compose down
docker compose up -d
```

如果使用 Nginx 反代 Web 界面，可以将 docker-compose.yml 中的端口设置问仅限本地访问：

```
ports:
  - "127.0.0.1:3000:3000"
```

相比资源占用较大的 GitLab，Gitea 在功能上足够满足大多数个人或小团队的 Git 使用需求，且部署、维护成本极低，非常适合在本地或小型 VPS 上运行。

Gitea 的 Web 界面相当的简洁直观，功能上同样支持常见的 Git 功能和权限控制，支持使用 SSH Key 认证。如果你也有不便托管在 GitHub 上的私有项目，或者希望在局域网内构建自己的 Git 服务，Gitea 是一个非常值得尝试的解决方案。