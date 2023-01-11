<template>
  <div id="app">
    <h2>calculate</h2>
    <!-- <bs-carousel v-model="checkIndex">
      <bs-carousel-item name="1">
        <img src="./assets/logo.png" />
      </bs-carousel-item>
      <bs-carousel-item name="2">
        <img src="./assets/logo.png" />
      </bs-carousel-item>
    </bs-carousel> -->
    <bs-cascader
      v-model="cascader"
      v-on="{ ...onChange }"
      v-bind="{ ...cascaderProps }"
    ></bs-cascader>
    <bsBaseForm ref="searchForm" :config="searchConfig" />
    <baseQrcode content="https://qq546002574.github.io/#/login"/>
  </div>
</template>

<script>
import bsCarousel from "@/components/carousel"; // 引入
import bsCarouselItem from "@/components/carouselItem"; // 引入
import bsCascader from "@/components/cascader"; // 引入
import bsBaseForm from "@/components/baseForm"; // 引入
import baseQrcode from "@/components/baseQrcode"; // 引入

import { testArr } from "@/test/test.js";
export default {
  components: {
    //注册插件
    bsCarousel,
    bsCarouselItem,
    bsCascader,
    bsBaseForm,
    baseQrcode
  },
  name: "app",
  data() {
    return {
      checkIndex: 1,
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
    };
  },
  methods: {
    onChange() {},
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
</style>
