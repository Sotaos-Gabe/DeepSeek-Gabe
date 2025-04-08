<template>
<div class="detail-container">
    <div style="padding: 5px; height: calc(100vh - 20px)">
      <el-row style="margin-bottom: 10px">
        <el-col :span="6"
          ><el-button 
          size="big"
          type="text" 
          style="color: black;"
          @click="back"
            >|<i class="el-icon-back el-icon--left"></i></el-button
          >
        </el-col>
        <el-col
          :span="18"
          style="text-align: right; display: flex; justify-content: flex-end">
        </el-col>
      </el-row>
    <el-row>
      <el-col :span="5" style="height: 100vh">
      </el-col>
      <el-col class="detail1" :span="14" style="height: calc(100vh - 80px)">
        <div style="height: 100%">
          <div class="chatContent">
            <div class="chatHistory" id="answer">
              <div
                class="con1"
                v-for="(
                  { query,create_time, answer, img_url, img_alt, img_size }, index
                ) in chatList"
              >
                <div class="con1a">
                  <!-- <img src="/cloud-1.svg" alt="" /> -->
                  <div class="con1a1">
                    <div class="con1a1a">
                      <div>{{ query }}</div>
                      <span style="color: rgb(132, 132, 132); font-size: 14px">
                        {{ create_time | formatDate }}</span>
                    </div>
                  </div>
                </div>
                <div class="con1b">
                  <!-- <img src="/robot-1.png" alt="" /> -->
                  <span style="margin-left: 30px; 
                  width: 80px;
                  font-size: 18px;
                  font-weight: bold;">
                    <i class="el-icon-chat-line-round" /> 回答
                  </span>
                  <div class="con1b1">
                    <div
                    v-highlight
                    v-html="
                      answer
                        ? answer
                        : loading && index + 1 === chatList.length
                        ? strLoading
                        : ''
                    "
                    >
                  </div>
                  <!-- <el-image
                    v-if="hasImg"
                    style="
                      width: 80px;
                      height: 80px;
                      border-radius: 8px;
                    "
                    :src="'data:image/*;base64,' + img_url"
                    :preview-src-list="['data:image/*;base64,' + img_url]"
                  >
                  </el-image> -->
                  <div style="width: 100%;" :class="{ hidden: img_url == '' }">
                    <el-button class="right-box" size="big" type="text" title="添加到素材库" @click="openAddToMaterial(img_alt,img_url,img_size)"
                      style="float: right;margin-right: 5px;">
                      <i class="el-icon-finished" />
                    </el-button>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="display: block;
                padding-left: 10px;
                padding-right: 10px;
                gap: 10px;">
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
                  placeholder="请在这里输入您的问题"
                  v-model="query"
                  resize="none"
                  @keydown.enter.native="keyDown"
                >
                </el-input>
                <div class="input2a_1">
                  <el-button
                    class="input2a2_1"
                    v-if="loading"
                    type="primary"
                    size="mini"
                    @click="stop"
                    >停止</el-button
                  >
                  <div v-else class="input2a2_1" @click="send()">
                    <div class="in">发送</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="5" style="height: 100vh;">
      </el-col>
    </el-row>
  </div>
  <el-dialog
      :title="'图片信息'"
      :visible.sync="visible"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
      >
        <el-form-item label="图片名称">
          <el-input
            v-model="form.file_name"
            placeholder="请输入图片名称。"
          />
        </el-form-item>
        <el-form-item label="标签名称">
          <el-input
            v-model="form.tags"
            placeholder="请输入标签名称，多个标签用逗号隔开！"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false"> 取 消 </el-button>
        <el-button
          size="small"
          type="primary"
          @click="addToMaterial"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import Vue from "vue";
// import { SSE } from "@/utils/sse";
import { marked } from "marked";
// import { getToken} from "@/utils/auth";
import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
import { chatSseRequset } from "@/api/docinfo.js";
import store from '@/store'
import { uploadFile } from "@/api/docinfo.js";
import { getUuid, getUuidStr } from "@/utils/uuid";
export default {
  name: "ask",
  components: { },
  data() {
    return {
      query: "",
      id: "",
      conversation_id: "",
      name: "",
      visible: false,
      chatList: [],
      loading: false,
      strLoading: `<div class="loading"><div></div><div></div><div></div></div>\r`,
      resultStr: "",
      queryString: '', // 搜索值
      querySave: '',
      position: {
        x: 300,
        y: 200
      },// 弹窗显示位置
      form: {
        file_name: '',
        file_id: '',
        tags: '',
        category: 'image',
        file_url: '',
        file_size: 0,
      }
    };
  },
  created() {
    console.log("=======================created=============================");
    const conversation_id = this.$route.query.conversation_id;
    const askType = this.$route.query.askType;
    if (conversation_id && conversation_id != "" && askType) {
      this.conversation_id = conversation_id;
      this.getAskHistoryRecords();
    }
  },
  methods: {
    getAskHistoryRecords() {
      this.$request({
        url: "/tech/api/yao/ask/getUserHistoryConversationRecords",
        method: "get",
        params: { conversation_id: this.conversation_id },
      })
      .then(({ code,data }) => {
        if (code == 200) {
          for (let i = 0; i < data.length; i++) {
            const answer = JSON.parse(data[i].answer);
            const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
            debugger
            console.log(answer, "answer");
            const answer_data = answer[0].answer;
            const pattern = /!\[.*?\]\((.*?)\s*(\"(?:.*[^"])\"|'.*[^']')?\)/g;
            let match;
            const patternAlt = /!\[(.*?)\]\(.*?\)/g;
            let matchAlt;
            let img_alt = '';
            while ((matchAlt = patternAlt.exec(answer_data)) !== null) {
                console.log(matchAlt[1]); // match[1] 是alt文本
                img_alt = matchAlt[1];
            }
            let img_url = '';
            while ((match = pattern.exec(answer_data)) !== null) {
                console.log(match[1]); 
                img_url = match[1];
            }
            const patternSize = /(\d+)\s*(字节|Bytes|bytes|KB|Kilobytes|MB|Megabytes|GB|Gigabytes)/;
            const matchSize = answer_data.match(patternSize);
            let img_size = '';
            if (matchSize) {
                const size = matchSize[1]; // 匹配到的数字部分
                const unit = matchSize[2]; // 匹配到的单位部分
                img_size = size;
                console.log(`图片大小为：${size} ${unit}`);
            } else {
                console.log("未找到图片大小信息");
            }
            var html1 = md.render(answer_data);
            console.log(html1, "html1");
            html1 = html1.replace(/<img/g, '<img style="max-width: 100%;height: auto;"');
            data[i].answer = html1;
            data[i].img_url = img_url;
            data[i].img_alt = img_alt;
            data[i].img_size = img_size;
          }
          this.chatList = data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    back() {
      this.$router.replace({
        path: `/frontpage`,
      });
    },
    stop() {
      this.resultStr = "";
      this.loading = false;
      console.log("=======================stop=============================");
    },
    send() {
      let extra = null;
      if (!this.query.trim() && !extra)
        return this.$toast.show("请输入内容！", undefined, true);
      this.loading = true;
      this.resultStr = "";
      this.chatList = [
          ...this.chatList,
          {
            query: this.query,
            create_time: new Date(),
            answer: "",
            ...(extra || {}),
          },
        ];
      this.connectToChatSSE("4");
    },
    connectToChatSSE(ask_type) {
      this.loading = true;
      const json = {
        query: this.query,
        ask_type: ask_type,
        conversation_id: this.conversation_id,
      }
      this.query = "";
      console.log("=======================connectToChatSSE=============================");
      chatSseRequset(json, this.successCallback, this.errCallback);
    },
    successCallback(msg) {
      if (msg.event == "stop") {
        this.stopCallback();
      }else {
        // this.loading = false;
        if (msg.data.includes('conversation_id')) {
          const data = JSON.parse(msg.data);
          if (data.event.includes("message") && data.event != "message_end") {
            this.resultStr += data.answer;
            this.conversation_id = data.conversation_id;
            this.$set(this.chatList, this.chatList.length - 1, {
              ...this.chatList[this.chatList.length - 1],
              answer: this.resultStr,
              img_url: '',
            });
          } else if (data.event == "node_started") {
            this.nodes = [
              ...this.nodes,
              {
                node_id: data.node_id,
                title: data.title,
                node_type: data.node_type,
                status: "processing",
                elapsed_time: 0,
              },
            ];
          } else if (data.event == "node_finished") {
            this.$set(this.nodes, this.nodes.length - 1, {
              ...this.nodes[this.nodes.length - 1],
              status: data.status,
              elapsed_time: data.elapsed_time,
            });
          }
        }
      }
    },
    stopCallback() {
      this.loading = false;
      const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
      console.log(this.resultStr, "this.resultStr");
      const pattern = /!\[.*?\]\((.*?)\s*(\"(?:.*[^"])\"|'.*[^']')?\)/g;
      let match;
      const patternAlt = /!\[(.*?)\]\(.*?\)/g;
      let matchAlt;
      let img_alt = '';
      while ((matchAlt = patternAlt.exec(this.resultStr)) !== null) {
          console.log(matchAlt[1]); // match[1] 是alt文本
          img_alt = matchAlt[1];
      }
      let img_url = '';
      while ((match = pattern.exec(this.resultStr)) !== null) {
          console.log(match[1]); 
          img_url = match[1];
      }
      const patternSize = /(\d+)\s*(字节|Bytes|bytes|KB|Kilobytes|MB|Megabytes|GB|Gigabytes)/;
      const matchSize = this.resultStr.match(patternSize);
      let img_size = '';
      if (matchSize) {
          const size = matchSize[1]; // 匹配到的数字部分
          const unit = matchSize[3]; // 匹配到的单位部分
          img_size = size;
          console.log(`图片大小为：${size} ${unit}`);
      } else {
          console.log("未找到图片大小信息");
      }
      var html1 = md.render(this.resultStr);
      html1 = html1.replace(/<img/g, '<img style="max-width: 100%;height: auto;"');
      const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"")
      
      this.$set(this.chatList, this.chatList.length - 1, {
          ...this.chatList[this.chatList.length - 1],
          answer: html,
          img_url: img_url,
          img_alt: img_alt,
          img_size: img_size
        });
      this.stop();
    },
    errCallback(err) {
      this.stop();
      console.log(err, "---");
    },
    keyDown(e) {
      if (this.showDialog) {
        e.preventDefault();
      }else if (!e.shiftKey && !this.loading) {
        this.send();
        e.preventDefault();
      }
    },
    scrollBottom() {
      this.$nextTick(() => {
        const ele = document.getElementById("answer");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    // 隐藏选择框
    handleHide () {
      this.showDialog = false
    },
    // 显示选择框
    handleShow () {
      this.showDialog = true
    },
    openAddToMaterial(img_alt,img_url,img_size) {
      this.visible = true;
      this.form = {
        file_name: img_alt+'.jpeg',
        file_id: getUuidStr(),
        tags: '',
        file_url: img_url,
        category: 'image',
        file_size: Number(img_size)
      }
    },
    addToMaterial() {
      this.$request({
            url: "/tech/api/yao/resource/saveDocUrls",
            method: "post",
            data: {files:[this.form]},
          }).then((res) => {
          if (res.code === 200) {
            this.form = {
              file_name: '',
              file_id: '',
              tags: '',
              category: 'image',
              file_url: '',
              file_size: 0
            }
            this.visible = false;
            this.$message({
              message: "文件添加成功!",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  watch: {
    loading(value) {
      this.scrollBottom();
    },
    chatList() {
      this.scrollBottom();
    },
  },
  // beforeUnmount() {
  //   this.resultStr = "";
  // },
  // mounted() {
  //   document.addEventListener("visibilitychange", function logData() {
  //     if (document.visibilityState === "hidden") {
  //       this.resultStr = "";
  //     }
  //   });
  // },
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
.base-divider {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
.custom-radio {
  padding-top: 20px;
  padding-right: 30px;
  position: relative;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  color: #cfcaca;
}

.custom-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-button {
  // position: absolute;
  // top: 0;
  // left: 0;
  // height: 25px;
  width: 100%;
  // background-color: #eee;
  // border-radius: 50%;
}

// .custom-radio:hover input ~ .radio-button {
//   background-color: #ccc;
// }

.custom-radio input:checked ~ .radio-button {
  // background-color: #cacdcf;
  color: #000;
}

.disabled {
  pointer-events: none; /* 禁用鼠标事件 */
  opacity: 0.5; /* 降低透明度，表示禁用状态 */
}
.hidden {
  display: none;
}
// .custom-radio input:checked ~ .radio-button:after {
//   content: "";
//   display: block;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   // width: 12px;
//   // height: 12px;
//   // border-radius: 50%;
//   background-color: white;
// }
</style>

