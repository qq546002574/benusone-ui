<template>
  <section class="bs-carousel">
    <div class="bs-carousel-main">
      <!-- 轮播图片数量可自行增减 -->
      <ul
        ref="ul"
        :class="{'is-transtion': isTransion}"
        :style="{width: alength*100 + 'vw'}"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        >
          <slot></slot>
      </ul>
    </div>
  </section>
</template>

<script>
import { findComponentsDownward } from '../../utils/getDom';
export default {
  name: "bs-carousel",
  model: {
    prop: "value",
    event: "input"
  },
  provide () {
      return { bsCarousel: this };
  },
  props: {
    value: {
      type: Number | String,
      default: 1,
    },
    // 模板数量
    moveLen: {
      type: Number,
      default: 50,
    },
    // loading: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  data() {
    return {
      alength: 0,
      selectIndex: 0,
      startClientX: 0,
      moveClientX: 0,
      clientWidth: 0,
      currentMoveClientX: 0,
      isTransion: false
    };
  },
  watch: {
    value(val) { // 重置
      console.log('val', val);
      if (val == 1) {
        this.currentMoveClientX = Math.round(this.clientWidth*0.16*100)/100;
        this.$refs.ul.style.transform = `translateX(${this.currentMoveClientX}px)`;
        this.selectIndex = JSON.stringify(JSON.parse(val));
        const items = findComponentsDownward(this, 'bs-carousel-item'); // 查找所有的子节点
        const active = items.find(element => {
          return element.name == parseInt(this.selectIndex);
        });
        const next = items.find(element => {
          return element.name == parseInt(this.selectIndex) + 1;
        });
        active.$el.style.transform = `scale(1)`;
        next.$el.style.transform = `scale(0.85)`;
      }
    }
  },
  created() {
    this.clientWidth = document.body.clientWidth;
    this.currentMoveClientX = Math.round(this.clientWidth*0.16*100)/100;
  },
  mounted() {
    const items = findComponentsDownward(this, 'bs-carousel-item'); // 查找所有的子节点
    this.alength = items.length;
    this.selectIndex = JSON.stringify(JSON.parse(this.value));
  },
  methods: {
    isLoading() {
      return this.isTransion;
    },
    touchStart(event) {
      this.startClientX = event.targetTouches[0].clientX;
      // console.log('touchstart', event.targetTouches[0]);
    },
    touchMove(event) {
      const that = this;
      // 记录X方向移动距离
      that.moveClientX = event.targetTouches[0].clientX - that.startClientX;

      // console.log(that.moveClientX)
      // 如果是第一个或者最后一个、或者正在过渡，做出对应判断
      if ((that.value == 1 && that.moveClientX > 0) || (that.value == that.alength && that.moveClientX < 0) || that.isTransion) {
        that.moveClientX = 0;
        return;
      }
      // 获取当前上一个值、选中值和下一个值
      const items = findComponentsDownward(this, 'bs-carousel-item'); // 查找所有的子节点
      const active = items.find(element => {
        return element.name == this.value;
      });
      const prev = items.find(element => {
        return element.name == this.value - 1;
      });
      const next = items.find(element => {
        return element.name == this.value + 1;
      });
      // 如果移动距离小于屏幕宽度，做以下处理
      if (Math.abs(that.moveClientX) < that.clientWidth) {
        const halfClientWidth = parseInt(that.clientWidth/2);

        // 如果移动距离未达到屏幕宽度的一半
        if (Math.abs(that.moveClientX) < halfClientWidth) {

          const scale = (Math.abs(that.moveClientX/halfClientWidth)) * 0.15;
          active.$el.style.transform = `scale(${1 - scale})`;

          // 如果是向左滑动，则改变下一个值的scale
          if (that.moveClientX < 0) {
            if (next) {
              next.$el.style.transform = `scale(${0.85 + scale})`;
            }
          } else { // 如果是向右滑动，则改变上一个值的scale
            if (prev) {
              prev.$el.style.transform = `scale(${0.85 + scale})`;
            }
          }
        } else {
          active.$el.style.transform = `scale(0.85)`;

          // 如果是向左滑动，则改变下一个值的scale
          if (that.moveClientX < 0) {
            if (next) {
              next.$el.style.transform = `scale(1)`;
            }
          } else { // 如果是向右滑动，则改变上一个值的scale
            if (prev) {
              prev.$el.style.transform = `scale(1)`;
            }
          }
        }
        // console.log(that.moveClientX);
        // that.$refs.ul.style.transform = `translate3d(${that.currentMoveClientX + that.moveClientX}px, 0px, 0px)`;
        that.$refs.ul.style.transform = `translateX(${that.currentMoveClientX + that.moveClientX}px)`;
      }
    },
    touchEnd() {
      const that = this;
      // console.log('touchend', that.moveClientX);

      // 如果移动的距离大于100
      if (Math.abs(that.moveClientX) > that.moveLen) {

        // 获取屏幕宽度一半，并且判断向那个方向移动
        let x = parseInt(that.clientWidth*0.68);
        if (that.moveClientX < 0) {
          x = -parseInt(that.clientWidth*0.68);
        }
        if (that.moveClientX < 0) {
          that.selectIndex++;
        } else {
          that.selectIndex--;
        }
        that.$nextTick(() => {
          that.isTransion = true;
          const items = findComponentsDownward(this, 'bs-carousel-item');
          const active = items.find(element => {
            return element.name == this.selectIndex;
          });
          const prev = items.find(element => {
            return element.name == this.selectIndex - 1;
          });
          const next = items.find(element => {
            return element.name == this.selectIndex + 1;
          });
          active.$el.style.transform = `scale(1)`;
          if (that.moveClientX < 0) {
            if (prev) {
              prev.$el.style.transform = `scale(0.85)`;
            }
          } else {
            if (next) {
              next.$el.style.transform = `scale(0.85)`;
            }
          }
          // that.$refs.ul.style.transform = `translate3d(${that.currentMoveClientX + x}px, 0px, 0px)`;
          that.$refs.ul.style.transform = `translateX(${that.currentMoveClientX + x}px)`;
          that.currentMoveClientX = that.currentMoveClientX + x;
          that.moveClientX = 0;
          setTimeout(() => {
            that.isTransion = false;
          }, 500);
          that.$emit('input', active.name);
        })
      }
      // 如果移动距离小于100
      if (Math.abs(that.moveClientX) < that.moveLen && that.moveClientX != 0){
        that.$nextTick(() => {
          that.isTransion = true;
          const items = findComponentsDownward(this, 'bs-carousel-item');
          const active = items.find(element => {
            return element.name == this.value;
          });
          const prev = items.find(element => {
            return element.name == this.value - 1;
          });
          const next = items.find(element => {
            return element.name == this.value + 1;
          });
          active.$el.style.transform = `scale(1)`;
          if (that.moveClientX < 0) {
            if (next) {
              next.$el.style.transform = `scale(0.85)`;
            }
          } else {
            if (prev) {
              prev.$el.style.transform = `scale(0.85)`;
            }
          }
          // that.$refs.ul.style.transform = `translate3d(${that.currentMoveClientX}px, 0px, 0px)`;
          that.$refs.ul.style.transform = `translateX(${that.currentMoveClientX}px)`;
          that.moveClientX = 0;
          setTimeout(() => {
            that.isTransion = false;
          }, 500);
          that.$emit('input', active.name);
        })
      }
    },
  }
};
</script>

<style lang="less" scoped>
.bs-carousel {
  &-main{
      position: absolute;
      left: 0;
      top: 10vh;
      overflow: hidden;
      width: 100vw;
      .is-transtion {
          transition: transform 0.5s;
      }
      ul {
          touch-action: none;
          transition-duration: 0ms;
          // transform: translate3d(25vw, 0px, 0px);
          transform: translateX(16vw);
          position: relative;
          width: 5000vw;
          height: 100%;
          z-index: 1;
          display: flex;
          transition-property: transform;
          box-sizing: content-box;

      }
  }
}

</style>
