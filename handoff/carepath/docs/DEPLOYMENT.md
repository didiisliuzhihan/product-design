# 部署与回滚

## 已确认与待确认

GitHub 仓库 `didiisliuzhihan/product-design` 为公开仓库；CNAME 内容为 `productdesign.zhihanliu.art`，仓库元数据 `has_pages=true`。现有 main 是静态综合作品集。交接基线为 `8b0b34103c25528e76e03859b227a21f6761197f`。

尚未读取 Pages 管理设置，也未验证线上域名 HTTP 可达性。Claude 接手后需检查 Settings → Pages 或使用现有授权的部署工具，确认实际发布分支/目录/工作流。不要从 CNAME 推断发布源，不需要更改 DNS。

## 文件如何对应正式网站

| 仓库目录 | 正式 URL |
| --- | --- |
| 根目录现有 index.html | `https://productdesign.zhihanliu.art/`，保留 |
| `carepath/index.html` | `/carepath/` |
| `carepath/mobile/index.html` | `/carepath/mobile/index.html` |
| `carepath/assets/` | `/carepath/assets/` |
| `carepath/mobile/assets/` | `/carepath/mobile/assets/` |

整个项目为静态资源，hash 路由无需 SPA rewrite。移动端入口有实体 index.html，不依赖 Pages 的404回退。iframe、各角色和外层作品集应保持同源。

## 接手、构建、预览

```sh
git clone --branch handoff/carepath-2026-11-17 https://github.com/didiisliuzhihan/product-design.git
cd product-design
git fetch origin
git diff --stat origin/main...HEAD
cd handoff/carepath/source
npm --prefix mobile-app ci
npm run build
npm run verify
npm run preview -- --port 4173
```

打开 `http://127.0.0.1:4173/carepath/`。根项目无依赖，不需要 `npm install`。推荐 Node24 LTS；移动端版本由锁文件固定。预览应保持 `/carepath/`，不要仅在网站根路径验证。

如果改了源码，从仓库根目录同步**新构建产物**：

```sh
rsync -a --delete handoff/carepath/source/dist/ carepath/
git diff --stat
git status --short
```

`--delete` 仅限此明确的目标 `carepath/`，不得指向仓库根目录。不要将源码目录或 mobile-app/dist 的 Worker 输出直接当作静态网站根目录。

## 发布步骤

1. 核对交接分支与当前 main 的差异；如果 main 有新提交，先合入并保留其他作品的更改。
2. 在原首页按已有设计加入 CarePath 项目入口，链接 `/carepath/`。不替换首页，不覆盖 CNAME。
3. 完成 QA.md 验收。在浏览器以 `/carepath/` 路径检查授权、权限更新和撤回。
4. 按确认后的现有 Pages 流程合并/发布。若 Pages 从 `/docs` 发布，应映射产物到该发布目录的 `carepath/`；若 Actions 上传专用 artifact，确保 artifact 同时含原站点和 CarePath。不要盲目切换 Pages 来源。
5. 在正式 HTTPS 域名检查首页、项目入口、两种语言、手机边框/字体、深链接、协作撤回及404资源；记录实际发布 SHA 和部署结果。

当前交接只准备独立分支，没有执行这些生产发布步骤。

## 回滚

部署前记录实际生产 commit 和发布配置。上线后如有问题，在发布分支通过 `git revert <本次部署提交>` 撤销 CarePath 及首页入口，沿用既有流程重新部署。若合并提交使用 `git revert -m 1 <合并SHA>`，先核实该提交父节点。不要 force-push，不要对整个仓库 reset，不要删除其他项目，不改 DNS。

## 缓存与数据

手机页面内联的构建入口、脚本与字体必须同批发布。无 Service Worker。演示数据使用 `carepath-mobile-v2` 及旧页面本地状态，跨同源 iframe 同步；HTTPS 正式域名与本地预览互不共享状态。需要干净演示时仅清除 CarePath 对应的 localStorage 项目，避免清除综合作品集其他数据。
