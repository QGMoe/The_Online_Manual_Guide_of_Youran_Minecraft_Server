/* 让 Sveltia CMS 的“预览”窗格按中日韩友好的规则识别强调（粗体 / 斜体）。
 *
 * 背景：CommonMark 规定收尾的 ** 前面是标点（如“！”“””）、后面紧跟文字时，它不算“右侧定界符”，粗体不成立；
 * 汉字之间通常不写空格，于是 **欢迎来到手册！**在这里 在 CommonMark 解析器里会露出星号。
 * MkDocs（Python-Markdown）与原 GitBook 没有这个限制，网站显示正常，只有 Sveltia 的预览不认。
 *
 * 做法：只用 Sveltia 公开的全局 window.marked（预览用的解析器 marked）的 marked.use() 扩展点，
 * 覆盖 emStrong 分词：先走 marked 自己的规则，识别不了时才按下面的规则再试一次，因此不影响本来就能识别的写法。
 *   - * 与 **：被标点挡住的一侧若紧挨中日韩文字（汉字、假名、谚文、注音），仍按“定界符”处理（CJK-friendly 规则的核心）。
 *   - 单个 _：与网站上 hooks/gitbook_compat.py 的规则一致：前后不是 ASCII 字母数字 / 下划线即可。
 * 只影响预览的显示，不改页面内容；编辑区（Lexical）不走 marked，见 CONTRIBUTING.md 的说明。
 * 自写，无第三方代码。
 */
(function () {
  "use strict";
  var marked = window.marked;
  if (!marked || typeof marked.use !== "function" || !marked.Tokenizer) return;

  var CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u;
  var PUNCT = /[\p{P}\p{S}]/u;
  var SPACE = /\s/u;
  var ASCII_WORD = /[A-Za-z0-9_]/;

  function isSpace(c) { return !c || SPACE.test(c); }
  function isPunct(c) { return !!c && PUNCT.test(c); }
  function isCjk(c) { return !!c && CJK.test(c); }

  /* 开头 / 结尾定界符是否成立：与 CommonMark 相同，只是“被标点挡住”的一侧若挨着中日韩文字则放行。 */
  function openOk(prev, first, ch) {
    if (isSpace(first)) return false;
    if (ch === "_") return !prev || !ASCII_WORD.test(prev);
    return !isPunct(first) || isSpace(prev) || isPunct(prev) || isCjk(prev);
  }
  function closeOk(last, next, ch) {
    if (isSpace(last)) return false;
    if (ch === "_") return !next || !ASCII_WORD.test(next);
    return !isPunct(last) || isSpace(next) || isPunct(next) || isCjk(next);
  }

  var stdEmStrong = marked.Tokenizer.prototype.emStrong;

  marked.use({
    tokenizer: {
      emStrong: function (src, maskedSrc, prevChar) {
        var std = stdEmStrong.call(this, src, maskedSrc, prevChar);
        if (std) return std;

        var m = /^(\*{1,2}|_)/.exec(src);
        if (!m) return false;
        var d = m[1], ch = d.charAt(0), n = d.length;
        if (src.charAt(n) === ch) return false;          // 开头的定界符串更长（如 ***）：不处理
        if (!openOk(prevChar, src.charAt(n), ch)) return false;

        var i = n;
        while (i < src.length) {
          var c = src.charAt(i);
          if (c === "\\") { i += 2; continue; }
          if (c === "\n" && src.charAt(i + 1) === "\n") return false;   // 不跨段落
          if (c === "`") {                               // 跳过行内代码
            var j = i; while (src.charAt(j) === "`") j++;
            var run = src.slice(i, j), k = src.indexOf(run, j);
            i = k < 0 ? j : k + run.length;
            continue;
          }
          if (c === ch) {
            var e = i; while (src.charAt(e) === ch) e++;
            if (e - i === n && i > n && closeOk(src.charAt(i - 1), src.charAt(e), ch)) {
              var inner = src.slice(n, i);
              return {
                type: n === 2 ? "strong" : "em",
                raw: src.slice(0, e),
                text: inner,
                tokens: this.lexer.inlineTokens(inner)
              };
            }
            if (ch === "_") return false;                // 单个 _ 只看第一个候选，与网站的规则一致
            i = e; continue;
          }
          i++;
        }
        return false;
      }
    }
  });
})();
