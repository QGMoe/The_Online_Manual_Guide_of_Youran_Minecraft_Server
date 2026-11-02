"""页面 front matter 里的 title 为空时当作没有写，标题照旧取页面里的第一个一级标题。

编辑工具（Sveltia CMS）给各章页面配了一个隐藏的 title 字段（只为“目录顺序”里显示页面标题），平时为空、
配置了“留空的可选字段不写进文件”。这个钩子是保险：万一某次保存写出了 `title: ''`，侧栏与网页标题也不会变成空白。
"""


def on_page_markdown(markdown, page, config, files):
    if "title" in page.meta and not str(page.meta.get("title") or "").strip():
        del page.meta["title"]
    return markdown
