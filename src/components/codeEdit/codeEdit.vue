<template>
  <div class="code-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";

import "codemirror/mode/javascript/javascript"; // mode js
import "codemirror/mode/sql/sql"; // mode sql
import "codemirror/mode/xml/xml"; // mode xml
import "codemirror/mode/htmlmixed/htmlmixed"; // mode html
import "codemirror/mode/css/css"; // mode css
// 主题
import "codemirror/theme/neo.css";

import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag"; // 自动补全对应的标签
import "codemirror/addon/selection/active-line";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/comment-fold.js";
// 自动补全
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/hint/sql-hint.js";
import "codemirror/addon/hint/html-hint.js";
import "codemirror/addon/hint/xml-hint.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/anyword-hint.js";
import "codemirror/addon/hint/css-hint.js";

String.prototype.findLastIndex = function (str) {
  return Array.from(this).findLastIndex((it) => it === String(str));
};
export default {
  name: "wgCodeEdit",
  components: {},
  props: {
    mode: {
      type: String,
      default: "application/json",
    },
    jsonCode: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: true,
    },
    lineNumbers: {
      type: Boolean,
      default: true,
    },
    nodeToFind: {
      type: String,
      default: "",
    },
    keywords: {
      type: Array,
      default() {
        // 支持两种格式1、[str1, str2] 或者 2、[{key: 1, value:1}]
        return [];
      },
    },
  },
  data() {
    return {
      codeEditor: "",
    };
  },
  watch: {
    jsonCode(newVal) {
      const editorValue = this.codeEditor.getValue();
      if (newVal !== editorValue) {
        this.codeEditor.setValue(this.jsonCode);
        setTimeout(() => {
          this.codeEditor.refresh();
        }, 1);
      }
    },
    immediate: true,
    deep: true,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.codeEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        mode: this.mode,
        theme: "neo", // 主题样式
        lint: true,
        tabSize: 4,
        lineNumbers: this.lineNumbers, // 显示行号
        readOnly: this.readonly, // 只读
        smartIndent: true, // 是否智能缩进
        styleActiveLine: true, // 当前行高亮
        lineWrapping: true, // 自动换行
        matchBrackets: true, // 括号匹配显示
        autoCloseBrackets: true, // 输入和退格时成对
        autoCloseTags: true, // 自动补全对应的标签
        extraKeys: { Tab: "autocomplete" }, //
        foldGutter: true,
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers",
        ],
        hintOptions: { completeSingle: false }, // 当提示匹配只有一项的时候是否自动补全
      });
      this.codeEditor.on("inputRead", () => {
        // 自动补全
        if (this.keywords.length > 0) {
          this.codeEditor.showHint({
            hint: this.customAutocomplete,
            completeSingle: false,
          });
        }
      });
      this.codeEditor.setValue(this.jsonCode);
      this.codeEditor.on("change", (cm) => {
        this.$emit("change", cm.getValue());
      });
    },
    cursorXml() {
      // 使用正则表达式在 XML 内容中查找文本
      const regex = new RegExp(`${this.nodeToFind}`, "g");
      let match;

      // 遍历所有匹配项
      while ((match = regex.exec(this.jsonCode)) !== null) {
        // 获取匹配位置
        const position = match.index;

        // 计算行号和列号
        const lines = this.jsonCode.slice(0, position).split("\n");
        const line = lines.length - 1;
        const ch = lines[lines.length - 1].length;

        // 设置光标位置
        this.codeEditor.setCursor({ line, ch });
        break; // 如果只找到第一个匹配项，退出循环
      }
    },
    getMatchStr(token, start, end) {
      let inputStr = "";
      let strEnd = 0;
      let hasParse = false;
      try {
        inputStr = JSON.parse(token.string);
        strEnd = end - start - 1; // 输入的字符串
        hasParse = true;
      } catch (e) {
        inputStr = token.string;
        strEnd = end - start; // 输入的字符串
        hasParse = false;
      }
      let tmpStr = inputStr.substring(0, strEnd);
      tmpStr = tmpStr.substring(tmpStr.findLastIndex(this.nodeToFind));
      return { inputStr, tmpStr, hasParse };
    },
    // 自定义提示器
    customAutocomplete(cm) {
      const cursor = cm.getCursor();
      const token = cm.getTokenAt(cursor);
      const start = token.start;
      const end = cursor.ch;
      const keywords = this.keywords;
      const { inputStr, hasParse, tmpStr } = this.getMatchStr(
        token,
        start,
        end
      );

      let suggestions = [];
      if (inputStr.includes(this.nodeToFind)) {
        suggestions = keywords
          .filter((kw) => {
            // 判断kw是字符串还是对象 value label格式
            if (typeof kw === "string") {
              return kw.startsWith(tmpStr);
            } else {
              return kw.value.startsWith(tmpStr);
            }
          })
          .map((kw) => {
            if (typeof kw === "string") {
              return {
                text: hasParse
                  ? JSON.stringify(kw).substring(
                      0,
                      JSON.stringify(kw).length - 1
                    )
                  : kw, // 点击后在页面的值
                displayText: kw, // 显示值
              };
            } else {
              return {
                text: hasParse
                  ? JSON.stringify(kw.value).substring(
                      0,
                      JSON.stringify(kw.value).length - 1
                    )
                  : kw.value, // 点击后在页面的值
                displayText: kw.label, // 显示值
              };
            }
          });
      }

      return {
        list: suggestions,
        from: CodeMirror.Pos(cursor.line, start),
        to: CodeMirror.Pos(cursor.line, end),
      };
    },
    // 刷新编辑器
    refresh() {
      this.codeEditor && this.codeEditor.refresh();
    },
  },
};
</script>

<style lang="less" scoped>
.code-editor {
  height: 100%;
  position: relative;
  /deep/ .CodeMirror {
    height: auto;
  }
  // .cm-s-neo
  /deep/ .CodeMirror-cursor {
    width: 2px;
  }
}
</style>
<style lang="less">
.CodeMirror-hints {
  z-index: 9999 !important;
}
</style>
