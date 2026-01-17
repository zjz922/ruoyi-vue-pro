# 项目重命名报告

## 重命名概述

| 原名称 | 新名称 |
|--------|--------|
| ruoyi-vue-pro | flash-saas |
| yudao-* | flash-* |
| cn.iocoder.yudao | cn.flashsaas |
| 芋道 | 闪电帐 |

## 重命名内容

### 1. 目录结构

| 原目录 | 新目录 |
|--------|--------|
| yudao-dependencies | flash-dependencies |
| yudao-framework | flash-framework |
| yudao-server | flash-server |
| yudao-module-* | flash-module-* |
| yudao-ui | flash-ui |
| yudao-ui-admin-vue3 | flash-ui-admin-vue3 |
| yudao-ui-tenant-react | flash-ui-tenant-react |

### 2. Framework子模块

| 原模块 | 新模块 |
|--------|--------|
| yudao-common | flash-common |
| yudao-spring-boot-starter-* | flash-spring-boot-starter-* |

### 3. Java包名

| 原包名 | 新包名 |
|--------|--------|
| cn.iocoder.yudao | cn.flashsaas |
| cn.iocoder.boot | cn.flashsaas |
| cn.iocoder.cloud | cn.flashsaas |

### 4. Maven配置

- **groupId**: cn.iocoder.boot → cn.flashsaas
- **artifactId**: yudao-* → flash-*
- **项目名**: ruoyi-vue-pro → flash-saas

### 5. 数据库

- **数据库名**: ruoyi-vue-pro → flash_saas
- **SQL脚本**: 已更新所有引用

### 6. 前端配置

- **package.json**: 项目名称已更新
- **Vue/TS文件**: 所有yudao引用已替换为flash
- **中文名称**: 芋道 → 闪电帐

## 项目结构

```
flash-saas/
├── flash-dependencies/          # 依赖管理
├── flash-framework/             # 框架模块
│   ├── flash-common/
│   ├── flash-spring-boot-starter-biz-tenant/
│   ├── flash-spring-boot-starter-mybatis/
│   ├── flash-spring-boot-starter-security/
│   └── ...
├── flash-server/                # 启动模块
├── flash-module-system/         # 系统模块
├── flash-module-infra/          # 基础设施模块
├── flash-module-finance/        # 财务模块（核心业务）
├── flash-module-member/         # 会员模块
├── flash-module-bpm/            # 工作流模块
├── flash-module-pay/            # 支付模块
├── flash-module-mall/           # 商城模块
├── flash-module-crm/            # CRM模块
├── flash-module-erp/            # ERP模块
├── flash-module-iot/            # IoT模块
├── flash-module-ai/             # AI模块
├── flash-module-mp/             # 微信公众号模块
├── flash-module-report/         # 报表模块
├── flash-ui/                    # 管理后台前端
│   └── flash-ui-admin-vue3/
├── flash-ui-tenant-react/       # 租户端前端
├── sql/                         # SQL脚本
└── docs/                        # 文档
```

## Windows 10 部署说明

### 1. 修改数据库配置

编辑 `flash-server/src/main/resources/application-local.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/flash_saas?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
```

### 2. 创建数据库

```sql
CREATE DATABASE flash_saas DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 导入SQL脚本

```bash
mysql -u root -p flash_saas < sql/mysql/flash_saas.sql
```

### 4. 启动后端

```bash
cd flash-saas
mvn clean install -DskipTests
cd flash-server
mvn spring-boot:run
```

### 5. 启动前端

```bash
cd flash-ui/flash-ui-admin-vue3
npm install
npm run dev
```

## 注意事项

1. **备份**: 原项目已备份到 `/home/ubuntu/ruoyi-vue-pro-scaffold-backup`
2. **数据库**: 需要重新创建名为 `flash_saas` 的数据库
3. **IDE**: 重新导入项目后，IDE会自动识别新的包结构
4. **缓存**: 建议清除Maven本地仓库缓存后重新编译

## 完成时间

2025-01-17
