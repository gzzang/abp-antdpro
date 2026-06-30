# ABP + Ant Design Pro

前后端分离项目：ABP Framework 后端 + Ant Design Pro 前端，使用 OIDC 认证。

## 项目结构

```
├── my-pro-demo/          # Ant Design Pro 前端 (umi 4)
├── MyProject/            # ABP Framework 后端 (.NET 9)
├── docker/               # Docker 配置文件
├── Dockerfile.frontend   # 前端 Docker 构建
├── Dockerfile.backend    # 后端 Docker 构建
├── Dockerfile.dbmigrator # 数据库迁移 Docker 构建
├── docker-compose.yml    # Docker Compose 编排
├── STEPS.md              # 详细搭建步骤文档
└── .github/workflows/    # CI 配置
```

## 快速开始

### Docker 部署（推荐）

```bash
docker-compose up -d
```

访问：
- 前端：http://localhost:8000
- 后端 API：http://localhost:44358
- 默认账号：admin / 1q2w3E*

### 本地开发

**后端：**
```bash
cd MyProject
dotnet restore MyProject.slnx
dotnet run --project src/MyProject.HttpApi.Host
```

**前端：**
```bash
cd my-pro-demo
npm install
npm run dev
```

## 详细文档

参见 [STEPS.md](./STEPS.md)
