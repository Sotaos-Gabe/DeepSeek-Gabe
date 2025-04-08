<template>
  <div class="toast-container" v-if="visible">
    <img :src="getImg(isError ? '2' : '1')" alt="" />
    <div class="toast1">{{ message }}</div>
  </div>
</template>

<script>
import Vue from "vue";

const getImg = (url) => require(`./images/chat${url}.png`);
export default {
  name: "toast",
  data() {
    return {
      visible: false,
      timer: null,
      message: "",
      isError: false,
    };
  },
  mounted() {},
  methods: {
    getImg,
    show(message, time = 1500, isError = false) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.isError = isError;
      this.visible = true;
      this.message = message || "复制成功！";
      this.timer = setTimeout(() => {
        this.visible = false;
        clearTimeout(this.timer);
      }, time);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
@import "@/styles/theme.scss";
@import "./index.scss";
</style>
