---
title: "Windows 11 下 LG 电视开启 HDR 发绿解决方案"
date: "2026-09-10T13:01:00.000Z"
updated: "2026-09-10T13:29:07.383Z"
categories: ["干货教程"]
tags: ["Windows 11","HDR","Dolby Vision"]
permalink: "guide/tips/"
jia_id: "35"
source_url: "https://blog.yigeyao.com/guide/tips/"
cover: "https://m.nep.me/blog/post/windows-11-tv-hdr-dolby.png"
excerpt: "这几天一直在折腾显卡的问题，只用 DP 接了普通的显示器使用，显卡的问题终于有些眉目了，于是重新接回我的 LG C2 电视，打开 HDR 嗯？ 屏幕你怎么绿了，而且以前切换后右上角是显示 HDR ，现在是 Dolby Vision ，难道显卡又出新毛病了？ 尝试了重启、换线都没有效果，只要一开 HDR 就是绿色的屏幕。 我都准备又要使用 DDU 重装驱动了..."
---
## 正文

这几天一直在折腾显卡的问题，只用 DP 接了普通的显示器使用，显卡的问题终于有些眉目了，于是重新接回我的 LG C2 电视，打开 HDR

嗯？ 屏幕你怎么绿了，而且以前切换后右上角是显示 HDR ，现在是 Dolby Vision ，难道显卡又出新毛病了？

尝试了重启、换线都没有效果，只要一开 HDR 就是绿色的屏幕。

我都准备又要使用 DDU 重装驱动了，还好先搜了一下，发现原来是 Windows 最近的更新导致的，解决也很简单

- 桌面上点击右键，选择 显示设置

- 选择 TV 对应的屏幕，进入 HDR 的菜单

- 点击 HDR 右侧的箭头展开菜单

- 关闭 使用 Dolby Vision 模式

![](https://m.nep.me/blog/post/windows-11-tv-hdr-dolby.png)

但是如果重启电脑后，重新从非 HDR 显示器切换过来，又会恢复绿色屏幕，可以使用以下三种方法中的一种

- 在设置中关闭 Dolby Vision 后，前往 Windows 更新，卸载 KB5063060

- 在 Nvidia 控制面板中将色彩格式改为 YCbCr420 ，这将会导致图像质量下降

- 使用 CRU 禁用 Dolby 扩展，[Permanently Disable Dolby Vision via CRU](https://www.reddit.com/r/OLED_Gaming/comments/1lgfmml/comment/mzoexf0/)

参考：[LG C2 Showing Dolby Vision With Purple/Green Tint After Win11 Update – CRU Didn’t Help](https://www.reddit.com/r/OLED_Gaming/comments/1kztazu/lg_c2_showing_dolby_vision_with_purplegreen_tint/)