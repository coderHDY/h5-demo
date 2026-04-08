# Agent 说明（与 Cursor 规则一致）

在本仓库**新增 H5 案例/模版**时，请先阅读并遵守：

- **Cursor**：规则文件为 [`.cursor/rules/h5-demo-architecture.mdc`](.cursor/rules/h5-demo-architecture.mdc)（`alwaysApply: true`，会话中会自动注入）。

## 摘要

1. 在 `src/<案例目录>/` 新建目录，至少包含 `index.html`；资源用相对路径 `./`。
2. 不要把演示页只放在 `src/public/`（扫描会跳过，不会出现在侧栏）。
3. 改完后执行 `node index.js` 或 `npm run serve`，以更新 `src/index.html`（由 `src/public/index.html` 模板生成）。
4. 路由为 `location.hash` + iframe，无服务端路由；子页脚本宜用外部 `*.js`。
