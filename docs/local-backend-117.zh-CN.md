# 本地连接 117 测试环境

此配置供 Windows 本地开发使用：前端和 SigNoz 后端在本机运行，PostgreSQL 和 ClickHouse 使用 `192.168.31.117` 上的测试服务。

## GoLand 后端

在 GoLand 的运行配置中选择 **SigNoz Backend - Local 117**，使用项目的 Go 1.25.7 SDK，然后运行或调试。配置沿用原有 `SigNoz Backend` 的其他选项，并设置：

| 环境变量 | 值 |
| --- | --- |
| `SIGNOZ_SQLSTORE_PROVIDER` | `postgres` |
| `SIGNOZ_SQLSTORE_POSTGRES_DSN` | `postgres://signoz:<Compose 中的密码>@192.168.31.117:5432/signoz?sslmode=disable` |
| `SIGNOZ_TELEMETRYSTORE_PROVIDER` | `clickhouse` |
| `SIGNOZ_TELEMETRYSTORE_CLICKHOUSE_DSN` | `tcp://192.168.31.117:9000` |

配置文件位于 `.idea/runConfigurations/SigNoz_Backend_Local_117.xml`，已被 Git 忽略；其中包含数据库密码，请仅在本机保存。若 GoLand 没有立即显示新配置，可重新打开项目，或在运行配置里按上表检查。后端监听 `127.0.0.1:8080`，`SIGNOZ_WEB_ENABLED=false`，因此开发时还需单独运行前端。

GoLand 的项目 SDK 应指向 `D:\ProgramFiles\DevEnvironment\mise\data\installs\go\1.25.7`。本机当前的全局 `GOROOT` 仍指向旧的 Go 1.27.3；在普通终端直接运行其他版本的 `go.exe` 时可能发生编译器版本不匹配。GoLand 启动日志中的 `GOROOT` 应显示项目 SDK 的 1.25.7 路径。

如果原 Compose 中的密码、端口或 ClickHouse 认证设置有变化，请同步调整运行配置。本地连接使用宿主机地址，容器内的其他服务仍应使用 Compose 服务名。

## 本地前端

`frontend/.env.local` 已将 `VITE_FRONTEND_API_ENDPOINT` 指向 `http://127.0.0.1:8080`，原来的 117 地址保留为注释。当前电脑已安装前端依赖，可以在 `frontend` 目录直接运行项目的 Vite 开发服务器：

```powershell
node .\node_modules\vite\bin\vite.js
```

按照终端显示的地址访问，默认端口为 3301。修改 `.env.local` 后需重启前端开发服务器。若需要继续直接连接 117 后端，将两行 `VITE_FRONTEND_API_ENDPOINT` 的注释状态切换回来并重启前端。

项目要求 Node.js 22+ 和 pnpm 10.x；当前全局 pnpm 为 11，直接运行 `pnpm dev` 会报版本不兼容。安装并切换到 pnpm 10 后，也可以使用 `pnpm dev`。依赖未安装或需要更新时，同样应使用 pnpm 10 安装。

## 连接检查和数据影响

在本机 PowerShell 检查端口：

```powershell
Test-NetConnection 192.168.31.117 -Port 5432
Test-NetConnection 192.168.31.117 -Port 9000
```

如果连接不通，先检查服务器是否已应用局域网 Compose、Docker 端口映射、防火墙及数据库监听配置。端口可达仅表示 TCP 连接成功，不代表数据库认证和查询已验证。

2026-11-12 已使用上述本地配置分别通过 PostgreSQL 认证并读取当前数据库名、通过 ClickHouse 认证并执行 `SELECT 1`；检查未启动 SigNoz 后端。

本地后端与 117 上的后端使用同一套测试数据。启动时会执行 SQL 数据库迁移，运行期间的操作及后台任务也可能修改数据；调试前请确认版本兼容并做好备份，优先使用隔离的测试数据库。
