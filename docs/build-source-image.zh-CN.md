# 从当前源码构建 SigNoz 前后端镜像

## 构建内容

本仓库基于 SigNoz `v0.150.0`，包含简体中文和英文界面。`build-source-image.sh` 使用本地工作目录中的源码，构建一个同时包含前端静态文件和 Go 后端的镜像；后续修改这些源码后，重新执行脚本即可一起发布。

构建过程不会基于 `signoz/signoz` 镜像，也不会下载或替换该应用的官方镜像。Node、Go 和 Alpine 基础镜像以及前后端依赖需要从镜像仓库和依赖仓库获取。构建采用以下布局：

| 项目 | 设置 |
| --- | --- |
| 前端 | Node 22、pnpm 10，执行仓库的 `pnpm build`，包括翻译检查 |
| 后端 | Go 1.25.7，编译当前源码的 `cmd/enterprise`，包含 `cmd/`、`ee/` 和 `pkg/` 下的修改 |
| 运行环境 | Alpine 3.20.3，与仓库对应发布配置的系统版本一致 |
| 应用文件 | `/root/signoz`、`/root/templates`、`/etc/signoz/web` |
| 启动命令 | `./signoz server` |
| 默认镜像 | `signoz-zh:v0.150.0` |

上述路径和启动命令与本仓库官方发布 Dockerfile 一致，现有部署注入的环境变量、配置文件、网络和数据卷由原部署配置提供。镜像不会主动改写它们。镜像是自行编译的定制产物，不保证字节、镜像摘要、Go 构建参数或每项行为均与官方产物相同；实际兼容性需要在目标环境验证。

构建使用 `CGO_ENABLED=0` 生成适用于 Alpine 的 Linux 可执行文件，并沿用官方发布配置中的版本、授权服务地址等链接参数。镜像使用的 `cmd/enterprise` 与官方发行配置一致，但该目录和 `ee/` 的源码适用仓库中的 `ee/LICENSE`：该许可证允许为开发和测试复制、修改，同时规定生产使用须符合 SigNoz 企业订阅条款并持有有效企业许可证。官方提供的免费社区版镜像与自行编译这些企业目录的许可问题不能简单等同；自行编译的这个镜像在投入生产或分发前，应依据许可证向 SigNoz 核实授权。编译本身不会获得商业功能授权。

## 1. 在 Windows 打包当前源码

在 PowerShell 中执行，源路径按实际项目位置调整：

```powershell
Set-Location 'D:\Workspace\Projects\ZhongTangProjects\qianliyan-industry\nvbp-logs\signoz-1\signoz'

tar.exe -czf ..\signoz-v0.150.0-zh-source.tar.gz `
  --exclude='.git' `
  --exclude='node_modules' `
  --exclude='frontend/build' `
  --exclude='frontend/coverage' `
  --exclude='frontend/storybook-static' `
  --exclude='.env' `
  --exclude='.env.*' `
  --exclude='.cache' `
  Dockerfile.source Dockerfile.source.dockerignore build-source-image.sh `
  LICENSE go.mod go.sum cmd ee pkg templates frontend docs/build-source-image.zh-CN.md

if ($LASTEXITCODE -ne 0) { throw '源码打包失败，请检查上面的 tar 输出。' }
Get-Item ..\signoz-v0.150.0-zh-source.tar.gz
```

这个命令打包磁盘上现有文件，而不是 `git archive` 或远端仓库，因此会包含当前工作目录中尚未提交和尚未被 Git 跟踪的汉化文件。它不会包含 `node_modules`、前端旧构建产物、`.git` 或 `.env*` 开发环境文件。镜像构建上下文也通过 `Dockerfile.source.dockerignore` 排除这些环境文件，因此你本机的 `frontend/.env.local` 中的测试后端地址不会被打进生产前端。

以后更新源码后，重新执行本节打包命令，再上传新压缩包。若今后后端新增了 `cmd/`、`ee/`、`pkg/` 以外的源码目录，需要同时把该目录加入上述打包命令和 `Dockerfile.source` 的后端 `COPY` 指令。

## 2. 传到服务器并构建

把生成的 `signoz-v0.150.0-zh-source.tar.gz` 上传到服务器，例如 `/root/`。如果 `192.168.31.117` 同时是服务器的 SSH 地址，可以在刚才的 PowerShell 窗口执行；SSH 地址、用户或端口不同时请自行调整：

```powershell
scp.exe ..\signoz-v0.150.0-zh-source.tar.gz root@192.168.31.117:/root/
```

然后在服务器执行：

```bash
BUILD_DIR="/root/signoz-source-$(date +%Y%m%d-%H%M%S)"
mkdir "$BUILD_DIR" && \
  tar -xzf /root/signoz-v0.150.0-zh-source.tar.gz -C "$BUILD_DIR" && \
  cd "$BUILD_DIR" && \
  bash build-source-image.sh && \
  docker image inspect signoz-zh:v0.150.0 \
    --format 'ID={{.Id}}  platform={{.Os}}/{{.Architecture}}  entrypoint={{json .Config.Entrypoint}}'
```

每次解压到新的目录，避免旧源码残留。脚本使用 Linux 服务器自身的 Docker 架构构建，支持 `amd64` 和 `arm64`。需要 Docker Engine、可用的 BuildKit，以及能够访问 Docker Hub、npm 和 Go 模块代理的网络。服务器无需单独安装 Node、pnpm 或 Go；这些工具只存在于构建阶段。前端打包和 Go 编译可能占用较多内存、磁盘和时间，内存不足时请增加可用内存后重试。

构建脚本不需要可执行权限；以上使用 `bash build-source-image.sh` 运行，避免 Windows 打包时权限变化。构建成功后本地将出现 `signoz-zh:v0.150.0`，不会自动推送、启动、停止或替换任何容器。

### Docker 基础镜像拉取失败时

如果 Docker Hub 的现有镜像加速器返回 401 等错误，可以在已解压的源码目录使用：

```bash
bash build-source-image.sh --mirror
```

该选项只为本次构建将 Node、Go、Alpine 和 Dockerfile 构建前端镜像改为从 `m.daocloud.io/docker.io` 获取，不修改 Docker 全局镜像配置，也不重启 Docker。脚本从 `Dockerfile.source` 读取 Node、Go 和 Alpine 的标签，所以它们仍对应源码指定的版本。镜像源本身可能不可用或限制访问，服务器需要能够访问它；需要指定其他 Docker Hub 代理时，可以使用：

```bash
bash build-source-image.sh --mirror=your-registry.example.com/dockerhub
```

或者通过 `SIGNOZ_DOCKERHUB_MIRROR=your-registry.example.com/dockerhub` 环境变量指定前缀。不要在前缀中填写 `https://` 或账号密码；自建仓库需要鉴权时，使用 Docker 的仓库登录方式。代理需提供 `<前缀>/library/` 下的官方镜像和 `<前缀>/docker/dockerfile` 构建前端镜像。

镜像模式依赖 Docker 的 `--build-context` 功能；若提示不支持该选项，请检查 Docker/Buildx 版本。基础镜像源与 `npm`、Go 模块代理、Alpine 软件仓库是不同的服务，后续依赖下载仍需服务器能够访问对应仓库。普通模式仍可执行 `bash build-source-image.sh`，使用服务器原有 Docker 镜像配置。

如需自定义镜像名称：

```bash
SIGNOZ_IMAGE=registry.example.com/observability/signoz-zh:v0.150.0 \
  bash build-source-image.sh
```

`SIGNOZ_VERSION` 可调整构建版本元信息，默认 `v0.150.0`。只修改该变量不会升级源码或其他组件，升级源码后应根据实际基线同步更新它。源码目录带有 `.git` 时，脚本记录当前提交、分支和是否存在未提交改动；上述压缩包不含 `.git`，因此构建信息中的提交和分支显示 `unknown`。需要可追溯时，请在打包前自行记录 `git rev-parse HEAD` 和当前改动。

## 3. 与现有测试环境配合

之前核验的测试环境后端为 `v0.148.0`，本源码基于 `v0.150.0`。替换镜像同时意味着后端版本升级，而不是只替换页面。环境原来的 `signoz/signoz:latest` 与 `signoz/signoz-otel-collector:latest` 都是可变标签，先查看并记录当前实际镜像 ID：

```bash
docker inspect signoz-signoz-0 --format 'image={{.Config.Image}} id={{.Image}}'
docker inspect signoz-ingester-1 --format 'image={{.Config.Image}} id={{.Image}}'
```

保留当前安装配置和数据备份；根据当前版本与 [SigNoz 升级文档](https://signoz.io/docs/operate/migration/upgrade-standard/)核对数据迁移及组件版本，在测试环境验证登录、日志接入、查询、告警和数据是否正常。构建脚本不会调整 Collector、ClickHouse、PostgreSQL 或 Keeper，也无法仅凭 `latest` 标签证明它们与 `v0.150.0` 的兼容性。

[官方告警迁移指南](https://signoz.io/docs/operate/migration/upgrade-0-150/)说明了旧告警规则自动迁移到 `v2alpha1` 以及 v1 规则 API 的移除。

[v0.150.0 发布说明](https://github.com/SigNoz/signoz/releases/tag/v0.150.0)特别提醒日志正文向原生 JSON 存储迁移期间会出现双写，可能增加 Collector 的 CPU、内存以及 ClickHouse 的 CPU 和磁盘使用。升级前应结合[官方迁移说明](https://signoz.io/guides/json-logs-migration/)核对该功能的启用条件、组件要求和容量，不应假定只更换应用镜像就能完成全部迁移。

部署时应在现有部署配置中将 SigNoz 应用的镜像引用改为构建出的本地标签，同时保留现有环境变量、端口、网络、数据卷和依赖配置。若使用 Foundry，应修改原始 `casting.yaml`，避免只改生成的 Compose 文件后被重新生成覆盖。当前 [Foundry 配置参考](https://github.com/SigNoz/foundry/blob/main/docs/reference/casting-file.md)中的字段示例为：

```yaml
# 合并到已有的 spec 中，不要用这个片段覆盖整个 casting.yaml。
spec:
  signoz:
    spec:
      image: signoz-zh:v0.150.0
```

具体字段及本地镜像拉取行为以服务器上 Foundry 和 Compose 的版本、生成配置为准。切换和升级前应先审阅渲染结果及升级步骤。构建脚本本身不执行部署。

若前端使用反向代理或子路径，沿用原后端和代理配置，并按原路径访问；前端请求默认使用当前访问地址的同源后端，不会固定连接 `192.168.31.117:8080`。
