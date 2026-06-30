# ABP + Ant Design Pro 项目搭建步骤

## 项目概述

本项目是一个前后端分离的Web应用，前端使用 Ant Design Pro (umi 4)，后端使用 ABP Framework，数据库使用 PostgreSQL。通过 OpenIddict 实现 OIDC 认证授权。

---

## 第一步：创建前端项目

使用 Ant Design Pro 官方模板创建前端项目：

```bash
pro create my-pro-demo --template simple --umi 4 --skip-install --force --no-interactive
```

- 基于 umi 4 框架
- 使用 simple 模板
- 项目目录：`my-pro-demo/`

## 第二步：创建后端项目

使用 ABP CLI 创建后端项目：

```bash
abp new MyProject -t app -u no-ui --no-multi-tenancy --no-social-logins --sample-crud-page -dbms PostgreSQL --connection-string "Host=localhost;Port=5432;Database=abp_anrdpro_db;Username=gzzang;******;" -o MyProject
```

- 使用 app 模板，无 UI
- 禁用多租户
- 包含示例 CRUD 页面（Book）
- 使用 PostgreSQL 数据库
- 项目目录：`MyProject/`

## 第三步：配置 OIDC 认证

### 3.1 后端 OpenIddict 配置

修改 `MyProject/src/MyProject.Domain/OpenIddict/OpenIddictDataSeedContributor.cs`：

- 将前端 SPA 客户端的授权方式限制为 `AuthorizationCode` 和 `RefreshToken`
- 配置回调地址为 `http://localhost:8000/oidc-callback`
- 配置退出后跳转地址为 `http://localhost:8000`

### 3.2 后端 appsettings.json 配置

修改 `MyProject/src/MyProject.HttpApi.Host/appsettings.json`：

- 添加 CORS 配置：`"CorsOrigins": "http://localhost:8000"`
- 添加 OpenIddict 应用配置（ClientId: `MyProject_App`）
- 配置 PostgreSQL 连接字符串

### 3.3 前端 OIDC 集成

1. 安装 `oidc-client-ts`：

```bash
cd my-pro-demo
npm install oidc-client-ts
```

2. 创建认证工具 `src/utils/auth.ts`：
   - 配置 UserManager（authority、client_id、redirect_uri 等）
   - 提供 login、logout、getUser、getAccessToken 等方法

3. 创建 OIDC 回调页面 `src/pages/oidc-callback/index.tsx`：
   - 处理 OpenIddict 授权码回调
   - 完成后跳转到目标页面

4. 修改 `src/app.tsx`：
   - 移除原有 mock 用户登录逻辑
   - 使用 oidc-client-ts 获取用户信息
   - 未登录时自动跳转到 ABP 登录页面
   - 在请求拦截器中添加 ******

5. 在 `config/config.ts` 中添加 OIDC 配置的 define 常量

## 第四步：创建 Book 增删改查

### 4.1 后端 API（已由 ABP 模板生成）

后端 `BookAppService.cs` 提供以下接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/app/book` | 获取图书列表（分页） |
| GET | `/api/app/book/{id}` | 获取单本图书 |
| POST | `/api/app/book` | 创建图书 |
| PUT | `/api/app/book/{id}` | 更新图书 |
| DELETE | `/api/app/book/{id}` | 删除图书 |

BookDto 字段：
- `name` (string): 书名
- `authorId` (Guid): 作者ID
- `authorName` (string): 作者名
- `type` (BookType enum): 类型
- `publishDate` (DateTime): 出版日期
- `price` (float): 价格

### 4.2 前端 API 服务

创建 `src/services/book/api.ts`：
- 定义 BookType 枚举及中文标签
- 定义 BookDto、CreateUpdateBookDto 类型
- 实现 getBookList、getBook、createBook、updateBook、deleteBook 方法

### 4.3 前端图书管理页面

创建 `src/pages/books/index.tsx`：
- 使用 ProTable 展示图书列表（支持分页、排序）
- 使用 ModalForm 实现新建/编辑图书
- 支持删除确认
- 字段包括：书名、作者ID、类型（下拉选择）、出版日期、价格

## 第五步：删除 User 相关界面

1. 修改 `config/routes.ts`：
   - 移除 `/user/login`、`/user/register` 等路由
   - 添加 `/oidc-callback` 回调路由
   - 添加 `/books` 图书管理路由

2. 修改 `src/access.ts`：
   - 简化权限判断逻辑

3. 登录流程变更：
   - 需要登录时直接跳转到 ABP OpenIddict 登录页面
   - 登录后通过授权码回调回前端
   - 使用 access_token 访问后端 API

## 第六步：Docker 部署

### 6.1 Docker 文件

| 文件 | 说明 |
|------|------|
| `Dockerfile.frontend` | 前端构建（Node 22 + Nginx） |
| `Dockerfile.backend` | 后端构建（.NET 9） |
| `Dockerfile.dbmigrator` | 数据库迁移工具 |
| `docker/nginx.conf` | Nginx 配置（SPA + API 代理） |
| `docker-compose.yml` | 编排所有服务 |

### 6.2 服务组成

| 服务 | 端口 | 说明 |
|------|------|------|
| postgres | 5432 | PostgreSQL 16 数据库 |
| dbmigrator | - | 数据库迁移（运行后退出） |
| backend | 44358 | ABP 后端 API |
| frontend | 8000 | Ant Design Pro 前端 |

### 6.3 启动方式

```bash
docker-compose up -d
```

## 第七步：CI 配置

创建 `.github/workflows/ci.yml`：

### CI 流水线

1. **Frontend Job**：
   - 安装 Node.js 22
   - `npm ci` 安装依赖
   - `npm run lint` 代码检查
   - `npm run build` 构建
   - `npm run test` 测试

2. **Backend Job**：
   - 安装 .NET 9
   - `dotnet restore` 恢复依赖
   - `dotnet build` 构建
   - `dotnet test` 测试

3. **Docker Job**（依赖前两个 Job）：
   - 构建前端、后端、迁移工具的 Docker 镜像

---

## 技术栈总结

| 层 | 技术 |
|------|------|
| 前端框架 | Ant Design Pro (umi 4) |
| UI 组件 | Ant Design 6 + ProComponents |
| 认证 | oidc-client-ts |
| 后端框架 | ABP Framework 9.x |
| 认证服务 | OpenIddict |
| 数据库 | PostgreSQL 16 |
| 容器化 | Docker + Docker Compose |
| CI | GitHub Actions |
