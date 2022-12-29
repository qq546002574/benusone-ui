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
  </div>
</template>

<script>
import bsCarousel from "@/components/carousel"; // 引入
import bsCarouselItem from "@/components/carouselItem"; // 引入
import bsCascader from "@/components/cascader"; // 引入
import { testArr } from "@/test/test.js";
export default {
  components: {
    //注册插件
    bsCarousel,
    bsCarouselItem,
    bsCascader,
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
