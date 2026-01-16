# doudian-finance 项目 Windows Server 2019 部署教程（图文版）

> **文档版本**：v1.0  
> **更新日期**：2026年1月11日  
> **作者**：Manus AI  
> **适用系统**：Windows Server 2019

---

## 目录

1. [部署概述](#1-部署概述)
2. [环境要求](#2-环境要求)
3. [安装Node.js](#3-安装nodejs)
4. [安装MySQL数据库](#4-安装mysql数据库)
5. [安装pnpm包管理器](#5-安装pnpm包管理器)
6. [项目部署](#6-项目部署)
7. [PM2进程管理](#7-pm2进程管理)
8. [配置反向代理](#8-配置反向代理)
9. [防火墙配置](#9-防火墙配置)
10. [常见问题排查](#10-常见问题排查)

---

## 1. 部署概述

### 1.1 系统架构

doudian-finance 项目在 Windows Server 2019 上的部署架构如下图所示：

![Windows Server 架构图](./images/win-architecture.png)

**架构组件说明**：

| 组件 | 端口 | 说明 |
|------|------|------|
| IIS + ARR 或 Nginx | 80/443 | 反向代理、SSL终端、静态文件服务 |
| Node.js + Express | 3000 | 应用服务器，处理API请求 |
| MySQL 8.0 | 3306 | 数据库服务 |
| PM2 | - | Node.js进程管理 |

### 1.2 部署流程

完整的部署流程包含8个主要步骤：

![部署流程图](./images/win-deploy-flow.png)

### 1.3 项目目录结构

部署完成后，项目目录结构如下：

![目录结构](./images/win-folder-structure.png)

---

## 2. 环境要求

### 2.1 服务器配置要求

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| 操作系统 | Windows Server 2019 | Windows Server 2019/2022 |
| CPU | 2核 | 4核及以上 |
| 内存 | 4GB | 8GB及以上 |
| 硬盘 | 50GB SSD | 100GB SSD |
| 网络 | 公网IP | 固定公网IP |

### 2.2 软件版本要求

| 软件 | 版本要求 | 下载地址 |
|------|----------|----------|
| Node.js | **18.x LTS** | https://nodejs.org/ |
| pnpm | 10.4.1+ | npm全局安装 |
| MySQL | 8.0 | https://dev.mysql.com/downloads/ |
| PM2 | 5.0+ | npm全局安装 |
| Nginx（可选） | 1.24+ | https://nginx.org/en/download.html |

> **重要提示**：本项目必须使用 **pnpm** 作为包管理器，请勿使用 npm 或 yarn 安装依赖。

---

## 3. 安装Node.js

### 3.1 下载Node.js安装包

访问 Node.js 官方网站下载 Windows 安装包：

1. 打开浏览器访问 https://nodejs.org/
2. 选择 **18.x LTS** 版本（长期支持版）
3. 点击下载 Windows Installer (.msi) 64-bit

![Node.js下载页面](./images/win-nodejs-download.png)

### 3.2 安装Node.js

双击下载的 `.msi` 安装包，按照向导完成安装：

![Node.js安装向导](./images/win-nodejs-setup.png)

**安装步骤**：

1. 双击 `node-v18.x.x-x64.msi` 启动安装程序
2. 点击 **Next** 继续
3. 勾选 **I accept the terms in the License Agreement**，点击 **Next**
4. 选择安装路径（建议保持默认 `C:\Program Files\nodejs\`）
5. 在 Custom Setup 页面，确保以下组件被选中：
   - Node.js runtime
   - npm package manager
   - Add to PATH
6. 点击 **Next** → **Install** 开始安装
7. 安装完成后点击 **Finish**

### 3.3 验证安装

打开 **命令提示符（CMD）** 或 **PowerShell**，验证安装：

```powershell
# 查看Node.js版本
node -v
# 应显示: v18.x.x

# 查看npm版本
npm -v
# 应显示: 10.x.x
```

### 3.4 配置npm镜像（可选）

如果下载速度较慢，可配置国内镜像：

```powershell
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
```

---

## 4. 安装MySQL数据库

### 4.1 下载MySQL安装包

1. 访问 https://dev.mysql.com/downloads/installer/
2. 下载 **MySQL Installer for Windows**
3. 选择完整版（mysql-installer-community-8.0.x.msi）

### 4.2 安装MySQL

运行安装程序，选择 **Server only** 或 **Custom** 安装类型：

**安装步骤**：

1. 启动 MySQL Installer
2. 选择 **Custom** 安装类型
3. 选择安装组件：
   - MySQL Server 8.0.x
   - MySQL Workbench（可选，图形化管理工具）
4. 点击 **Execute** 开始安装
5. 配置 MySQL Server：
   - Config Type: **Development Computer** 或 **Server Computer**
   - Port: **3306**（默认）
   - 设置 root 密码（请牢记此密码）
6. 完成安装

### 4.3 创建项目数据库

打开 **MySQL Workbench** 或使用命令行创建数据库：

```sql
-- 连接MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE doudian_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建专用用户
CREATE USER 'doudian_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';

-- 授权
GRANT ALL PRIVILEGES ON doudian_finance.* TO 'doudian_user'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 4.4 记录数据库连接信息

记录以下信息，后续配置环境变量时需要：

| 配置项 | 值 |
|--------|-----|
| 主机 | localhost |
| 端口 | 3306 |
| 数据库名 | doudian_finance |
| 用户名 | doudian_user |
| 密码 | YourStrongPassword123! |

---

## 5. 安装pnpm包管理器

### 5.1 全局安装pnpm

打开 **PowerShell（管理员模式）**，执行以下命令：

```powershell
# 安装pnpm
npm install -g pnpm@10.4.1

# 验证安装
pnpm -v
# 应显示: 10.4.1
```

### 5.2 配置pnpm镜像（可选）

```powershell
# 设置国内镜像
pnpm config set registry https://registry.npmmirror.com
```

---

## 6. 项目部署

### 6.1 创建项目目录

在 Windows 资源管理器中创建项目目录，或使用命令行：

```powershell
# 创建项目目录
mkdir C:\doudian-finance
cd C:\doudian-finance
```

### 6.2 上传项目文件

将项目文件上传到服务器，可使用以下方式：

**方法一：远程桌面直接复制**

1. 通过远程桌面连接服务器
2. 将本地项目文件夹复制到 `C:\doudian-finance\`

**方法二：使用Git克隆**

```powershell
# 安装Git（如未安装）
# 下载地址: https://git-scm.com/download/win

# 克隆项目
cd C:\doudian-finance
git clone https://github.com/your-username/doudian-finance-prototype.git .
```

**方法三：使用FTP/SFTP上传**

使用 FileZilla 或 WinSCP 等工具上传项目文件。

### 6.3 配置环境变量

在项目根目录创建 `.env` 文件：

```powershell
# 进入项目目录
cd C:\doudian-finance

# 使用记事本创建.env文件
notepad .env
```

在记事本中输入以下内容并保存：

```ini
# 应用环境
NODE_ENV=production
PORT=3000

# 数据库配置（MySQL连接字符串）
DATABASE_URL=mysql://doudian_user:YourStrongPassword123!@localhost:3306/doudian_finance

# JWT密钥（请替换为随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this

# 应用信息
VITE_APP_TITLE=闪电帐PRO
VITE_APP_LOGO=/logo.png
```

> **安全提示**：请将 `JWT_SECRET` 替换为随机生成的安全密钥。可使用在线工具生成随机字符串。

### 6.4 安装项目依赖

打开 **PowerShell**，进入项目目录安装依赖：

```powershell
# 进入项目目录
cd C:\doudian-finance

# 安装依赖（使用pnpm）
pnpm install
```

依赖安装过程可能需要5-10分钟，请耐心等待。

### 6.5 构建项目

执行构建命令生成生产环境代码：

```powershell
# 构建项目
pnpm build
```

**构建成功后**，`dist` 目录将包含：

```
C:\doudian-finance\dist\
├── index.js          # 服务端入口文件
└── public\           # 前端静态文件
    ├── index.html
    └── assets\
```

### 6.6 初始化数据库

运行数据库迁移命令：

```powershell
# 执行数据库迁移
pnpm db:push
```

此命令会根据 `drizzle/schema.ts` 中的定义创建数据库表。

### 6.7 测试运行

在正式使用PM2之前，先测试应用是否能正常启动：

```powershell
# 测试启动
pnpm start

# 如果看到以下输出，说明启动成功：
# Server running on http://localhost:3000/
```

按 `Ctrl+C` 停止测试运行。

---

## 7. PM2进程管理

### 7.1 安装PM2

全局安装PM2：

```powershell
# 安装PM2
npm install -g pm2

# 验证安装
pm2 -v
```

### 7.2 安装PM2 Windows服务

为了让PM2在Windows重启后自动启动，需要安装Windows服务：

```powershell
# 安装pm2-windows-startup
npm install -g pm2-windows-startup

# 安装Windows服务
pm2-startup install
```

![PM2 Windows服务](./images/win-pm2-service.png)

### 7.3 创建PM2配置文件

在项目根目录创建 `ecosystem.config.cjs` 文件：

```powershell
cd C:\doudian-finance
notepad ecosystem.config.cjs
```

输入以下内容：

```javascript
module.exports = {
  apps: [{
    name: 'doudian-finance',
    script: './dist/index.js',
    cwd: 'C:\\doudian-finance',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'C:\\doudian-finance\\logs\\error.log',
    out_file: 'C:\\doudian-finance\\logs\\out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M',
    restart_delay: 3000,
    autorestart: true,
    watch: false
  }]
};
```

### 7.4 创建日志目录

```powershell
mkdir C:\doudian-finance\logs
```

### 7.5 启动应用

使用PM2启动应用：

```powershell
# 进入项目目录
cd C:\doudian-finance

# 启动应用
pm2 start ecosystem.config.cjs

# 查看运行状态
pm2 status

# 保存进程列表（用于重启后恢复）
pm2 save
```

### 7.6 PM2常用命令

| 命令 | 说明 |
|------|------|
| `pm2 start ecosystem.config.cjs` | 启动应用 |
| `pm2 stop doudian-finance` | 停止应用 |
| `pm2 restart doudian-finance` | 重启应用 |
| `pm2 reload doudian-finance` | 零停机重载 |
| `pm2 delete doudian-finance` | 删除应用 |
| `pm2 logs doudian-finance` | 查看日志 |
| `pm2 monit` | 实时监控 |
| `pm2 status` | 查看状态 |
| `pm2 save` | 保存进程列表 |

---

## 8. 配置反向代理

您可以选择使用 **IIS + ARR** 或 **Nginx for Windows** 作为反向代理。

### 方案A：使用Nginx for Windows（推荐）

#### 8.1 下载Nginx

1. 访问 https://nginx.org/en/download.html
2. 下载 **Stable version** 的 Windows 版本
3. 解压到 `C:\nginx`

#### 8.2 配置Nginx

编辑 `C:\nginx\conf\nginx.conf` 文件：

```nginx
worker_processes  auto;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # 上游服务器（Node.js应用）
    upstream doudian_backend {
        server 127.0.0.1:3000;
        keepalive 32;
    }

    server {
        listen       80;
        server_name  localhost;  # 替换为您的域名

        # 网站根目录（前端静态文件）
        root C:/doudian-finance/dist/public;
        index index.html;

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
            try_files $uri =404;
        }

        # API反向代理
        location /api {
            proxy_pass http://doudian_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # SPA路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 错误页面
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

#### 8.3 启动Nginx

```powershell
# 进入Nginx目录
cd C:\nginx

# 启动Nginx
start nginx

# 验证是否运行
tasklist /fi "imagename eq nginx.exe"

# 重载配置
nginx -s reload

# 停止Nginx
nginx -s stop
```

#### 8.4 将Nginx设置为Windows服务

使用 **NSSM** (Non-Sucking Service Manager) 将Nginx设置为Windows服务：

```powershell
# 下载NSSM: https://nssm.cc/download
# 解压后执行：

nssm install nginx C:\nginx\nginx.exe
nssm start nginx
```

### 方案B：使用IIS + ARR

#### 8.5 安装IIS

1. 打开 **服务器管理器**
2. 点击 **添加角色和功能**
3. 选择 **Web服务器(IIS)**
4. 完成安装

#### 8.6 安装ARR和URL Rewrite

1. 下载 **Application Request Routing (ARR)**：
   https://www.iis.net/downloads/microsoft/application-request-routing

2. 下载 **URL Rewrite**：
   https://www.iis.net/downloads/microsoft/url-rewrite

3. 安装这两个组件

![IIS ARR配置](./images/win-iis-arr.jpg)

#### 8.7 配置IIS反向代理

1. 打开 **IIS管理器**
2. 选择服务器节点，双击 **Application Request Routing Cache**
3. 点击右侧 **Server Proxy Settings**
4. 勾选 **Enable proxy**
5. 点击 **应用**

![IIS反向代理配置](./images/win-iis-proxy.png)

#### 8.8 创建网站并配置URL重写

1. 在IIS中创建新网站，指向 `C:\doudian-finance\dist\public`
2. 在网站根目录创建 `web.config` 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <!-- API反向代理 -->
                <rule name="API Proxy" stopProcessing="true">
                    <match url="^api/(.*)" />
                    <action type="Rewrite" url="http://localhost:3000/api/{R:1}" />
                </rule>
                <!-- SPA路由支持 -->
                <rule name="SPA Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
            </rules>
        </rewrite>
        <staticContent>
            <mimeMap fileExtension=".json" mimeType="application/json" />
            <mimeMap fileExtension=".woff" mimeType="font/woff" />
            <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
        </staticContent>
    </system.webServer>
</configuration>
```

---

## 9. 防火墙配置

### 9.1 开放必要端口

打开 **Windows Defender 防火墙**，添加入站规则：

```powershell
# 使用PowerShell添加防火墙规则

# 开放HTTP端口
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

# 开放HTTPS端口
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow

# 开放Node.js端口（仅内网访问）
New-NetFirewallRule -DisplayName "Node.js" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -RemoteAddress LocalSubnet
```

### 9.2 云服务器安全组

如果使用云服务器（阿里云、腾讯云等），还需要在安全组中开放端口：

| 端口 | 协议 | 说明 |
|------|------|------|
| 80 | TCP | HTTP访问 |
| 443 | TCP | HTTPS访问 |
| 3389 | TCP | 远程桌面 |

---

## 10. 常见问题排查

### 10.1 应用启动失败

**问题现象**：PM2显示应用状态为 `errored`。

**排查步骤**：

```powershell
# 查看错误日志
pm2 logs doudian-finance --err --lines 100

# 常见错误：

# 1. 找不到dist/index.js
# 解决：执行 pnpm build

# 2. 数据库连接失败
# 解决：检查.env中的DATABASE_URL配置

# 3. 端口被占用
# 解决：
netstat -ano | findstr :3000
# 找到占用进程的PID，然后：
taskkill /PID <PID> /F
```

### 10.2 无法访问网站

**问题现象**：浏览器无法访问网站。

**排查步骤**：

```powershell
# 1. 检查Node.js应用是否运行
pm2 status

# 2. 检查端口是否监听
netstat -ano | findstr :3000
netstat -ano | findstr :80

# 3. 检查防火墙
Get-NetFirewallRule | Where-Object {$_.Enabled -eq 'True' -and $_.Direction -eq 'Inbound'} | Select-Object DisplayName, LocalPort

# 4. 检查Nginx是否运行
tasklist | findstr nginx

# 5. 测试本地访问
curl http://localhost:3000
curl http://localhost:80
```

### 10.3 静态资源404

**问题现象**：页面加载但CSS/JS文件显示404。

**解决方案**：

1. 检查Nginx配置中的root路径是否正确
2. 确认 `dist/public` 目录存在且包含文件
3. 检查文件权限

```powershell
# 查看dist目录内容
dir C:\doudian-finance\dist\public
```

### 10.4 数据库连接错误

**问题现象**：应用日志显示数据库连接失败。

**排查步骤**：

```powershell
# 1. 检查MySQL服务是否运行
Get-Service -Name MySQL*

# 2. 测试数据库连接
mysql -u doudian_user -p -h localhost doudian_finance

# 3. 检查.env文件中的DATABASE_URL格式
# 正确格式: mysql://用户名:密码@主机:端口/数据库名
```

### 10.5 PM2进程无法自动恢复

**问题现象**：服务器重启后PM2进程没有自动启动。

**解决方案**：

```powershell
# 重新安装pm2-windows-startup
npm install -g pm2-windows-startup
pm2-startup install

# 保存当前进程列表
pm2 save

# 验证服务是否安装
Get-Service -Name pm2*
```

---

## 附录

### A. 快速部署命令汇总

```powershell
# ===== 1. 安装全局依赖 =====
npm install -g pnpm@10.4.1
npm install -g pm2
npm install -g pm2-windows-startup

# ===== 2. 创建项目目录 =====
mkdir C:\doudian-finance
cd C:\doudian-finance

# ===== 3. 上传项目文件后，安装依赖 =====
pnpm install

# ===== 4. 创建.env文件（手动编辑） =====
notepad .env

# ===== 5. 构建项目 =====
pnpm build

# ===== 6. 数据库迁移 =====
pnpm db:push

# ===== 7. 创建日志目录 =====
mkdir C:\doudian-finance\logs

# ===== 8. 创建PM2配置文件（手动编辑） =====
notepad ecosystem.config.cjs

# ===== 9. 启动应用 =====
pm2 start ecosystem.config.cjs
pm2 save

# ===== 10. 安装PM2 Windows服务 =====
pm2-startup install
```

### B. 项目脚本命令说明

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发模式启动（热重载） |
| `pnpm build` | 构建生产环境代码 |
| `pnpm start` | 生产模式启动 |
| `pnpm check` | TypeScript类型检查 |
| `pnpm test` | 运行测试 |
| `pnpm db:push` | 数据库迁移 |

### C. 环境变量说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| NODE_ENV | 是 | 运行环境（production） |
| PORT | 是 | 应用端口（默认3000） |
| DATABASE_URL | 是 | MySQL连接字符串 |
| JWT_SECRET | 是 | JWT签名密钥 |
| VITE_APP_TITLE | 否 | 应用标题 |
| VITE_APP_LOGO | 否 | 应用Logo路径 |

### D. 有用的工具下载链接

| 工具 | 下载地址 |
|------|----------|
| Node.js 18.x LTS | https://nodejs.org/en/download/ |
| MySQL 8.0 | https://dev.mysql.com/downloads/installer/ |
| Nginx for Windows | https://nginx.org/en/download.html |
| Git for Windows | https://git-scm.com/download/win |
| NSSM | https://nssm.cc/download |
| IIS ARR | https://www.iis.net/downloads/microsoft/application-request-routing |
| URL Rewrite | https://www.iis.net/downloads/microsoft/url-rewrite |

---

> **文档声明**：本文档由Manus AI根据doudian-finance项目实际配置生成，详细说明了在Windows Server 2019上的完整部署流程。如有疑问，请参考项目源码或联系技术支持。
