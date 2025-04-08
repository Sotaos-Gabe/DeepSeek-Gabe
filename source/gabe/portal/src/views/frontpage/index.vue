<template>
    <div class="home-container">
      <el-row>
        <el-col :span="24" style="height: 100vh">
          <el-row>
            <el-col :span="6" style="height: 100vh">

            </el-col>
            <el-col class="detail1" :span="11" style="height: 100vh">
              <el-row style="height: 30%;">

              </el-row>
              <el-row>
                <div style="height: 100%">
                <div style="padding: 20px; height: calc(100% - 50px);">
                  <div class="detail1a">
                    <div style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding-left: 10px;
                            padding-right: 10px;
                            gap: 10px;
                          " ><h1>Gabe <span style="color: rgb(50 156 208);">Ask</span></h1></div>
                    <div class="chatContent">
                        <div
                          id="message_input"
                          class="input2"
                          style="
                            display: flex;
                            align-items: center;
                            padding-left: 10px;
                            padding-right: 10px;
                            gap: 10px;
                          "
                        >
                          <el-input
                            ref="input"
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 7 }"
                            placeholder="提出问题..."
                            v-model="query"
                            resize="none"
                            @keydown.enter.native="keyDown"
                          >
                          </el-input>
                          <el-button
                            size="small"
                            type="text"
                            style="padding: 0px;"
                            @click="send()"
                              ><svg-icon icon-class="guide" style="height: 20px; width: 40px" />
                          </el-button>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; padding-left: 10px; padding-right: 10px; gap: 10px;">
                      <el-button v-for="({id, name, icon, desc, url},index) in funcPageDatas" :key="id"
                        style="display:grid;"
                        size="big"
                        type="text"
                        @click="openFuncPage(url)"
                        >
                        <div class="card" >
                          <!-- <i :class="icon" /> -->
                          <el-image
                            :src="icon"
                          />
                        </div>
                        <span style="font-size: 13px; color: rgb(112 110 110);">{{ name }}</span>
                        <!-- <el-tooltip :content="desc" placement="top">

                        </el-tooltip> -->
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              </el-row>

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
        funcPageDatas:[
          {id: 1, name: "课件生成", icon: "/ppt.jpg", desc: "通过模板生成课件", url: "/ppt"},
          {id: 2, name: "图片生成", icon: "/image.jpeg", desc: "图片生成", url: "/imagegen"},
        ],
      };
    },
    methods: {
      send() {
        if (!this.query.trim() && !extra)
          return this.$toast.show("请输入内容！", undefined, true);
        this.loading = true;
        this.$router.push({
          path: `/ask`,
          query: { query: this.query },
        });
      },
      keyDown(e) {
        if (!e.shiftKey) {
          this.send();
          e.preventDefault();
        }
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
    padding: 16px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #f6f4f3;
  }
  </style>

