# CarePath · Claude 部署交接

这是可直接接手的完整项目，包含源码、静态发布文件、设计约束、研究材料与检查证据。交接日期：2026-11-17。

## 远程入口与部署目标

- 仓库：[didiisliuzhihan/product-design](https://github.com/didiisliuzhihan/product-design)
- 交接分支：`handoff/carepath-2026-11-17`
- 计划正式地址：`https://productdesign.zhihanliu.art/carepath/`。这是目标地址，交接阶段未发布。
- 本分支基于 `main` 的 `8b0b34103c25528e76e03859b227a21f6761197f`，仅添加 CarePath 与交接目录。
- 已确认仓库 CNAME 为 `productdesign.zhihanliu.art`，仓库启用了 Pages。实际 Pages 发布分支、目录或 Actions 配置需由 Claude 在接手时核实。

现有根目录 `index.html` 是综合作品集，必须保留。不要覆盖根目录首页、CNAME、其他作品、图片或简历。当前交接没有修改 main、DNS 或线上部署。

## 从哪里开始

| 路径 | 用途 |
| --- | --- |
| `carepath/` | 已构建的完整静态项目，放在网站的 `/carepath/` |
| `handoff/carepath/source/` | 可编辑源码、移动端原生设备运行环境、锁文件与构建脚本 |
| `handoff/carepath/source/CLAUDE.md` | 产品、代码编辑边界与不可丢失的设计决定 |
| `handoff/carepath/docs/DEPLOYMENT.md` | 构建、子路径、发布、验收与回滚步骤 |
| `handoff/carepath/docs/QA.md` | 本次验证与待验证事项 |
| `handoff/carepath/docs/PRODUCT_AND_PERMISSIONS.md` | 产品流程、双方权限与实现边界 |
| `handoff/carepath/docs/research-plan-zh.html` | 可直接阅读的招募、访谈、可用性测试方案 |
| `handoff/carepath/docs/observation-template.json` | 真实研究记录模板 |
| `handoff/carepath/preview/` | 已实现界面的检查截图 |
| `handoff/carepath/CLAUDE_PROMPT.txt` | 可复制给 Claude 的接手指令 |
| `handoff/carepath/MANIFEST.sha256` | 本交付中每个文件的校验值 |

## 最短接手路径

```sh
git clone --branch handoff/carepath-2026-11-17 https://github.com/didiisliuzhihan/product-design.git
cd product-design
cd handoff/carepath/source
npm --prefix mobile-app ci
npm run build
npm run verify
npm run preview -- --port 4173
```

需要 Node.js 24 LTS（也可用兼容 Vite 8 的 Node 22.12+）。根项目只有 Node 内置模块，不需要在根目录安装依赖。移动端依赖由 `mobile-app/package-lock.json` 固定。

预览进入 `/carepath/`，源码构建产物在 `handoff/carepath/source/dist/`。如果源码重建，按 DEPLOYMENT.md 同步到仓库 `carepath/` 再发布。无需 API key、账号、数据库或服务器函数。

## 完成标准

保留原综合作品集，并在首页以既有样式增加 CarePath 项目入口；新项目的首页叙述、手机原型、照护者协作、设计系统与研究计划可访问。授权与撤回在两端同步，所有图片、原生手机边框与字体在正式子路径下正常加载。核实部署方式后再合并和发布，最终回报线上 URL、提交 SHA、检查结果与回滚方法。

研究与影响数据仍待收集。浏览器验证不等于用户研究；禁止编造访谈、转化率、测试成功率或医疗结果。所有示例人物和文件均为虚构。
