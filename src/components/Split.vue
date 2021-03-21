<template>
  <div class="split-wrap" @mouseup="releaseMousePointer()">
    <div class="split-left" :style="{ width: ratio }">
      <slot name="left"></slot>
    </div>
    <div class="split" @mousedown="bindMousePointer($event)"></div>
    <div class="split-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped>
.split-wrap {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.split-left {
  height: 100%;
  overflow: auto;
  flex-shrink: 0;
}

.split-right {
  flex-grow: 1;
  height: 100%;
  overflow: auto;
}

.split {
  background: darkgrey;
  height: 100%;
  width: 0.3em;
  cursor: grab;
}
</style>

<script>
export default {
  name: "Split",
  data() {
    return {
      listener: null,
      target: null,
      ratio: (this.initRatio * 100).toString() + "%"
    };
  },
  props: {
    minLeft: Number,
    minRight: Number,
    initRatio: Number
  },
  methods: {
    bindMousePointer(event) {
      const splitWrap = event.target.parentElement;
      this.target = splitWrap;
      var domRect = splitWrap.getBoundingClientRect();
      var setRatio = ratio => {
        console.log(ratio);
        const r =
          Math.max(this.minLeft, Math.min(ratio, 1 - this.minRight)) * 100;
        this.ratio = r.toString() + "%";
      };
      this.listener = e => {
        setRatio((e.clientX - domRect.x) / domRect.width);
      };
      this.target.addEventListener("mousemove", this.listener, false);
    },
    releaseMousePointer() {
      if (this.target !== null) {
        this.target.removeEventListener("mousemove", this.listener, false);
      }
    }
  }
};
</script>
