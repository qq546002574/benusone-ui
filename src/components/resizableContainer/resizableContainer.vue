<template>
  <div
    class="resizable-container"
    :style="`width: ${width}px`"
    ref="resizableContainer"
  >
    <slot></slot>
    <div class="resizer" @mousedown="initResize"></div>
  </div>
</template>

<script>
export default {
  name: "bsResizableContainer",
  data() {
    return {
      startX: 0,
      startWidth: 300, // Default width
      minWidth: 100, // Minimum width
      maxWidth: 450, // Maximum width
    };
  },
  methods: {
    initResize(e) {
      this.startX = e.clientX;
      this.startWidth = parseInt(
        window.getComputedStyle(this.$refs.resizableContainer).width,
        10
      );
      document.addEventListener("mousemove", this.resize);
      document.addEventListener("mouseup", this.stopResize);
    },
    resize(e) {
      const newWidth = this.startWidth + (e.clientX - this.startX);
      if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
        this.$refs.resizableContainer.style.width = `${newWidth}px`;
      }
    },
    stopResize() {
      document.removeEventListener("mousemove", this.resize);
      document.removeEventListener("mouseup", this.stopResize);
    },
  },
};
</script>

<style scoped>
.resizable-container {
  /* width: 300px; */
  height: 100%;
  position: relative;
  /* overflow: hidden; */
}

.resizer {
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  cursor: ew-resize;
  /* z-index: 10; */
}
</style>
