<template>
  <div id="app" class="flex">
    <bsBaseQrcode content="https://qq546002574.github.io/" />
  </div>
</template>

<script>
import bsCarousel from "@/components/carousel"; // 引入
import bsCarouselItem from "@/components/carouselItem"; // 引入
import bsCascader from "@/components/cascader"; // 引入
import bsBaseForm from "@/components/baseForm"; // 引入
import bsBaseQrcode from "@/components/baseQrcode"; // 引入
import bsCodeEdit from "@/components/codeEdit"; // 引入
import bsResizableContainer from "@/components/resizableContainer"; // 引入
import bsCcodeDiff from "@/components/codeDiff";

import { testArr } from "@/test/test.js";

export default {
  components: {
    //注册插件
    bsCarousel,
    bsCarouselItem,
    bsCascader,
    bsBaseForm,
    bsBaseQrcode,
    bsCodeEdit,
    bsResizableContainer,
    bsCcodeDiff,
  },
  name: "app",
  data() {
    return {
      checkIndex: 1,
      checkIndex2: 2,
      cascader: [],
      cascaderProps: {
        placeholder: "请选择",
        clearable: true,
        labelKey: "labelKey",
        valueKey: "valueKey",
        value: [],
        collapseTags: true,
        options: testArr,
        filterable: true,
      },
      searchConfig: {
        colNum: 6,
        props: { "label-width": "100px" },
        formItem: {
          key0: {
            props: { label: "字段1" },
            items: [
              {
                type: "input",
                props: { placeholder: "字段1", clearable: true },
              },
            ],
          },
          key1: {
            props: { label: "字段1" },
            items: [
              {
                dictName: true,
                type: "select",
                props: { placeholder: "全部", clearable: true },
                options: {
                  data: [],
                },
              },
            ],
          },
          operateDate: {
            props: { label: "日期" },
            items: [
              {
                type: "daterange",
                props: {
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  clearable: true,
                  style: { width: "100% !important", display: "flex" },
                },
              },
            ],
          },
        },
      },
      // oldStr: "",
      // newStr: "",
      diffCode: "",
      isJson: false,
      isXml: false,
    };
  },
  created() {},
  methods: {
    onChange() {},
    sleep(time) {
      // eslint-disable-next-line no-promise-executor-return
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    // 解法一 PromiseAll
    async handleClick() {
      Promise.all([
        this.handleClick2,
        this.handleClick3,
        this.handleClick4,
      ]).then((it) => {
        console.log("hs ", it[0](), it[1](), it[2](3));
      });
      // await this.handleClick2();
      // console.log('HS', this.checkIndex, this.checkIndex2);
    },
    // 这里我用 sleep 提代接口演示
    // async handleClick() {
    //     await this.handleClick2();
    //     console.log('HS', this.checkIndex, this.checkIndex2);
    // },
    async handleClick2() {
      await this.sleep(3000);
      this.checkIndex = 1;
      this.checkIndex2 = 1;
      console.log("HS2", this.checkIndex, this.checkIndex2);
      // await this.handleClick3();
    },
    async handleClick3() {
      await this.sleep(3000);
      this.checkIndex = 2;
      this.checkIndex2 = 2;
      console.log("HS3", this.checkIndex, this.checkIndex2);
      // await this.handleClick4(3);
    },
    async handleClick4(a) {
      await this.sleep(3000);
      this.checkIndex = a;
      this.checkIndex2 = a;
      console.log("HS4", this.checkIndex, this.checkIndex2);
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.test {
  height: 300px;
  width: 100%;
  background: #000;
}
</style>
