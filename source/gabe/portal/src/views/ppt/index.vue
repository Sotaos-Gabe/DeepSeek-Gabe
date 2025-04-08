<template>
    <div class="home-container">
      <el-button 
        size="big"
        type="text" 
        style="color: black;padding-top: 10px;padding-left: 10px;"
        @click="back"
          >|<i class="el-icon-back el-icon--left"></i>
      </el-button>
      <el-row>
        <el-col :span="24" style="height: 100vh">
          <el-row>
            <el-col :span="6" style="height: 100vh">
              
            </el-col>
            <el-col class="detail1" :span="11" style="height: 100vh">
              <div style="height: 100%;width: 100%;display: flex;vertical-align: middle;align-items: center; justify-content: center; padding-left: 10px; padding-right: 10px; gap: 10px;">
                <el-button v-for="({id, name, icon, desc, url},index) in funcPageDatas" :key="id"
                  style="display:grid;"
                  size="big" 
                  type="text" 
                  @click="openFuncPage(url)"
                  >
                  <div class="card" >
                    {{ name }}
                  </div>
                  <!-- <div class="sphere-container">
                    <div class="sphere">
                      {{ name }}
                    </div>
                  </div> -->
                </el-button>
              </div>
            </el-col>
            <el-col :span="4" style="height: 100vh">
  
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </template>
  <script>
  import Vue from "vue";
  export default {
    name: "FrontPage",
    data() {
      return {
        query: "",
        loading: false,
        funcPageDatas:[{id: 1, name: "新课件生成", icon: "el-icon-printer", desc: "通过模板生成课件", url: "/ppt/gen"},
        {id: 2, name: "已生成的课件大纲", icon: "el-icon-document-copy", desc: "查看课件大纲", url: "/ppt/outline"},
        {id: 3, name: "已生成的课件", icon: "el-icon-document", desc: "查看课件", url: "/ppt/pptList"},
        // {id: 4, name: "素材库", icon: "el-icon-document", desc: "查看素材库", url: "/ppt/material"}
        ],
      };
    },
    methods: {
      back() {
        this.$router.replace({
          path: `/frontpage`,
        });
      },
      openFuncPage(url) {
        this.$router.push({
          path: url,
        });
      }
    },
    created() {
      this.query = "";
      this.loading = false;
    },
  };
</script>
<style lang="scss" scoped>
@import "@/styles/dark-light.scss";
@import "@/styles/theme.scss";
@import "@/styles/chat.scss";
.home-container {
  background-color: #fafafa;
}
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
.detail1 ::v-deep .el-card__body {
  height: 100%;
}
.detail1a {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}
.wrapper {
  width: 238px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-sizing: border-box;
  padding: 6px 0;
}
.empty{
  font-size: 14px;
  padding: 0 20px;
  color: #999;
}
.item {
  font-size: 14px;
  padding: 0 20px;
  line-height: 34px;
  cursor: pointer;
  color: #606266;
  &.active {
    background: #f5f7fa;
    color: blue;
    .id {
      color: blue;
    }
  }
  &:first-child {
    border-radius: 5px 5px 0 0;
  }
  &:last-child {
    border-radius: 0 0 5px 5px;
  }
  .id {
    font-size: 12px;
    color: rgb(83, 81, 81);
  }
}
.editor {
  margin: 0 auto;
  width: 600px;
  height: 150px;
  background: #fff;
  border: 1px solid blue;
  border-radius: 5px;
  text-align: left;
  padding: 10px;
  overflow: auto;
  &:focus {
    outline: none;
  }
}
.card {
  padding: 65px 16px 16px 16px;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  font-size: 15px; 
  color: rgb(112 110 110);
  background-color: #f6f4f3;
}
.sphere-container {
  width: 200px;
  height: 200px;
  position: relative;
  margin: 50px auto;
  perspective: 1000px;
}

.sphere {
  padding: 95px 16px 16px 16px;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.8), rgba(0, 74, 143, 0.8)); /* 晶莹剔透的蓝色渐变 */
  border-radius: 50%; /* 使形状为圆形 */
  box-shadow: 
    inset 0 0 20px rgba(255, 255, 255, 0.5), /* 内部高光 */
    0 0 30px rgba(0, 123, 255, 0.5); /* 外部阴影 */
  transform: rotateX(0deg) rotateY(0deg);
  transition: transform 0.5s ease;
}

.sphere:hover {
  transform: rotateX(20deg) rotateY(20deg);
}
  </style>
  
  