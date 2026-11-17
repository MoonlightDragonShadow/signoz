# SigNoz 前端汉化变更与升级指南

本文和变更清单记录 `i18n/bilingual-v0.149.0` 的历史快照，官方基线为 `4cb022dd06f018c8b6956e49e51f9f3fe4bc7d07`。`i18n/bilingual-v0.150.0` 已通过合并官方 `v0.150.0` 升级，后续使用[当前汉化维护说明](../frontend/docs/bilingual-console.md)。

## 现有记录在哪里

- `frontend/docs/bilingual-console.md`：语言选择、翻译资源和升级验收说明。
- `docs/frontend-i18n-changes-v0.149.0.json`：生成时相对官方基线的前端文件清单，包括已提交、未提交、新增文件及文件内容 SHA-256。它是某一时刻的快照，不会自动更新，也不包含文件内容，不能代替 Git 提交或备份。
- `frontend/public/locales/zh-CN/`：中文词库；`console.json` 存放以英文展示文案为键的补充翻译，其他命名空间跟随对应的上游键。
- `frontend/src/ReactI18/index.tsx`、`frontend/src/components/LanguageSelector/`：语言初始化、语言选择与浏览器侧保存。
- `frontend/src/hooks/useConsoleTranslation.ts` 和 `frontend/src/components/ConsoleText/ConsoleText.tsx`：为原先写死的界面文案提供翻译；具体页面仍需逐文件合并。
- `frontend/scripts/check-translations.cjs`：检查英文命名空间对应的中文键和插值变量。

清单中，`change_vs_official` 表示相对官方基线的状态，`committed_vs_official` 表示已提交部分，`pending_vs_head` 表示相对当前提交的未提交部分；`M` 为修改、`A` 为新增、`untracked` 为未跟踪文件、`null` 表示该比较范围内没有差异。`worktree_sha256` 是生成清单时本地文件原始字节的哈希，换行符改变也会影响它。

目前官方标签之后已有四个本地提交，按时间顺序为：

1. `2860a0fc3`：增加语言选择和翻译基础设施。
2. `97d937909`：翻译登录、导航和日志浏览等界面。
3. `0dd1e90b5`：增加初始中文资源。
4. `fad5b1bd9`：修复 Vite 对后端 API 地址的使用，并添加维护文档。

后续大范围补译还在工作区。快照生成时，`frontend/` 有 863 个已跟踪文件的未提交变更，以及 32 个未跟踪文件；其中部分文件也在前面的提交里。若只迁移这四个提交，会丢失尚未提交的补译。清单包含所有前端差异，不保证其中每一项都属于汉化，提交前应审查。

## 先保存当前成果

下面的命令在项目根目录执行。先查看范围，包括未跟踪文件：

```powershell
git status --short --untracked-files=all -- frontend
git diff --stat -- frontend
git diff -- frontend
git ls-files --others --exclude-standard -- frontend
```

查看所有已跟踪前端文件相对官方 `v0.149.0` 的当前差异，可以运行 `git diff v0.149.0 -- frontend`；这个命令不包含未跟踪文件，需要结合上面的 `git ls-files` 查看。

逐项确认后，将需要保留的修改提交到当前分支。若确认 `frontend/` 中所有改动都应保留，可执行：

```powershell
git add -- frontend
git diff --cached --stat
git diff --cached --check
git diff --cached
```

确认暂存内容正确，且 `git diff --cached --check` 没有报错后，再提交：

```powershell
git commit -m "feat(frontend): complete bilingual localization"
```

如果混有不需要提交的变更，应使用 GoLand 的 Git 面板或 `git add -p` 分批暂存，并单独选择要加入的新增文件；不要直接提交整个目录。上面的两个升级说明文件在 `docs/`，如需随仓库保存，也应在检查后单独暂存并提交。`frontend/.env.local`、依赖目录和构建产物由 Git 忽略，清单和上述提交都不包含它们；本地环境配置应单独、安全地保存。

验证提交后，按你的仓库管理流程推送到自己的远程仓库或完成其他可靠备份。仅保存在当前电脑上的提交仍可能随磁盘损坏丢失。不要把含密码的本地配置一起提交。

## 将来升级到官方新版本

建议升级整个 SigNoz 版本，确保前后端、数据库迁移器及其他组件版本按新版本进行适配。不要将新版前端直接覆盖到旧版后端并假定接口一定兼容。

以下示例为 Windows PowerShell，在保存当前工作后执行。`origin` 是自己的仓库；`upstream` 指官方仓库。如果 `git remote -v` 已经有指向官方仓库的 `upstream`，不要重复添加。

```powershell
git remote -v
git remote add upstream https://github.com/SigNoz/signoz.git
```

确认远程地址正确后，填写实际存在的版本。每一步失败都会停止下面的步骤：

```powershell
$targetTag = 'vX.Y.Z'
if ($targetTag -eq 'vX.Y.Z') { throw '请先将 targetTag 改为实际存在的官方版本。' }
git fetch upstream tag $targetTag
if ($LASTEXITCODE -ne 0) { throw '获取官方版本失败，请先检查版本和网络。' }

# 在旁边创建独立工作目录，保留现有源码目录。
git worktree add -b "upgrade/i18n-$targetTag" "../signoz-upgrade-$targetTag" $targetTag
if ($LASTEXITCODE -ne 0) { throw '创建工作目录失败，未执行后续迁移。' }
Set-Location "../signoz-upgrade-$targetTag" -ErrorAction Stop

# 先核对要迁移的提交；当前分支是线性的，应包含以上四个提交及后来保存的补译提交。
git log --reverse --oneline v0.149.0..i18n/bilingual-v0.149.0
```

确认所在目录是新建的升级工作目录，且提交列表内容正确后，执行迁移：

```powershell
git cherry-pick v0.149.0..i18n/bilingual-v0.149.0
```

上述范围会迁移该分支上官方 `v0.149.0` 之后的所有提交，不限于汉化。若以后分支中引入其他功能或合并提交，应先审查提交列表，再选择逐个 `cherry-pick`，不要盲目执行整个范围。

遇到冲突时，运行 `git status` 查看文件，结合新版本上下文手动合并；处理后通过 `git add <文件>` 暂存，再运行 `git cherry-pick --continue`。检查上游新增和变更的页面、词库、语言初始化、构建脚本与测试。不要把路由、查询字段、API 参数、技术标识或用户数据当作界面文案翻译。

英文展示文案被用作 `console` 翻译键时，上游修改原文会导致旧键不再命中，需要同步调整键并确认语义；同一个英文词在不同界面含义不同时，需要结合上下文处理。新增的硬编码英文不一定会产生 Git 冲突，也需要主动排查。

## 升级后验证

在新工作目录的 `frontend/` 下，按新版本要求准备 Node 和 pnpm。当前 `v0.149.0` 的前端要求 Node `>=22`、pnpm `>=10 <11`，当前源码镜像使用 Node 22 与 pnpm `10.34.9`；升级时以新版本实际要求为准。确认 `node --version` 和 `pnpm --version` 后执行：

```powershell
pnpm install --frozen-lockfile
pnpm i18n:check
pnpm exec jest src/hooks/useConsoleTranslation.test.tsx src/components/LanguageSelector/LanguageSelector.test.tsx --runInBand
pnpm build
```

上游若重命名了测试或安装流程，按新版本实际情况调整。`i18n:check` 检查英文命名空间的中文键及 `{{变量}}` 是否匹配；它不会证明译文准确，也不会找出所有新增的硬编码文案或验证 `console.json` 的全部使用位置。

手工检查登录、菜单、仪表盘及编辑器、日志、链路、指标、告警和管理设置；分别切换中英文，检查提示、弹窗、筛选、表格、语言持久化及英文回退。最后用匹配新版本的后端与 Collector 进行联调，再构建镜像和验证部署。
