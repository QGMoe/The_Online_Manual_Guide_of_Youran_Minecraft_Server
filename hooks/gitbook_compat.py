"""让紧挨汉字的 _斜体_ 与 GitBook 一样显示为斜体。

Python-Markdown 的下划线强调要求两侧是“词边界”，汉字被当作单词字符，
所以 `制作的_服务器自动更新整合包_，` 不会变成斜体（GitBook 会）。
这里加一条行内规则：开头的 `_` 前面、结尾的 `_` 后面不是 ASCII 字母数字或下划线时即视为强调，
这样英文单词中间的下划线（如 snake_case）仍然不受影响。Markdown 源文件不需要改动。
"""

import xml.etree.ElementTree as etree

from markdown.extensions import Extension
from markdown.inlinepatterns import InlineProcessor

PATTERN = r"(?<![A-Za-z0-9_])_(?=[^\s_])([^_\n]*?[^\s_])_(?![A-Za-z0-9_])"


class CjkUnderscoreEm(InlineProcessor):
    def handleMatch(self, m, data):
        el = etree.Element("em")
        el.text = m.group(1)
        return el, m.start(0), m.end(0)


class CjkUnderscoreExtension(Extension):
    def extendMarkdown(self, md):
        # 优先级高于内置的 em_strong（60）；对内置规则本来就能识别的 _x_，两者生成的结果相同
        md.inlinePatterns.register(CjkUnderscoreEm(PATTERN, md), "cjk_underscore_em", 65)


def on_config(config):
    config.markdown_extensions.append(CjkUnderscoreExtension())
    return config
