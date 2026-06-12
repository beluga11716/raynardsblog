---
title: chabot
published: 2026-06-11
updated: 2026-06-11
description: 如何拥有一个属于自己的赛博猫娘的详细教程
tags:
  - utility_tools
  - ACGN
  - just_for_fun
category: just for fun
draft: false
slug: chatbot
author: raynard
---
**AstrBot + LLOneBot 部署全攻略：Windows 本地（.bat 一键脚本）+ Linux 云服务器（宝塔 Docker）保姆级教程**

AstrBot 是一款强大的开源 AI 聊天机器人框架，支持多种大模型和消息平台。本文详细记录在 **Windows 本地**（使用官方 .bat 一键安装脚本，非 Docker）和 **Linux 云服务器（宝塔面板 + Docker）** 部署 AstrBot，并通过 LLOneBot 实现 QQ 消息平台对接的全流程。重点讲解两者网络对接、反向 WebSocket 配置及 DeepSeek API 接入。

> [!IMPORTANT]  
> **重要提醒**：所有端口（如 22、6185、6199、5000、3080 等）默认均为**服务器内网端口**。必须在服务器提供商后台（如阿里云、腾讯云等）添加**公网端口映射**，并在宝塔面板「安全」中放行对应端口，才能从外部访问。

---

# 一、准备工作

1. **Windows 本地**：确保已安装 Python 3.12+（脚本会自动检测/提示）。
2. **Linux 云服务器**：推荐 Ubuntu/Debian，安装宝塔面板。
3. **端口规划**（提前在服务器后台映射公网端口，并在宝塔安全组放行）：
   - 服务器访问端口 **不是22！**
   - 6185：AstrBot WebUI 内网端口。
   - 6199：LLOneBot 反向 WebSocket 内网端口。
   - 5000：表情包管理插件内网端口。
   - 3080：部分 Docker 服务或面板映射可能使用（根据实际情况开放）。

---

# 二、Windows 本地部署（官方 .bat 一键脚本）

## 1. 下载 AstrBot 一键启动器
**AstrBotLauncher** 是 AstrBot 官方提供的桌面启动器，简化 Windows 用户的安装流程。

官方 GitHub 仓库地址：  
::github{repo="AstrBotDevs/AstrBotLauncher"}

- 进入 Releases 页面：https://github.com/AstrBotDevs/AstrBotLauncher/releases/latest
- 下载 `Source code (zip)` 并解压到任意文件夹（推荐桌面或 D 盘根目录）。

## 2. 运行一键安装脚本
- 解压后，打开文件夹。
- 双击`launcher_astrbot_en.bat`文件运行批处理脚本

脚本会自动完成环境检测、源码下载、依赖安装和启动。

> [!IMPORTANT]  
> **重要提醒**：首次运行可能需要较长时间下载依赖，请保持网络稳定。

部署完成后，浏览器访问 `http://localhost:6185`，默认账号密码均为 `astrbot`。

## 3. LLOneBot Windows 安装
**LLOneBot** 是功能强大的 QQ 协议适配器，支持 Docker 和桌面版。

官方文档地址：https://www.luckylillia.com/guide/choice_install

- 推荐下载 **LLOneBot Desktop**（桌面版），在官方文档或相关发布页获取最新版本。
- 解压后运行 `llbot.exe`，按提示登录 QQ（必须由 LLBot 拉起 QQ）。
- 配置反向 WebSocket（后续对接时详细说明）。

本地测试可直接使用同一网络，简化对接。

---

# 三、云端 Linux 部署（宝塔面板 + Docker）

## 1. SSH 连接服务器（使用 PuTTY）
**PuTTY** 是经典的 SSH 客户端，支持 Windows 连接 Linux 服务器。
当然也可以用finalshell 图形化界面更友好 这里推荐putty是因为足够小且简单 

官方下载地址：https://www.putty.org/ （或 GitHub 搜索 "PuTTY"）

- 下载并安装 PuTTY。
- 输入服务器 IP，**端口 22**（此为内网 SSH 端口，必须在服务器后台映射为公网端口才能外部连接）。
- 登录 root 用户。

> [!IMPORTANT]  
> **安全提醒**：强烈建议修改默认 root 密码，并使用密钥认证代替密码登录。

更新系统：

```bash
apt update && apt upgrade -y
```

## 2. 安装宝塔面板
**宝塔面板**（BT Panel）是国内流行的服务器管理面板，图形化操作 Docker 等服务非常方便。

官方下载地址：https://www.bt.cn/

一键安装脚本（Ubuntu 示例）：

```bash
wget -O install.sh https://download.bt.cn/install/install-ubuntu_0.1.sh && sudo bash install.sh
```

安装完成后，浏览器访问 `http://服务器IP:8888`（8888 端口同样需要公网映射和宝塔安全放行）设置账号密码。

## 3. 宝塔安装 Docker
- 宝塔左侧 → **docker**→安装docker→选**二进制**安装 

> [!IMPORTANT]  
> **重要提醒**：安装 Docker 后，重启宝塔 Docker 服务，确保正常运行。

## 4. 安装 AstrBot（宝塔 Docker 应用商店）
- Docker → **应用商店** → 搜索 “AstrBot” → 点击安装。
- **非常重要！**：创建容器前**开放端口**（均为内网端口）：
  - 6185（AstrBot WebUI）
  - 6199（预留给 LLOneBot）
  - 5000（表情包管理插件）
  - 3080（若有其他服务使用，同样需映射）
![image.png](https://tu.raynard.lol/file/blog/1781153606224.png)
> [!IMPORTANT]  
> **重要提醒**：必须在服务器后台添加公网端口映射，并在宝塔「安全」→「端口安全」中放行这些端口，否则外部无法访问 WebUI。

安装完成后启动容器，浏览器访问 `http://服务器IP:6185` 登录（默认 astrbot / astrbot）。

## 5. 安装 LLOneBot（Docker Compose 一键脚本）
根据官方文档 https://www.luckylillia.com/guide/choice_install ，在终端执行官方脚本拉取镜像并启动（容器名通常为 `root-llbot-1`）。

---

# 四、AstrBot 与 LLOneBot 对接（核心步骤）

AstrBot 作为服务器，LLOneBot 作为客户端通过 **反向 WebSocket** 连接。

## 1. 创建共享 Docker 网络（云端必须）
> [!IMPORTANT] IMPORTANT
> 必须要问过你中意的人工智能**如何将两个容器加入同一个bridge网络中** 我下面给的是我自己的容器名 要看清楚自己的容器名是什么 实在不行就直接把这段截图给豆包要它帮你分析

在服务器终端执行：

```bash
# 1. 创建专属机器人网络
docker network create bot-shared

# 2. 把 AstrBot 加入网络
docker network connect bot-shared astrbot

# 3. 把 llbot 容器加入网络（替换为实际容器名）
docker network connect bot-shared ubuntu-llbot-1

# 4. 重启两个容器加载网络
docker restart astrbot
docker restart ubuntu-llbot-1
```

## 2. 配置 LLOneBot（反向 WebSocket）
- 进入 LLOneBot WebUI 或配置文件。
- 开启 **反向 WebSocket 服务**。
- **监听地址**：`0.0.0.0`
- **端口**：`6199`（内网端口，需宝塔放行并公网映射）
- **目标 URL**（连接 AstrBot）：`ws://astrbot:6199/ws` （推荐使用容器名）或 `ws://服务器IP:6199/ws`
- Token（可选，与 AstrBot 保持一致）
- 保存并重启 LLOneBot。

> [!IMPORTANT]  
> **对接关键提醒**：两个容器必须在同一 Docker 网络内，否则无法通过容器名通信。

## 3. 配置 AstrBot 消息平台
- 登录 AstrBot WebUI（`http://服务器IP:6185`）。
- 左侧栏 → **机器人**（或 **消息平台**）→ **创建机器人**。
- 选择 **OneBot v11**（QQ 个人号等）。
- **保持默认配置**：
  - 反向 WebSocket 主机：`0.0.0.0`
  - 反向 WebSocket 端口：`6199`
  - Token（可选，与 LLOneBot 一致）
- 保存。

- 验证：在 AstrBot **控制台** 查看连接日志，LLOneBot 应显示已连接成功。

---

# 五、在 AstrBot 配置 DeepSeek 官方 API

1. 登录 AstrBot WebUI（6185 端口）。
2. 左侧栏点击 **配置** → **模型提供商**（或 **服务提供商**）。
3. 点击 **+ 新增模型提供商**。
4. 选择 **DeepSeek**（或 OpenAI 兼容接口）。
5. 填写以下配置：
   - **API Key**：前往 https://platform.deepseek.com/api_keys 创建并复制。
   - **Base URL**：`https://api.deepseek.com`
   - **模型**：`deepseek-chat`（或 `deepseek-reasoner`）
6. 点击 **保存**。
7. 返回模型列表，点击对应模型的 **测试** 按钮验证连通性。
8. 在机器人设置或默认模型中选择该 DeepSeek 提供商。

---

# 六、常见问题与优化

- **无法连接**：检查 Docker 网络（`docker network ls`）、端口映射、防火墙。
- **日志查看**：

```bash
docker logs -f astrbot
docker logs -f root-llbot-1
```

- **Windows 本地重启**：直接运行 `launcher_astrbot_en.bat` 即可。
- **插件**：AstrBot WebUI 内安装表情包插件等，开放 5000 端口。
- **安全**：修改默认密码，生产环境建议反代 + HTTPS。

> [!IMPORTANT]  
> **端口安全提醒**：所有 WebUI 端口（6185、6199、5000、3080 等）都需在服务器后台映射公网端口，并在宝塔安全组放行，否则外部无法访问。

---

# 七、总结

通过官方 `.bat` 一键脚本，本地 Windows 部署极其简单；云端使用宝塔 Docker 实现稳定运行。核心在于 **Docker 共享网络** + **反向 WebSocket** 对接，即可让 AstrBot 与 LLOneBot 完美通信。

部署完成后，尽情享受 DeepSeek 驱动的智能 QQ 机器人吧！🚀

**参考链接**：
- AstrBot Launcher：https://github.com/AstrBotDevs/AstrBotLauncher
- LLOneBot 文档：https://www.luckylillia.com/guide/choice_install
- PuTTY：https://www.putty.org/
- 宝塔面板：https://www.bt.cn/

欢迎评论区交流部署中的问题！