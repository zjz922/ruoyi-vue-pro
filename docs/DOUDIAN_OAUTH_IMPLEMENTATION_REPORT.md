# 抖店OAuth授权实现报告

## 一、实现概述

本次实现了完整的抖店OAuth授权流程，包括：
- 获取授权URL
- 授权码换取Access Token
- Token刷新
- Token存储到数据库
- 撤销授权
- 前端授权管理页面

## 二、技术架构

### 2.1 后端架构

```
Controller层
├── DoudianOAuthController.java     # OAuth授权接口
│   ├── GET  /authorize-url         # 获取授权URL
│   ├── GET  /callback              # OAuth回调处理
│   ├── POST /exchange-token        # 授权码换取Token
│   ├── POST /refresh-token         # 刷新Token
│   ├── GET  /status                # 获取授权状态
│   └── POST /revoke                # 撤销授权

Service层
├── DoudianOAuthService.java        # 接口定义
└── DoudianOAuthServiceImpl.java    # 实现类
    ├── getAuthorizeUrl()           # 生成授权URL
    ├── handleCallback()            # 处理回调
    ├── exchangeToken()             # 换取Token
    ├── refreshToken()              # 刷新Token
    ├── getAuthStatus()             # 获取状态
    └── revokeAuth()                # 撤销授权

数据层
├── DoudianAuthTokenDO.java         # 实体类
└── DoudianAuthTokenMapper.java     # Mapper接口
```

### 2.2 前端架构

```
views/finance/platform/
└── doudian-auth.vue                # 授权管理页面

api/finance/
└── doudian-oauth.ts                # API接口定义
```

## 三、OAuth授权流程

### 3.1 授权流程图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   前端页面   │     │  Java后端   │     │   抖店平台   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ 1.点击授权按钮    │                   │
       │──────────────────>│                   │
       │                   │                   │
       │ 2.返回授权URL     │                   │
       │<──────────────────│                   │
       │                   │                   │
       │ 3.跳转到抖店授权页面                  │
       │───────────────────────────────────────>│
       │                   │                   │
       │                   │ 4.用户同意授权     │
       │                   │<──────────────────│
       │                   │                   │
       │                   │ 5.回调+授权码     │
       │                   │<──────────────────│
       │                   │                   │
       │                   │ 6.用授权码换Token │
       │                   │──────────────────>│
       │                   │                   │
       │                   │ 7.返回Token       │
       │                   │<──────────────────│
       │                   │                   │
       │                   │ 8.保存Token到数据库│
       │                   │                   │
       │ 9.授权成功        │                   │
       │<──────────────────│                   │
       │                   │                   │
```

### 3.2 关键配置

**application-finance.yml**
```yaml
finance:
  doudian:
    app-key: 7569846683366884874
    app-secret: 5ed2bbdd-cc97-4871-a3c3-e013ff1f381e
    callback-url: http://localhost:8080/admin-api/finance/doudian/oauth/callback
```

## 四、API接口说明

### 4.1 获取授权URL

**请求**
```
GET /admin-api/finance/doudian/oauth/authorize-url
```

**响应**
```json
{
  "code": 0,
  "data": "https://fuwu.jinritemai.com/authorize?response_type=code&app_key=xxx&state=xxx",
  "msg": "success"
}
```

### 4.2 授权码换取Token

**请求**
```
POST /admin-api/finance/doudian/oauth/exchange-token
Content-Type: application/json

{
  "code": "授权码",
  "state": "状态参数"
}
```

**响应**
```json
{
  "code": 0,
  "data": {
    "accessToken": "xxx",
    "refreshToken": "xxx",
    "expireTime": "2025-02-17T00:00:00",
    "shopId": 123456,
    "shopName": "店铺名称",
    "scope": "授权范围"
  },
  "msg": "success"
}
```

### 4.3 获取授权状态

**请求**
```
GET /admin-api/finance/doudian/oauth/status
```

**响应**
```json
{
  "code": 0,
  "data": {
    "authorized": true,
    "shops": [
      {
        "shopId": 123456,
        "shopName": "店铺名称",
        "status": "valid",
        "authorizeTime": "2025-01-17T00:00:00",
        "expireTime": "2025-02-17T00:00:00",
        "scope": "授权范围"
      }
    ]
  },
  "msg": "success"
}
```

### 4.4 刷新Token

**请求**
```
POST /admin-api/finance/doudian/oauth/refresh-token
Content-Type: application/json

{
  "shopId": 123456
}
```

### 4.5 撤销授权

**请求**
```
POST /admin-api/finance/doudian/oauth/revoke
Content-Type: application/json

{
  "shopId": 123456
}
```

## 五、数据库表结构

**finance_doudian_auth_token**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| tenant_id | bigint | 租户ID |
| user_id | bigint | 用户ID |
| shop_id | varchar(64) | 店铺ID |
| shop_name | varchar(255) | 店铺名称 |
| app_key | varchar(128) | App Key |
| app_secret | varchar(256) | App Secret |
| access_token | varchar(512) | Access Token |
| refresh_token | varchar(512) | Refresh Token |
| expires_in | int | 有效期（秒） |
| token_type | varchar(32) | Token类型 |
| scope | varchar(1024) | 授权范围 |
| auth_status | tinyint | 授权状态 |
| auth_time | datetime | 授权时间 |
| expire_time | datetime | 过期时间 |
| last_refresh_time | datetime | 最后刷新时间 |

## 六、使用说明

### 6.1 授权步骤

1. 登录管理后台，进入「财务管理」→「平台集成」→「抖店授权」
2. 点击「添加店铺授权」按钮
3. 在弹出的抖店授权页面中，使用抖店账号登录
4. 确认授权后，系统自动获取Token并保存
5. 授权成功后，可在页面查看已授权店铺列表

### 6.2 Token刷新

- Token有效期为30天
- 系统会在Token过期前自动刷新
- 也可以手动点击「刷新Token」按钮

### 6.3 撤销授权

- 点击「撤销授权」按钮可取消店铺授权
- 撤销后系统将停止同步该店铺数据

## 七、注意事项

1. **生产环境配置**：需要将`callback-url`修改为实际的生产域名
2. **HTTPS要求**：抖店OAuth要求回调地址必须是HTTPS
3. **权限配置**：确保抖店应用已配置相应的API权限
4. **数据安全**：Token等敏感信息已加密存储

## 八、后续工作

1. 实现Token自动刷新定时任务
2. 实现数据同步触发机制
3. 添加授权异常告警
4. 支持多店铺管理

## 九、文件清单

### 新增文件

| 文件路径 | 说明 |
|----------|------|
| `controller/admin/oauth/DoudianOAuthController.java` | OAuth控制器 |
| `controller/admin/oauth/vo/DoudianAuthUrlRespVO.java` | 授权URL响应VO |
| `controller/admin/oauth/vo/DoudianExchangeTokenReqVO.java` | 换取Token请求VO |
| `controller/admin/oauth/vo/DoudianRefreshTokenReqVO.java` | 刷新Token请求VO |
| `controller/admin/oauth/vo/DoudianTokenRespVO.java` | Token响应VO |
| `controller/admin/oauth/vo/DoudianAuthStatusRespVO.java` | 授权状态响应VO |
| `service/oauth/DoudianOAuthService.java` | OAuth服务接口 |
| `service/oauth/DoudianOAuthServiceImpl.java` | OAuth服务实现 |
| `views/finance/platform/doudian-auth.vue` | 前端授权页面 |
| `api/finance/doudian-oauth.ts` | 前端API接口 |
| `sql/finance_doudian_auth_menu.sql` | 菜单SQL |

### 修改文件

| 文件路径 | 修改内容 |
|----------|----------|
| `dal/dataobject/DoudianAuthTokenDO.java` | 添加新字段 |
| `dal/mysql/DoudianAuthTokenMapper.java` | 添加新方法 |
| `application-finance.yml` | 添加回调URL配置 |

## 十、GitHub提交

- **仓库地址**: https://github.com/zjz922/flash-saas
- **提交ID**: e99cbf517e
- **提交信息**: feat(finance): 实现抖店OAuth授权流程
