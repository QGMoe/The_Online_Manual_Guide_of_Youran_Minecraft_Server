# 维护说明

手册用 [MkDocs](https://www.mkdocs.org/) + [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建，用 [Sveltia CMS](https://sveltiacms.app/)（MIT）在线编辑，push 到 `master` 后由 GitHub Actions 自动发布。页面源文件在 `docs/`，仓库根目录的 `README.md` 已移到 `docs/README.md`（它就是手册的首页）。

## 本地预览

需要 Python 3.10 以上。

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve          # 打开 http://127.0.0.1:8000/ 预览，改文件后自动刷新
.venv/bin/mkdocs build --strict # 与 CI 相同的构建，有任何警告即失败；输出在 site/（已被 .gitignore 忽略）
```

站点用 `use_directory_urls: false`，地址与原 GitBook 一致：`section1/Join_Youran_Server.html`、各章 `section1/index.html`（来自 `README.md`）。**不要改已有页面的文件名**，否则旧链接会失效。

## 目录怎么管（不用改配置）

目录由 [mkdocs-awesome-nav](https://lukasgeiter.github.io/mkdocs-awesome-nav/) 按文件夹生成，顺序与标题写在各目录的 `.nav.yml`：

- `docs/.nav.yml`：简介、三章的顺序，以及侧栏底部的四条外链（服务器官网等）。
- `docs/section*/.nav.yml`：本章标题和页面顺序。已列出的页面按所列顺序；**没列出的新页面自动排在本章末尾，标题取页面里的第一个一级标题**（`# 标题`）。所以在 CMS 里新建页面时，正文第一行写 `# 页面标题` 即可，不需要改任何配置。
- 想调整新页面的位置，才需要在对应的 `.nav.yml` 里把文件名加到想要的位置。

## 用 Sveltia CMS 编辑

1. 打开 `https://docs.youran.qingu.moe/admin/`（本地预览时是 `http://127.0.0.1:8000/admin/`）。
2. 在登录页选“**使用访问令牌登录**”，粘贴令牌（登录页上的“使用 GitHub 登录”需要 OAuth 中转服务，本站没有部署，不要用它）。
3. 令牌由服主在 GitHub 创建：Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token。
   - Resource owner：仓库所属账号；Repository access：**Only select repositories**，只选手册这一个仓库；
   - Permissions → Repository permissions → **Contents: Read and write**（Metadata 只读会自动带上），其余都不给；
   - 设一个有效期（建议 90 天内），到期后重新生成。
   - 令牌只保存在浏览器本地，不要在公用电脑上登录；不再使用时到 GitHub 里 Revoke。
4. 保存后 CMS 会直接提交到 `master`（提交信息形如 `docs: 修改页面 section1/Online_Map`），随后 Actions 自动构建发布，约一两分钟生效。
5. 图片上传到 `docs/assets/images/`，与迁移进来的图片放在一起；页面里引用为 `../assets/images/文件名`。

配置在 `docs/admin/config.yml`（后端 GitHub，仓库 `QGMoe/The_Online_Manual_Guide_of_Youran_Minecraft_Server`，分支 `master`）。新建页面的文件名自动取 `page-日期-时间`，不含正文标题；需要好看的网址时，在 GitHub 上把文件改名并同步 `.nav.yml`。

## 编辑模式、彩色文字与粗体

### 只用源码模式

正文只开**源码模式**（直接编辑 Markdown 文本，`docs/admin/config.yml` 里各集合 `modes: [raw]`），旁边的预览窗格显示排版后的样子。保存时只改动你编辑过的字符，其余原样写回。

没有开富文本模式：Sveltia 的富文本模式会把整篇读进自己的结构再重写，对本站现有页面实测（逐页打开、只改一个字、保存、与原文对比）会出现：`**<font …>…</font>**` 外层的粗体被拆开或丢掉；行内代码、列表里的反引号错位；`_斜体_` 变成 `*斜体*`、网址里的 `_` 与 `~` 被加反斜杠；`**欢迎来到手册！**在这里` 这类中文粗体被转义成 `\*\*`；表格重新排版；空行增减。这些都改不了（见下面“粗体与中日韩标点”），所以不开。

### 彩色文字

页面里的彩色文字是 `<font color="red">文字</font>` 这样的 HTML（从 GitBook 迁来，还有 `<font style="color:red;">`、`<font color="#FF33EA ">`、`<font color="red" style="font-size:150%;">` 等写法）。工具栏“插入 → 彩色文字”（`docs/admin/font-color.js`）在光标处插入 `<font color="red">文字</font>`，之后直接改文字和颜色。常用的颜色名：`red`（红）、`green`（绿）、`orange`（橙），网站上按主题色显示；也可以写 `#RRGGBB`。（组件也支持富文本模式下的对话框与“没改的原样写回”，现在富文本模式没开，用不到。）
- **预览**：预览窗格里按网站的颜色显示（`docs/admin/font-colors.css`，随系统深浅色切换）。

网站上的颜色由 `docs/stylesheets/youran.css` 末尾“页面里 `<font>` 的文字颜色”一节决定：`red` / `green` / `orange` 取主题的危险 / 成功 / 警告文字色；其余十六进制色浅色下保持原色，只有在浅色底上看不清的亮黄、亮绿以及在深色底上看不清的蓝紫色换成同色相的可读色。`font-colors.css` 是它的副本，**改其中一处时同步另一处**。页面里的 `<font>` 本身不被改写。

### 粗体与中日韩标点

CommonMark 规定收尾的 `**` 前面是标点、后面紧跟文字时不算粗体（如 `**欢迎来到手册！**在这里`），汉字之间不写空格，所以这类写法在 CommonMark 解析器里会露出星号；网站用的 Python-Markdown 没有这个限制，显示正常。

- **预览窗格**：Sveltia 用 marked 渲染预览，`docs/admin/cjk-friendly.js` 通过 `marked.use()` 补上了中日韩友好的规则（自写，无第三方代码），预览与网站一致。
- **编辑器本身**：源码模式不解析 Markdown，保存原样。富文本模式用 Lexical 自带的 Markdown 规则，没有对外开放的扩展口（Sveltia 不使用 micromark / remark，`CMS.registerRemarkPlugin` 只是 Decap 兼容的空接口），所以无法在不改动 Sveltia 打包文件的前提下让它也按中日韩规则识别；这是只开源码模式的原因之一。

## 上线需要服主在上游仓库做的设置

1. 上游仓库 Settings → Pages → Build and deployment → **Source 选 “GitHub Actions”**（不再用 gh-pages 分支）。
2. 自定义域名：`docs/CNAME` 已带上现有的 `docs.youran.qingu.moe`，构建产物里会有它；在 Pages 设置里的 Custom domain 也填同一个域名，并勾选 Enforce HTTPS。DNS 不用动。
3. 合并后确认 Actions 里“构建并发布手册”运行成功；`gh-pages` 分支不再使用，确认新站正常后可以删除。
4. 用 CMS 的话，在上游仓库创建上面说的细粒度令牌。

## Sveltia CMS 的版本与校验

- 版本：`@sveltia/cms` **0.252.0**（npm，MIT），自托管在 `docs/admin/`，不从 CDN 加载。
- `docs/admin/sveltia-cms.js` 的 SHA-256：`d42c8f272ecba2cca23e8ad0edb23a7382e4de66f040f1676dfe22145ca96651`
- npm 压缩包 `cms-0.252.0.tgz` 的 SHA-256：`a83b2201077e8183a9522ce6bd6c7929730283996fbd1cd75617576d97825082`（SHA-1 `6cb1000ac43bcca09759f6ee76808667c8a2c55c`，与 npm 仓库登记一致）
- 其余自托管文件（分块 `chunks/`、语言包 `locales/`、许可证）的哈希在 `docs/admin/SHA256SUMS`，在该目录运行 `sha256sum -c SHA256SUMS` 校验。
- 界面字体 `docs/admin/fonts/`（Source Sans 3、Noto Mono、Material Symbols Outlined）来自 Fontsource 的同版本 woff2，SIL OFL 许可。
- `docs/admin/index.html` 里有两小段脚本：把 Sveltia 原本从 unpkg 取语言包、检查新版本的请求改到本站；用 FontFace 接口让界面字体改用本站文件（原本从 jsdelivr 取）。升级 Sveltia 时要对照检查它们是否仍然适用。
- 升级：从 `https://registry.npmjs.org/@sveltia/cms/-/cms-<版本>.tgz` 下载，核对 npm 登记的 shasum，把 `dist/sveltia-cms.js`、`dist/chunks/`（不含 `.map`）、`locales/zh-CN.json`、`locales/zh-TW.json`、`LICENSE.txt` 覆盖进 `docs/admin/`，更新 `SHA256SUMS`、`index.html` 里的版本号、`config.yml` 注释和本节。

## 换主题颜色

颜色都在 `docs/stylesheets/youran.css` 开头的两段变量里（浅色 `default`、深色 `slate`），取值与网页面板的“草方块”主题一致，变量旁边的注释写了对应面板文件里的名字。改这两段即可；下面的规则都引用这些变量。字体栈、圆角取自悠然官网。

## 其他说明

- 页面里的文字不要因为排版好看而改动；Markdown 里的 `_斜体_` 紧挨汉字时 Python-Markdown 默认不识别，`hooks/gitbook_compat.py` 补了这条规则，使显示与原 GitBook 一致。
- 页脚（原 GitBook 的 `FOOTER.md`）是 `docs/FOOTER.md`，由 `hooks/footer.py` 放在每页正文底部；它在 `exclude_docs` 里，不会成为独立页面。
- 搜索使用 Material 自带的搜索，中文分词依赖 `jieba`（在 `requirements.txt` 里）。
- 站点不加载外部字体、脚本与图标；写新页面时图片也请上传到仓库，不要再引用外部图床。
- Material for MkDocs 已进入维护期（官方说明 2027-05-05 停止支持，继任者是 Zensical）。构建时的相关提示用环境变量 `NO_MKDOCS_2_WARNING=1` 关闭（Actions 里已设置），暂不影响使用。
