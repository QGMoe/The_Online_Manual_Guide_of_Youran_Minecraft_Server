"""把 docs/FOOTER.md 渲染后放到每个页面正文的底部。

原 GitBook 的 localized-footer 插件会把 FOOTER.md 放在每页底部；这里用 MkDocs 的钩子实现同样的效果。
页脚里的图片路径按 docs/ 根目录书写（如 assets/images/xxx.png），渲染时按当前页面的位置换成相对路径。
"""

import os
import re

import markdown
from mkdocs.utils import get_relative_url

FOOTER_FILE = "FOOTER.md"
_footer_html = ""


def on_config(config):
    global _footer_html
    path = os.path.join(config.docs_dir, FOOTER_FILE)
    _footer_html = ""
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as f:
            _footer_html = markdown.markdown(f.read())
        config.watch.append(path)
    return config


def on_page_context(context, page, config, nav):
    def fix_src(match):
        return 'src="%s"' % get_relative_url(match.group(1), page.url)

    context["footer_html"] = re.sub(r'src="(assets/[^"]+)"', fix_src, _footer_html)
    return context
