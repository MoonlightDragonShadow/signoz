# Bilingual console maintenance

The interface language selector is available on the sign-in page and under Account Settings. Simplified Chinese is the default for browsers without a saved language. The selection is saved in the current browser and scoped to the deployment path. English remains available from the language selector.

- Keep Chinese resources under `public/locales/zh-CN`. The `console` namespace uses original English display strings as keys. Existing namespaces retain their upstream keys.
- Keep route IDs, query syntax, log attributes, API values, and user content independent of translated labels.
- From a new upstream release tag, create an upgrade branch and cherry-pick the bilingual commits in order. Reconcile changed source strings and prefer upstream translation keys when the new release introduces them.
- Run `pnpm build` to refresh the locale hashes and bundle the resources. Check both languages on the sign-in page, sidebar, time picker, and log explorer. Verify a refresh preserves the selection and that an untranslated label falls back to English.
- To reuse an existing SigNoz instance during local development, set `VITE_FRONTEND_API_ENDPOINT` to its origin before running `pnpm dev`. The endpoint should support the browser's development origin. Use a matching frontend and backend release when validating a production deployment.

## 全站界面覆盖与升级验收

本轮补译覆盖仪表盘列表、详情、面板编辑和变量设置，以及首页、服务、日志、链路、指标、基础设施、消息队列、告警、集成、AI 助手和管理设置的界面文案。共用的查询构建器、表格、导出、空状态、确认弹窗和表单提示一并接入语言切换。

中文资源包含全部 30 个上游英文命名空间，并以 console 命名空间补充组件中原先写死的展示文案。ConsoleText 用于模块级 JSX 配置中的标签，useConsoleTranslation 用于组件内部字符串属性，确保切换语言时更新显示。

升级后运行 pnpm i18n:check，检查上游新增词库键和插值变量是否与中文一致。pnpm build 会先执行该检查，再生成词库哈希。这个检查覆盖词库结构，页面中新增的硬编码文案还需要按菜单、弹窗和表单逐项检查。

验收时分别选择 English 和简体中文，检查仪表盘创建、导入、面板编辑、变量设置、保存及删除提示，然后检查日志和链路查询、指标筛选、告警配置及账户设置。用户创建的名称、采集数据、查询字段、代码示例和技术品牌保留其原始内容。
