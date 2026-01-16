# doudian-finance-prototype 完整部署教程（图文版）

> **文档版本**：v2.0  
> **更新日期**：2026年1月11日  
> **作者**：Manus AI  
> **项目名称**：闪电帐PRO - 抖店财务应用产品原型

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [环境要求](#3-环境要求)
4. [服务器准备](#4-服务器准备)
5. [安装宝塔面板](#5-安装宝塔面板)
6. [安装Node.js环境](#6-安装nodejs环境)
7. [安装MySQL数据库](#7-安装mysql数据库)
8. [项目部署](#8-项目部署)
9. [Nginx配置](#9-nginx配置)
10. [PM2进程管理](#10-pm2进程管理)
11. [SSL证书配置](#11-ssl证书配置)
12. [常见问题排查](#12-常见问题排查)

---

## 1. 项目概述

### 1.1 项目简介

**doudian-finance-prototype**（闪电帐PRO）是一款面向抖店商家的B端财务管理SaaS应用产品原型。项目采用现代化的前后端分离架构，提供完整的财务核算、资金管理、库存成本、经营分析等7大核心功能模块。

### 1.2 核心功能模块

| 模块名称 | 功能描述 | 对应页面 |
|----------|----------|----------|
| 经营概览 | KPI卡片、经营趋势图、费用构成 | Overview.tsx |
| 财务核算 | 双轨制核算对比、三大报表 | Accounting.tsx |
| 资金管理 | 资金流水、智能对账 | Funds.tsx |
| 库存成本 | 库龄分析、成本计价对比 | Inventory.tsx |
| 经营分析 | ROI分析、渠道排行、盈亏平衡 | Analysis.tsx |
| 费用中心 | 费用构成、预算执行 | Expense.tsx |
| 税务管理 | 综合税负率、税种构成、风险预警 | Tax.tsx |

### 1.3 项目目录结构

![项目目录结构](./images/project-directory-structure.png)

**核心目录说明**：

```
doudian-finance-prototype/
├── client/                     # 前端源码目录
│   ├── src/
│   │   ├── pages/             # 页面组件（7个功能模块）
│   │   ├── components/        # 可复用UI组件
│   │   ├── App.tsx            # 路由配置
│   │   ├── main.tsx           # 应用入口
│   │   └── index.css          # 全局样式
│   └── public/                # 静态资源
├── server/                     # 后端源码目录
│   ├── _core/                 # 核心框架代码
│   │   ├── index.ts           # 服务器入口
│   │   ├── context.ts         # tRPC上下文
│   │   ├── oauth.ts           # OAuth认证
│   │   └── vite.ts            # Vite集成
│   ├── routers.ts             # API路由定义
│   ├── db.ts                  # 数据库操作
│   └── storage.ts             # 文件存储
├── drizzle/                    # 数据库Schema
│   ├── schema.ts              # 表结构定义
│   └── relations.ts           # 表关系定义
├── shared/                     # 前后端共享代码
├── dist/                       # 构建输出目录
│   ├── public/                # 前端构建产物
│   └── index.js               # 服务端入口
├── package.json               # 依赖配置
├── vite.config.ts             # Vite配置
├── drizzle.config.ts          # Drizzle配置
└── .env                       # 环境变量（需创建）
```

---

## 2. 技术架构

### 2.1 系统架构图

![系统架构图](./images/project-architecture.png)

### 2.2 技术栈详情

**前端技术栈**：

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.1 | UI框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Vite | 7.1.7 | 构建工具 |
| Tailwind CSS | 4.1.14 | 样式框架 |
| Recharts | 2.15.2 | 数据可视化 |
| wouter | 3.3.5 | 路由管理 |
| shadcn/ui | - | UI组件库 |

**后端技术栈**：

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 18.x LTS | 运行环境 |
| Express | 4.21.2 | Web框架 |
| tRPC | 11.6.0 | API层 |
| Drizzle ORM | 0.44.5 | 数据库ORM |
| MySQL | 5.7/8.0 | 数据库 |

**部署环境**：

| 组件 | 说明 |
|------|------|
| 宝塔面板 | 服务器管理 |
| Nginx | 反向代理、静态文件服务 |
| PM2 | Node.js进程管理 |
| Let's Encrypt | SSL证书 |

---

## 3. 环境要求

### 3.1 服务器配置要求

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| 操作系统 | CentOS 7.x / Ubuntu 18.04+ | CentOS 7.9 / Ubuntu 22.04 |
| CPU | 1核 | 2核及以上 |
| 内存 | 2GB | 4GB及以上 |
| 硬盘 | 40GB SSD | 80GB SSD |
| 带宽 | 3Mbps | 5Mbps及以上 |

### 3.2 软件版本要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | **18.x LTS** | 必须使用18.x版本 |
| pnpm | 10.4.1+ | 包管理器（项目指定） |
| MySQL | 5.7 或 8.0 | 数据库 |
| Nginx | 1.20+ | Web服务器 |
| PM2 | 5.0+ | 进程管理 |

> **重要提示**：本项目使用 **pnpm** 作为包管理器，请勿使用 npm 或 yarn，否则可能导致依赖安装失败。

---

## 4. 服务器准备

### 4.1 部署流程概览

![部署流程图](./images/project-deploy-steps.png)

### 4.2 购买云服务器

推荐使用阿里云、腾讯云或华为云的云服务器ECS。购买时选择以下配置：

1. 地域选择：根据目标用户群体选择就近的数据中心
2. 操作系统：CentOS 7.9 或 Ubuntu 22.04 LTS
3. 安全组配置：开放以下端口

| 端口 | 协议 | 用途 |
|------|------|------|
| 22 | TCP | SSH远程连接 |
| 80 | TCP | HTTP访问 |
| 443 | TCP | HTTPS访问 |
| 8888 | TCP | 宝塔面板 |
| 3000 | TCP | Node.js应用（内网） |
| 3306 | TCP | MySQL（内网） |

### 4.3 连接服务器

使用SSH客户端连接服务器：

```bash
# Windows用户可使用 PuTTY、Xshell 或 Windows Terminal
# Mac/Linux用户使用终端

ssh root@您的服务器IP
```

---

## 5. 安装宝塔面板

### 5.1 一键安装脚本

根据您的操作系统选择对应的安装命令：

**CentOS系统**：

```bash
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec
```

**Ubuntu/Debian系统**：

```bash
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
```

安装过程约需3-5分钟，完成后会显示面板访问地址、用户名和密码。

### 5.2 登录宝塔面板

安装完成后，通过浏览器访问宝塔面板：

```
http://您的服务器IP:8888/安全入口
```

![宝塔面板登录界面](./images/bt-login-interface.png)

**首次登录注意事项**：

1. 使用安装时显示的用户名和密码登录
2. 登录后建议立即修改默认密码
3. 绑定宝塔账号以使用完整功能
4. 根据提示安装推荐的LNMP环境

### 5.3 宝塔面板首页

登录成功后，您将看到服务器状态监控面板：

![宝塔面板首页](./images/bt-dashboard.png)

---

## 6. 安装Node.js环境

### 6.1 通过宝塔软件商店安装

在宝塔面板中安装Node.js环境：

![宝塔软件商店](./images/bt-software-store.png)

**安装步骤**：

1. 点击左侧菜单「软件商店」
2. 搜索「PM2管理器」
3. 点击「安装」按钮
4. 等待安装完成

### 6.2 安装指定版本Node.js

PM2管理器安装完成后，需要安装Node.js 18.x版本：

1. 在软件商店找到已安装的「PM2管理器」
2. 点击「设置」进入管理界面
3. 在「Node版本」选项卡中选择 **Node.js 18.x LTS**
4. 点击「安装」等待完成

![PM2管理器界面](./images/bt-pm2-manager.png)

### 6.3 验证Node.js安装

通过SSH终端验证安装：

```bash
# 查看Node.js版本
node -v
# 应显示: v18.x.x

# 查看npm版本
npm -v

# 安装pnpm（项目必需）
npm install -g pnpm@10.4.1

# 验证pnpm安装
pnpm -v
# 应显示: 10.4.1
```

> **关键步骤**：必须全局安装 pnpm，因为本项目使用 pnpm 作为包管理器。

---

## 7. 安装MySQL数据库

### 7.1 通过宝塔安装MySQL

在软件商店中安装MySQL数据库：

1. 搜索「MySQL」
2. 选择 **MySQL 5.7** 或 **MySQL 8.0** 版本
3. 点击「安装」选择「极速安装」
4. 等待安装完成（约5-10分钟）

![MySQL数据库添加](./images/bt-mysql-add.png)

### 7.2 创建项目数据库

安装完成后，创建项目专用数据库：

1. 点击左侧菜单「数据库」
2. 点击「添加数据库」
3. 填写数据库信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 数据库名 | doudian_finance | 项目数据库名 |
| 用户名 | doudian_user | 数据库用户 |
| 密码 | 自动生成或自定义 | 记录此密码 |
| 访问权限 | 本地服务器 | 安全考虑 |

4. 点击「提交」完成创建

### 7.3 获取数据库连接信息

记录以下信息，后续配置环境变量时需要使用：

```
数据库主机: localhost
数据库端口: 3306
数据库名称: doudian_finance
数据库用户: doudian_user
数据库密码: [您设置的密码]
```

---

## 8. 项目部署

### 8.1 创建项目目录

通过SSH终端创建项目目录：

```bash
# 创建项目目录
mkdir -p /www/wwwroot/doudian-finance
cd /www/wwwroot/doudian-finance
```

### 8.2 上传项目文件

**方法一：通过宝塔文件管理器上传**

1. 点击左侧菜单「文件」
2. 导航到 `/www/wwwroot/doudian-finance`
3. 点击「上传」按钮
4. 选择项目压缩包上传
5. 右键解压文件

**方法二：通过Git克隆（推荐）**

```bash
cd /www/wwwroot/doudian-finance

# 如果项目在GitHub上
git clone https://github.com/your-username/doudian-finance-prototype.git .

# 或使用scp从本地上传
scp -r ./doudian-finance-prototype/* root@服务器IP:/www/wwwroot/doudian-finance/
```

### 8.3 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
cd /www/wwwroot/doudian-finance

# 创建环境变量文件
cat > .env << 'EOF'
# 应用环境
NODE_ENV=production
PORT=3000

# 数据库配置（MySQL连接字符串）
DATABASE_URL=mysql://doudian_user:您的密码@localhost:3306/doudian_finance

# JWT密钥（请生成随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OAuth配置（如需要）
OAUTH_SERVER_URL=https://your-oauth-server.com
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
VITE_APP_ID=your-app-id

# 应用信息
VITE_APP_TITLE=闪电帐PRO
VITE_APP_LOGO=/logo.png
EOF
```

> **安全提示**：请将 `JWT_SECRET` 替换为随机生成的安全密钥，可使用以下命令生成：
> ```bash
> openssl rand -base64 32
> ```

### 8.4 安装项目依赖

使用pnpm安装项目依赖：

```bash
cd /www/wwwroot/doudian-finance

# 安装依赖（使用pnpm）
pnpm install

# 如果遇到权限问题，使用
pnpm install --unsafe-perm
```

**依赖安装说明**：

本项目包含约80个依赖包，主要分为：

| 类别 | 主要依赖 | 数量 |
|------|----------|------|
| React生态 | react, react-dom, wouter | 5+ |
| UI组件 | @radix-ui/*, shadcn/ui | 25+ |
| 数据可视化 | recharts | 1 |
| 后端框架 | express, @trpc/* | 5+ |
| 数据库 | drizzle-orm, mysql2 | 3+ |
| 工具库 | axios, date-fns, zod | 10+ |

### 8.5 构建项目

执行构建命令生成生产环境代码：

```bash
cd /www/wwwroot/doudian-finance

# 构建项目
pnpm build
```

**构建过程说明**：

构建命令 `pnpm build` 实际执行以下操作：

```bash
# 1. Vite构建前端代码
vite build
# 输出到: dist/public/

# 2. esbuild打包服务端代码
esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
# 输出到: dist/index.js
```

构建完成后，`dist` 目录结构如下：

```
dist/
├── public/              # 前端构建产物
│   ├── index.html      # HTML入口
│   └── assets/         # JS/CSS/图片资源
└── index.js            # 服务端入口文件
```

### 8.6 初始化数据库

运行数据库迁移命令创建表结构：

```bash
cd /www/wwwroot/doudian-finance

# 生成并执行数据库迁移
pnpm db:push
```

此命令会根据 `drizzle/schema.ts` 中定义的表结构创建数据库表。

---

## 9. Nginx配置

### 9.1 创建网站

在宝塔面板中创建网站：

![添加站点界面](./images/bt-website-add.png)

**配置步骤**：

1. 点击左侧菜单「网站」
2. 点击「添加站点」
3. 填写网站信息：

| 配置项 | 值 |
|--------|-----|
| 域名 | finance.yourdomain.com |
| 根目录 | /www/wwwroot/doudian-finance/dist/public |
| FTP | 不创建 |
| 数据库 | 不创建（已手动创建） |
| PHP版本 | 纯静态 |

4. 点击「提交」

### 9.2 配置反向代理

为Node.js应用配置反向代理：

![Nginx反向代理配置](./images/bt-nginx-proxy.png)

**配置步骤**：

1. 在网站列表中点击站点名称
2. 选择「反向代理」选项卡
3. 点击「添加反向代理」
4. 填写代理配置：

| 配置项 | 值 |
|--------|-----|
| 代理名称 | doudian-api |
| 目标URL | http://127.0.0.1:3000 |
| 发送域名 | $host |

![反向代理详细配置](./images/bt-proxy-config.jpg)

### 9.3 完整Nginx配置

如需手动编辑，以下是完整的Nginx配置文件：

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name finance.yourdomain.com;
    
    # 网站根目录（前端静态文件）
    root /www/wwwroot/doudian-finance/dist/public;
    index index.html;
    
    # SSL证书配置（申请SSL后自动生成）
    ssl_certificate    /www/server/panel/vhost/cert/finance.yourdomain.com/fullchain.pem;
    ssl_certificate_key    /www/server/panel/vhost/cert/finance.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 强制HTTPS跳转
    if ($server_port !~ 443) {
        rewrite ^(/.*)$ https://$host$1 permanent;
    }
    
    # 静态资源缓存（前端构建产物）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # API反向代理（所有/api请求转发到Node.js）
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # SPA路由支持（React Router）
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
    
    # 禁止访问敏感文件
    location ~* \.(env|git|gitignore)$ {
        deny all;
    }
    
    # 访问日志
    access_log /www/wwwlogs/finance.yourdomain.com.log;
    error_log /www/wwwlogs/finance.yourdomain.com.error.log;
}
```

### 9.4 重载Nginx配置

配置完成后，重载Nginx使配置生效：

```bash
# 测试配置语法
nginx -t

# 重载配置
nginx -s reload

# 或通过宝塔面板重载
# 软件商店 -> Nginx -> 重载配置
```

---

## 10. PM2进程管理

### 10.1 创建PM2配置文件

在项目根目录创建 `ecosystem.config.cjs` 文件：

```bash
cd /www/wwwroot/doudian-finance

cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'doudian-finance',
    script: './dist/index.js',
    cwd: '/www/wwwroot/doudian-finance',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/www/wwwlogs/doudian-finance-error.log',
    out_file: '/www/wwwlogs/doudian-finance-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M',
    restart_delay: 3000,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
```

**配置参数说明**：

| 参数 | 值 | 说明 |
|------|-----|------|
| name | doudian-finance | 应用名称 |
| script | ./dist/index.js | 入口文件 |
| instances | max | 根据CPU核心数自动扩展 |
| exec_mode | cluster | 集群模式 |
| max_memory_restart | 500M | 内存超限自动重启 |
| autorestart | true | 崩溃自动重启 |

### 10.2 启动应用

使用PM2启动应用：

```bash
cd /www/wwwroot/doudian-finance

# 使用配置文件启动
pm2 start ecosystem.config.cjs

# 查看运行状态
pm2 status

# 查看应用日志
pm2 logs doudian-finance

# 查看详细信息
pm2 show doudian-finance
```

### 10.3 PM2常用命令

| 命令 | 说明 |
|------|------|
| `pm2 start ecosystem.config.cjs` | 启动应用 |
| `pm2 stop doudian-finance` | 停止应用 |
| `pm2 restart doudian-finance` | 重启应用 |
| `pm2 reload doudian-finance` | 零停机重载 |
| `pm2 delete doudian-finance` | 删除应用 |
| `pm2 logs doudian-finance` | 查看日志 |
| `pm2 monit` | 实时监控 |

### 10.4 设置开机自启

配置PM2开机自动启动：

```bash
# 保存当前进程列表
pm2 save

# 生成开机启动脚本
pm2 startup

# 按照提示执行生成的命令（通常是）
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

---

## 11. SSL证书配置

### 11.1 申请Let's Encrypt证书

在宝塔面板中申请免费SSL证书：

![SSL证书配置](./images/bt-ssl-cert.png)

**申请步骤**：

1. 在网站列表中点击站点名称
2. 选择「SSL」选项卡
3. 选择「Let's Encrypt」
4. 勾选需要申请证书的域名
5. 点击「申请」按钮

![Let's Encrypt证书申请](./images/bt-ssl-letsencrypt.jpg)

### 11.2 证书申请前提条件

| 条件 | 说明 |
|------|------|
| 域名解析 | 域名A记录必须指向服务器IP |
| 端口开放 | 80和443端口必须开放 |
| 防火墙 | 确保防火墙允许HTTP/HTTPS流量 |
| 域名验证 | 支持文件验证或DNS验证 |

### 11.3 开启强制HTTPS

证书申请成功后，开启强制HTTPS跳转：

1. 在SSL设置页面找到「强制HTTPS」开关
2. 点击开启
3. 所有HTTP请求将自动重定向到HTTPS

---

## 12. 常见问题排查

### 12.1 应用启动失败

**问题现象**：PM2显示应用状态为 `errored` 或 `stopped`。

**排查步骤**：

```bash
# 查看错误日志
pm2 logs doudian-finance --err --lines 100

# 常见错误及解决方案：

# 1. 端口被占用
lsof -i :3000
# 解决：杀死占用进程或修改PORT环境变量

# 2. 依赖缺失
cd /www/wwwroot/doudian-finance
pnpm install

# 3. 环境变量未配置
cat .env
# 解决：检查.env文件是否存在且配置正确

# 4. 数据库连接失败
# 检查DATABASE_URL格式是否正确
# 检查MySQL服务是否运行
systemctl status mysql
```

### 12.2 页面显示502错误

**问题现象**：访问网站显示 `502 Bad Gateway`。

**排查步骤**：

```bash
# 1. 检查Node.js应用是否运行
pm2 status

# 2. 检查应用端口是否监听
netstat -tlnp | grep 3000

# 3. 检查Nginx反向代理配置
cat /www/server/panel/vhost/nginx/finance.yourdomain.com.conf

# 4. 检查Nginx错误日志
tail -f /www/wwwlogs/finance.yourdomain.com.error.log

# 5. 手动测试本地访问
curl http://127.0.0.1:3000
```

### 12.3 静态资源404

**问题现象**：页面加载但CSS/JS文件显示404。

**解决方案**：

```bash
# 1. 检查dist目录是否存在
ls -la /www/wwwroot/doudian-finance/dist/public/

# 2. 检查Nginx root配置
# 确保root指向 dist/public 目录

# 3. 重新构建项目
cd /www/wwwroot/doudian-finance
pnpm build

# 4. 检查文件权限
chown -R www:www /www/wwwroot/doudian-finance/
chmod -R 755 /www/wwwroot/doudian-finance/
```

### 12.4 数据库连接错误

**问题现象**：应用日志显示 `ECONNREFUSED` 或 `Access denied`。

**排查步骤**：

```bash
# 1. 检查MySQL服务状态
systemctl status mysql

# 2. 测试数据库连接
mysql -u doudian_user -p -h localhost doudian_finance

# 3. 检查DATABASE_URL格式
# 正确格式: mysql://用户名:密码@主机:端口/数据库名
# 示例: mysql://doudian_user:password123@localhost:3306/doudian_finance

# 4. 检查数据库用户权限
mysql -u root -p
SHOW GRANTS FOR 'doudian_user'@'localhost';
```

### 12.5 SSL证书申请失败

**问题现象**：Let's Encrypt证书申请失败。

**常见原因及解决方案**：

| 原因 | 解决方案 |
|------|----------|
| 域名未解析 | 检查DNS解析，确保A记录指向服务器IP |
| 端口被封 | 检查云服务商安全组，开放80/443端口 |
| 防火墙拦截 | 临时关闭防火墙测试：`systemctl stop firewalld` |
| 申请频率限制 | 等待1小时后重试 |
| 域名验证失败 | 尝试使用DNS验证方式 |

---

## 附录

### A. 快速部署命令汇总

```bash
# ===== 1. 服务器初始化 =====
# 安装宝塔面板（CentOS）
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec

# ===== 2. 安装pnpm =====
npm install -g pnpm@10.4.1

# ===== 3. 创建项目目录 =====
mkdir -p /www/wwwroot/doudian-finance
cd /www/wwwroot/doudian-finance

# ===== 4. 上传/克隆项目 =====
# git clone 或 scp 上传项目文件

# ===== 5. 配置环境变量 =====
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://doudian_user:password@localhost:3306/doudian_finance
JWT_SECRET=your-secret-key
VITE_APP_TITLE=闪电帐PRO
EOF

# ===== 6. 安装依赖 =====
pnpm install

# ===== 7. 构建项目 =====
pnpm build

# ===== 8. 数据库迁移 =====
pnpm db:push

# ===== 9. 创建PM2配置 =====
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'doudian-finance',
    script: './dist/index.js',
    cwd: '/www/wwwroot/doudian-finance',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 3000 }
  }]
};
EOF

# ===== 10. 启动应用 =====
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
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
| `pnpm format` | 代码格式化 |

### C. 环境变量完整列表

| 变量名 | 必需 | 说明 |
|--------|------|------|
| NODE_ENV | 是 | 运行环境（production/development） |
| PORT | 是 | 应用端口（默认3000） |
| DATABASE_URL | 是 | MySQL连接字符串 |
| JWT_SECRET | 是 | JWT签名密钥 |
| OAUTH_SERVER_URL | 否 | OAuth服务器地址 |
| VITE_OAUTH_PORTAL_URL | 否 | OAuth登录页地址 |
| VITE_APP_ID | 否 | 应用ID |
| VITE_APP_TITLE | 否 | 应用标题 |
| VITE_APP_LOGO | 否 | 应用Logo路径 |

---

> **文档声明**：本文档由Manus AI根据doudian-finance-prototype项目实际配置生成，详细说明了项目的完整部署流程。如有疑问，请参考项目源码或联系技术支持。
