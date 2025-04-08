<template>
    <div class="detail-container">
      <div style="height: 100vh;">
      <el-row>
        <el-col :span="3" style="height: calc(100vh - 40px)">
          
        </el-col>
        <el-col class="detail1" :span="18" style="height: calc(100vh - 40px)">
          <div style="height: calc(100vh - 40px);padding-left: 20px; overflow: auto;background-color: rgb(251, 251, 251);" v-html="html">
          </div>
        </el-col>
        <el-col :span="3" style="height: calc(100vh - 40px)">
  
        </el-col>
      </el-row>
    </div>
  </div>
  </template>
  <script>
  import Vue from "vue";
  // import { marked } from "marked";
  import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
  export default {
    name: "StaffShareUse",
    data() {
      return {
        id: "",
        html: "",
      };
    },
    created() {
      this.id = this.$route.params.id;
      this.getReport();
    },
    methods: {
        getReport() {
            this.$request({
            url: "/tech/virtualStaff/reportShareInfo",
            method: "get",
            params: { id: this.id },
            })
            .then(({ data }) => {
              const md = require('markdown-it')({
                html: true,
                linkify: true,
                typographer: true
              }).use(markdownItMermaid);
              // var html = marked(data.content);
              // var html1 = md.render(data.content).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">');
              // this.html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">')
              var html1 = md.render(data.content)
              this.html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">')
            })
            .catch(() => {
            })
            .catch(() => {});
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  @import "@/styles/dark-light.scss";
  @import "@/styles/theme.scss";
  @import "@/styles/chat.scss";
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .detail-container {
    height: 100vh;
  }
  .detail1 ::v-deep .el-card__body {
    height: 100%;
  }
  .detail1a {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
  }
  .detail1a2 {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    width: 100%;
  }
  .detail1a3 {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    width: 100%;
  }
  .detail1a1 {
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
    gap: 20px;
  }
  .chatHistory {
    flex: 1;
    overflow: auto;
  }
  .chatContent {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
  }
  .playContainer {
    width: 100%;
    height: 400px;
    cursor: pointer;
    margin: 0 auto;
  }
  </style>
  
  