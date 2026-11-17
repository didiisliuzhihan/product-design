# CarePath

帮助老年用户理解医疗费用文件、核对信息、准备求助，并在需要照护者协助时保留对共享范围的控制。双语作品集与交互原型，无后台依赖。

## 运行

使用 Node.js 24 LTS 与 npm。在本目录执行：

```sh
npm --prefix mobile-app ci
npm run build
npm run verify
npm run preview -- --port 4173
```

预览路径为 `/carepath/`，生成目录为 `dist/`。`npm run build -- --base /` 可生成网站根路径版本；默认发布始终使用 `deployment.config.json` 的 `/carepath/`。需通过 HTTP 预览，不能双击 HTML 文件运行。

## 结构

- `site/`：可编辑作品集源文件。`v2.js`、`v2.css` 为最新页面；`app.js`、`styles.css` 保留共享逻辑与合作方工作台。不要随意删除旧文件或改变加载顺序。
- `mobile-app/src/Prototype.tsx`、`prototype.css`：手机业务界面、流程、授权与协作。
- `mobile-app/src/mobile/`：受保护的设备、键盘、滚动和导航运行环境，见内部 `AGENTS.md`。
- `scripts/build-mobile.mjs`：先构建手机应用，再组装完整站点；只在生成文件中修正子路径，不修改受保护运行环境。
- `scripts/check-static.mjs`：检查 HTML、CSS、原生设备资源与手机构建包中的路径。
- `scripts/preview.mjs`：按真实子路径提供静态预览；不是生产服务。
- `PRODUCT.md`、`DESIGN.md`：既定产品和设计方向。

## 页面

`#case` 项目首页；`#problem` 五项策略导图；`#caregiver-story` 首页照护协作；`#prototype` 会员手机原型；`#collaboration` 双手机权限原型；`#partners` 专业人员模拟工作台；`#system` 设计系统；`#research-plan` 研究计划。

手机原型也可直接进入 `mobile/index.html?flow=care&view=older&screen=sharing&lang=en` 或 `mobile/index.html?flow=care&view=caregiver&screen=care-view&lang=en`。双方必须同源，才能在本地演示中同步状态。

这是作品集概念：模拟解释、示例文件、localStorage 状态、无真实上传/邀请/申请/支付。撤回仅停止此原型里的后续访问，不能追回已经保存的副本。研究尚未开展。完整交接见仓库根目录 CAREPATH_CLAUDE_HANDOFF.md。
