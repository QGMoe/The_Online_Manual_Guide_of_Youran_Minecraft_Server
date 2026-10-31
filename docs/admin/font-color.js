/* Sveltia CMS 的“彩色文字”行内组件（插入 / 编辑页面里的 <font color="…">文字</font>）。
 *
 * 用法：
 *   - 源码模式（默认）：工具栏“插入”→“彩色文字”，在光标处插入 <font color="red">文字</font>，之后在文本框里改文字或颜色；
 *   - 富文本模式：同一入口弹出对话框，填文字、选颜色；点已有的彩色文字，在对话框里修改文字或颜色。
 * 保存的写法与页面里现有的一致：<font color="red">文字</font>。
 * 注意：富文本模式保存时 Sveltia 会重排整篇 Markdown，已有页面请用源码模式（见 CONTRIBUTING.md）。
 *
 * 原样保留：页面里已有的 <font> 有好几种写法（color="red"、style="color:red;"、color="#FF33EA "、
 * <font color="red" style="font-size:150%;"> 等）。组件把读进来的整段原文存在数据里，保存时若文字和颜色都没改，
 * 就把原文逐字写回；只改了文字时，只替换标签之间的文字；改了颜色时，只替换标签里的颜色值，其他属性不动。
 * 只有新插入的才写成规范的 <font color="…">。
 *
 * 预览：编辑器里与预览窗格里的颜色由 font-colors.css 决定（与网站的映射一致，深浅色各一套）。
 */
(function () {
  "use strict";
  var CMS = window.CMS;
  if (!CMS || typeof CMS.registerEditorComponent !== "function") return;

  /* 下拉里的预设颜色：key 就是写进页面的值。red/green/orange 在网站上映射为主题的危险 / 成功 / 警告色，
     其余是页面里已有的十六进制色（网站对其中看不清的做了深浅色替代，见 stylesheets/youran.css）。 */
  var PRESETS = [
    { key: "red", label: "红（危险 / 重点）" },
    { key: "green", label: "绿（成功 / 推荐）" },
    { key: "orange", label: "橙（警告）" },
    { key: "#006BFF", label: "蓝 #006BFF" },
    { key: "#5100FF", label: "紫 #5100FF" },
    { key: "#FF33EA", label: "粉 #FF33EA" }
  ];
  var CUSTOM = "custom";
  var HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  function norm(v) { return String(v == null ? "" : v).trim().toLowerCase(); }
  function presetKeyOf(value) {
    var n = norm(value);
    for (var i = 0; i < PRESETS.length; i++) if (norm(PRESETS[i].key) === n) return PRESETS[i].key;
    return null;
  }
  function colorValue(data) {
    // 选了“自定义”却没填时按红色处理，避免写出空的 color=""
    return data.color === CUSTOM ? (String(data.custom || "").trim() || "red") : (data.color || "red");
  }

  /* 取出一段 <font …>…</font> 的颜色值（color="…" 或 style="…color:…;"）与文字 */
  var TAG = /^<font((?:\s+[\w-]+="[^"]*")*)\s*>([\s\S]*?)<\/font>$/;
  var ATTR_COLOR = /(\scolor=")([^"]*)(")/;
  var STYLE_COLOR = /(\sstyle="[^"]*?\bcolor:\s*)([^";]*?)(\s*(?:;|"))/;
  function parseTag(raw) {
    var m = TAG.exec(raw || "");
    if (!m) return null;
    var attrs = m[1], c = ATTR_COLOR.exec(attrs) || STYLE_COLOR.exec(attrs);
    return { attrs: attrs, text: m[2], color: c ? c[2] : "" };
  }

  var colorOptions = PRESETS.map(function (p) { return { label: p.label, value: p.key }; })
    .concat([{ label: "自定义（在下面填十六进制）", value: CUSTOM }]);

  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;"); }

  CMS.registerEditorComponent({
    id: "font-color",
    label: "彩色文字",
    icon: "format_color_text",
    mode: "dialog",
    summary: "{{text}}（{{color}}）",
    fields: [
      { name: "text", label: "文字", widget: "string" },
      { name: "color", label: "颜色", widget: "select", options: colorOptions, default: "red" },
      { name: "custom", label: "自定义颜色（仅“颜色”选自定义时使用，写成 #RRGGBB）", widget: "string", required: false },
      { name: "raw", label: "原文", widget: "hidden", required: false }
    ],
    /* 只认带颜色的 <font>：color="…" 或 style="…color:…"；单行（不带 s / m 标志），所以是行内组件，表格单元格里也能用 */
    pattern: /<font(?=[^>]*color)(?:\s+[\w-]+="[^"]*")*\s*>.*?<\/font>/,
    fromBlock: function (match) {
      var p = parseTag(match[0]);
      if (!p) return { text: match[0], color: "red", custom: "", raw: "" };
      var key = presetKeyOf(p.color);
      return { text: p.text, color: key || CUSTOM, custom: key ? "" : p.color.trim(), raw: match[0] };
    },
    toBlock: function (data) {
      data = data || {};
      var text = data.text == null || data.text === "" ? "文字" : String(data.text);
      var value = colorValue(data);
      var p = parseTag(data.raw);
      if (p) {
        if (p.text === text && norm(p.color) === norm(value)) return data.raw;   // 没改：逐字写回
        var attrs = p.attrs;
        if (norm(p.color) !== norm(value)) {                                      // 改了颜色：只换颜色值
          attrs = ATTR_COLOR.test(attrs)
            ? attrs.replace(ATTR_COLOR, function (_, a, __, c) { return a + value + c; })
            : attrs.replace(STYLE_COLOR, function (_, a, __, c) { return a + value + c; });
        }
        return "<font" + attrs + ">" + text + "</font>";
      }
      return '<font color="' + esc(value) + '">' + text + "</font>";
    },
    /* 预览窗格：把组件换成对应的 <font>（文字里的 ** 等 Markdown 仍会被解析，与网站一致）；颜色由 font-colors.css 映射 */
    toPreview: function (data) {
      data = data || {};
      var text = data.text == null || data.text === "" ? "文字" : String(data.text);
      return '<font color="' + esc(colorValue(data) || "red") + '">' + text + "</font>";
    }
  });

  /* 与预览窗格里的 <font> 一起使用的颜色映射 */
  try { CMS.registerPreviewStyle("font-colors.css"); } catch (e) { /* 老版本没有该接口时忽略 */ }
})();
