<template>
  <Splitpanes class="code-diff default-theme">
    <Pane class="code-container" size="50" :min-size="10">
      <textarea ref="leftEditor"></textarea>
    </Pane>
    <Pane class="code-container" size="50" :min-size="10">
      <textarea ref="rightEditor"></textarea>
    </Pane>
  </Splitpanes>
</template>

<script>
import DiffMatchPatch from "diff-match-patch";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";
import { Splitpanes, Pane } from "splitpanes";

export default {
  name: "bsCodeDiff",
  components: { Splitpanes, Pane },
  props: {
    oldContent: {
      type: String,
      required: true,
    },
    newContent: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dmp: new DiffMatchPatch(),
    };
  },
  watch: {
    oldContent(newVal) {
      this.leftEditor.setValue(newVal);
    },
    newContent(newVal) {
      this.rightEditor.setValue(newVal);
    },
  },
  mounted() {
    this.initEditors();
    this.highlightDifferences();
  },
  methods: {
    initEditors() {
      this.leftEditor = CodeMirror.fromTextArea(this.$refs.leftEditor, {
        lineNumbers: true,
        readOnly: true,
      });
      this.rightEditor = CodeMirror.fromTextArea(this.$refs.rightEditor, {
        lineNumbers: true,
        readOnly: true,
      });

      this.leftEditor.setValue(this.oldContent);
      this.rightEditor.setValue(this.newContent);
    },
    markLineBackground(editor, start, end, className) {
      const startLine = start.line;
      const endLine = end.line;

      // 标记整个行的背景颜色
      for (let i = startLine; i <= endLine; i++) {
        editor.addLineClass(i, "background", className);
      }
    },
    highlightDifferences() {
      const diffs = this.dmp.diff_main(this.oldContent, this.newContent);
      this.dmp.diff_cleanupSemantic(diffs);

      let leftPos = 0;
      let rightPos = 0;
      // console.log('hs', diffs);
      diffs.forEach(([type, text]) => {
        const { length } = text;
        const leftStart = this.leftEditor.posFromIndex(leftPos);
        const rightStart = this.rightEditor.posFromIndex(rightPos);
        const leftEnd = this.leftEditor.posFromIndex(leftPos + length);
        const rightEnd = this.rightEditor.posFromIndex(rightPos + length);
        if (type === -1) {
          // 删除的内容，用红色标识
          this.leftEditor.markText(
            this.leftEditor.posFromIndex(leftPos),
            this.leftEditor.posFromIndex(leftPos + length),
            { className: "diff-deleted" }
          );
          this.markLineBackground(
            this.leftEditor,
            leftStart,
            leftEnd,
            "diff-deleted-line"
          );
          leftPos += length;
        } else if (type === 1) {
          // 新增的内容，用绿色标识
          this.rightEditor.markText(
            this.rightEditor.posFromIndex(rightPos),
            this.rightEditor.posFromIndex(rightPos + length),
            { className: "diff-added" }
          );
          this.markLineBackground(
            this.rightEditor,
            rightStart,
            rightEnd,
            "diff-added-line"
          );
          rightPos += length;
        } else {
          // 如果是相同内容，则只推进位置指针，无需标记
          leftPos += length;
          rightPos += length;
        }
        //  else {
        //   // 修改的内容，两边都用蓝色标识
        //   this.leftEditor.markText(
        //     this.leftEditor.posFromIndex(leftPos),
        //     this.leftEditor.posFromIndex(leftPos + length),
        //     { className: 'diff-modified' },
        //   );
        //   this.rightEditor.markText(
        //     this.rightEditor.posFromIndex(rightPos),
        //     this.rightEditor.posFromIndex(rightPos + length),
        //     { className: 'diff-modified' },
        //   );
        //   leftPos += length;
        //   rightPos += length;
        // }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.code-diff {
  display: flex;
  /deep/ .splitpanes__splitter {
    background: #ececec;
    width: 7px;
    cursor: ew-resize;
  }
  .code-container {
    // flex: 1;
    margin: 0 10px;
    // width: 50%;
    overflow: auto;
    // height: calc(100vh - 133px);
    /deep/ .CodeMirror {
      height: calc(100vh - 133px);
      .CodeMirror-scroll {
        height: calc(100vh - 133px);
        .diff-deleted-line {
          background-color: #ffdddd;
        }
        .diff-added-line {
          background-color: #ddffdd;
        }
        .diff-deleted {
          background-color: #ff0000;
        }
        .diff-added {
          background-color: #00ff00;
        }
      }
    }
  }
}
</style>
