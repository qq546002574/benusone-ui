<template>
  <div :class="prefixCls" class="bs-carousel-item">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "bs-carousel-item",
  inject: ["bsCarousel"],
  props: {
    name: {
      type: String | Number,
    },
  },
  data() {
    return {};
  },
  computed: {
    prefixCls() {
      return {
        active: this.name == this.bsCarousel.value,
        "is-transtion": this.bsCarousel.isTransion,
      };
    },
  },
  methods: {},
  watch: {},
  mounted() {},
  destroyed() {},
};
</script>

<style lang="less" scoped>
.bs-carousel-item {
  overflow: hidden;
  width: 68vw;
  // height: 56vh;
  list-style: none;
  font-size: 18px;
  transform-style: preserve-3d;
  -webkit-overflow-scrolling: touch;
  transform: scale(0.85);
}
.bs-carousel-item.active {
  transform: scale(1);
}
.bs-carousel-item.is-transtion {
  transition: transform 0.5s;
}
// .bs-carousel-item.prev, .bs-carousel-item.next{
//   transform: scale(0.8);
// }
</style>
