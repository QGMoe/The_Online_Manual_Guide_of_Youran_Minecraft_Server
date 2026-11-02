"""各章页面按页面开头的 order 排序，章节标题取本章首页的第一个一级标题。

编辑工具（Sveltia CMS）的各章集合开了 reorder：在本章的页面列表里拖动排序，顺序写在每个页面开头的
front matter `order` 里。mkdocs-awesome-nav 生成侧栏之后（它的 on_nav 优先级是 100，先于本钩子），
这里把每一章里的页面重新排：本章首页（README.md）永远在最前；其余按 order 从小到大；没写 order 的
（例如刚在 GitHub 上新建的页面）排在最后，彼此保持原来的先后。
"""

import re

from mkdocs.structure.nav import Section, _add_previous_and_next_links, _get_by_type
from mkdocs.structure.pages import Page
from mkdocs.utils.meta import get_data

H1 = re.compile(r"^#[ \t]+(.+?)[ \t#]*$", re.M)
INDEX_NAMES = ("README", "index")


def _parse(page):
    markdown, meta = get_data(page.file.content_string)
    order = meta.get("order")
    if isinstance(order, bool) or not isinstance(order, (int, float)):
        order = None
    m = H1.search(markdown)
    return order, (m.group(1).strip() if m else None)


def _fix(section):
    for child in section.children:
        if isinstance(child, Section):
            _fix(child)
    index = [c for c in section.children if isinstance(c, Page) and c.file.name in INDEX_NAMES]
    rest = [c for c in section.children if c not in index]
    keyed = []
    for pos, child in enumerate(rest):
        order = _parse(child)[0] if isinstance(child, Page) else None
        keyed.append(((0, order, pos) if order is not None else (1, 0, pos), child))
    keyed.sort(key=lambda kv: kv[0])
    section.children = index + [c for _, c in keyed]
    if index:
        title = _parse(index[0])[1]
        if title:
            section.title = title


def on_nav(nav, config, files):
    for item in nav.items:
        if isinstance(item, Section):
            _fix(item)
    nav.pages = _get_by_type(nav.items, Page)
    _add_previous_and_next_links(nav.pages)
    return nav
