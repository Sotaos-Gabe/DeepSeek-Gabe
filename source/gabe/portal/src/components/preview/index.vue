<template>
  <div class="preview-container" v-if="url">
    <div class="preview3">
      <div class="preview4">
        <div class="preview1" @click.stop="hide">
          <img :src="getImg('1')" alt="" />
        </div>
        <img :src="url" alt="" class="preview2" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import { getList } from "@/api/guide";
// import guide from "@/components/guide/index.vue";
const getImg = (url) => require(`./images/chat${url}.png`);
export default {
  name: "msg",
  data() {
    return {
      url: "",
    };
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) {
        this.hide();
      }
    });
  },
  // 销毁组件
  destroyed() {
    window.removeEventListener("keydown");
  },
  methods: {
    getImg,
    show(url) {
      this.url = url;
    },
    hide() {
      this.url = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
@import "@/styles/theme.scss";
@import "./index.scss";
</style>
