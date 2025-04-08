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
                  { query,create_time, answer, img_url, doc_fragment, data_source }, index
                ) in chatList"
              >
                <div v-if="index == 0" class="con1a">
                  <!-- <img src="/cloud-1.svg" alt="" /> -->
                  <div class="con1a1">
                    <div class="con1a1a">
                      <el-image
                        v-if="img_url"
                        style="
                          width: 80px;
                          height: 80px;
                          border-radius: 8px;
                        "
                        :src="img_url"
                        :preview-src-list="[img_url]"
                      >
                      </el-image>
                      <div>{{ query }}</div>
                      <span style="color: rgb(132, 132, 132); font-size: 14px">
                        {{ create_time | formatDate }}
                      </span>
                      <div style="display: flex;">
                        <label class="custom-radio">
                          <input type="radio" value="knowledgebase" :disabled="loading" v-model="selectedOption" @click="openKnowledgeBaseBtn">
                          <span class="radio-button"><i class="el-icon-notebook-1 el-icon--left"></i>基于知识库</span>
                        </label>
                        <label class="custom-radio">
                          <input type="radio" value="network" :disabled="loading" v-model="selectedOption" @click="openNetworkBtn">
                          <span class="radio-button"><i class="el-icon-discover el-icon--left"></i>基于网络</span>
                        </label>
                      </div>
                      <hr class="base-divider"/>
                    </div>
                  </div>
                </div>
                <div v-else class="con1a">
                  <!-- <img src="/cloud-1.svg" alt="" /> -->
                  <div class="con1a1">
                    <div class="con1a1a">
                      <el-image
                        v-if="img_url"
                        style="
                          width: 80px;
                          height: 80px;
                          border-radius: 8px;
                        "
                        :src="img_url"
                        :preview-src-list="[img_url]"
                      >
                      </el-image>
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
                  <!-- <div
                    v-for="({title,node_type, status, elapsed_time}, index) in nodes"
                    :key="index"
                    style="display: flex;"
                  >
                    <div style="margin-left: 30px; margin-top: 10px; width: 80px; font-size: 14px; font-weight: bold;">
                      <i class="el-icon-chat-line-round" /> {{ title }}
                    </div>

                  </div> -->
                  <div class="con1b1">
                    <div
                    v-highlight
                    v-html="
                      answer
                        ? answer
                        : loading && index + 1 === chatList.length
                        ? strLoading
                        : '<p>暂无数据</p>'
                    "
                    ></div>
                    <div v-show="doc_fragment && !loading" style="display: flex; float:right">
                      <el-tooltip content="答案分段" placement="top">
                        <el-button
                          size="small"
                          type="text"
                          @click="openDocFragment(doc_fragment)"
                        >
                          分段
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="原文件段落" placement="top">
                        <el-button
                          size="small"
                          type="text"
                          @click="openDataSource(data_source)"
                        >
                          数据源
                        </el-button>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="suggestedQuestionList && suggestedQuestionList.data && suggestedQuestionList.data.length>0" style="margin-top: 80px;padding-bottom: 20px;">
              <div class="flex items-center mb-2.5 py-2">
                <div class="grow h-[1px]"
                     style="background: linear-gradient(270deg, rgb(243, 244, 246) 0%, rgba(243, 244, 246, 0) 100%);"></div>
                <div class="shrink-0 flex items-center px-3 text-gray-500">
                  <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                       class="mr-1 w-2.5 h-2.5" data-icon="Star04" aria-hidden="true">
                    <g id="star-04">
                      <path id="Solid"
                            d="M5.88897 0.683596C5.82708 0.522683 5.67249 0.416504 5.50008 0.416504C5.32768 0.416504 5.17308 0.522683 5.11119 0.683596L4.27287 2.86321C4.1477 3.18865 4.10837 3.28243 4.05457 3.35809C4.00059 3.43401 3.93426 3.50034 3.85834 3.55433C3.78267 3.60813 3.68889 3.64746 3.36346 3.77263L1.18384 4.61094C1.02293 4.67283 0.916748 4.82743 0.916748 4.99984C0.916748 5.17224 1.02293 5.32684 1.18384 5.38873L3.36346 6.22705C3.68889 6.35221 3.78267 6.39155 3.85834 6.44535C3.93426 6.49933 4.00059 6.56566 4.05457 6.64158C4.10837 6.71724 4.1477 6.81102 4.27287 7.13646L5.11119 9.31608C5.17308 9.47699 5.32768 9.58317 5.50008 9.58317C5.67249 9.58317 5.82709 9.47699 5.88898 9.31608L6.72729 7.13646C6.85246 6.81102 6.89179 6.71724 6.94559 6.64158C6.99957 6.56566 7.06591 6.49933 7.14183 6.44535C7.21749 6.39155 7.31127 6.35221 7.6367 6.22705L9.81632 5.38873C9.97723 5.32684 10.0834 5.17224 10.0834 4.99984C10.0834 4.82743 9.97723 4.67283 9.81632 4.61094L7.6367 3.77263C7.31127 3.64746 7.21749 3.60813 7.14183 3.55433C7.06591 3.50034 6.99957 3.43401 6.94559 3.35809C6.89179 3.28243 6.85246 3.18865 6.72729 2.86321L5.88897 0.683596Z"
                            fill="currentColor"></path>
                    </g>
                  </svg>
                  <span class="text-xs text-gray-500 font-medium">试着问问</span></div>
                <div class="grow h-[1px]"
                     style="background: linear-gradient(270deg, rgba(243, 244, 246, 0) 0%, rgb(243, 244, 246) 100%);"></div>
              </div>
              <div class="flex flex-wrap justify-center">
                <div  v-for="question in suggestedQuestionList.data">
                  <button type="button" @click="sendSuggestQuestion(question)"
                          class="btn disabled:btn-disabled btn-secondary-accent btn-medium mb-2 mr-2 last:mr-0">{{question}}
                  </button>
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
</div>
</template>
<script>
import Vue from "vue";
// import { SSE } from "@/utils/sse";
import { marked } from "marked";
// import { getToken} from "@/utils/auth";
import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
import {chatSseRequset, multiDocChatSseRequset, suggestedQuestionRequest} from "@/api/docinfo.js";
import store from '@/store'
export default {
  name: "ask",
  components: { },
  data() {
    return {
      init_qustion: "",
      query: "",
      selectedOption: 'knowledgebase',
      id: "",
      conversation_id: "",
      message_id: "",
      knowledgebase_conversation_id: "",
      network_conversation_id: "",
      name: "",
      category: "",
      doc_fragment_visible: false,
      doc_fragment: [],
      visible: false,
      chatList: [],
      knowledgeBaseList: [],
      suggestedQuestionList: [],
      networkList: [],
      loading: false,
      nodes: [],
      strLoading: `<div class="loading"><div></div><div></div><div></div></div>\r`,
      resultStr: "",
      queryString: '', // 搜索值
      querySave: '',
      position: {
        x: 300,
        y: 200
      }// 弹窗显示位置
    };
  },
  created() {
    this.query = this.$route.query.query;
    this.init_qustion = this.$route.query.query;
    const conversation_id = this.$route.query.conversation_id;

    console.log("=======================created=============================");
    if (this.query && this.query != "") {
      this.send();
    }
    const askType = this.$route.query.askType;
    if (conversation_id && conversation_id != "" && askType) {
      this.conversation_id = conversation_id;
      if (askType == "1") {
        this.selectedOption = 'knowledgebase';
      } else if (askType == "2") {
        this.selectedOption = 'network';
      }

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
            // data[i].answer = marked(answer[0].thought);
            const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
            var html1 = md.render(answer[0].thought);
            html1 = html1.replace(/<img/g, '<img style="max-width: 100%;height: auto;"');
            const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"")
            data[i].answer = html;
          }
          this.chatList = data;
          if (this.selectedOption == "knowledgebase") {
            this.knowledgeBaseList = this.chatList.concat();
          }else {
            this.networkList = this.chatList.concat();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    openKnowledgeBaseBtn() {
      this.network_conversation_id = this.conversation_id;
      this.conversation_id = this.knowledgebase_conversation_id;
      this.selectedOption = 'knowledgebase';
      console.log("=======================openKnowledgeBaseBtn=============================");
      if (this.knowledgeBaseList.length > 0) {
        this.chatList = this.knowledgeBaseList.concat();
      }else {
        this.query = this.init_qustion;
        this.chatList = [];
        // this.send();
      }
    },
    openNetworkBtn() {
      this.knowledgebase_conversation_id = this.conversation_id;
      this.conversation_id = this.network_conversation_id;
      this.selectedOption = 'network';
      console.log("=======================openNetworkBtn=============================");
      if (this.networkList.length > 0) {
        this.chatList = this.networkList.concat();
      }else {
        this.query = this.init_qustion;
        this.chatList = [];
        this.send();
      }
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
    sendSuggestQuestion(msg){
      this.query = msg;
      this.send();
    },
    send() {
      this.suggestedQuestionList = [];
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
      if (this.selectedOption == "knowledgebase") {
        this.connectToChatSSE("1");
      } else {
        this.connectToChatSSE("2");
      }

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
      chatSseRequset(json, this.successCallback, ask_type, this.errCallback);
    },
    connectToMultiDocChatSSE() {
      this.loading = true;
      const json = {
        query: this.query,
        ask_type: ask_type,
        conversation_id: this.conversation_id,
      }
      multiDocChatSseRequset(json, this.successMultiDocCallback, this.errCallback);
    },
    successCallback(msg, ask_type) {
      if (msg.event == "stop") {
        this.stopCallback();
        const json = {
          ask_type: ask_type,
          message_id: this.message_id,
        }
        suggestedQuestionRequest(json)
          .then((res) => {
            if (res.code === 200) {
                this.suggestedQuestionList = res.data
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }else {
        // this.loading = false;
        if (msg.data.includes('conversation_id')) {
          const data = JSON.parse(msg.data);
          this.message_id = data.message_id;
          if (data.event.includes("message") && data.event != "message_end") {
            this.resultStr += data.answer;
            this.conversation_id = data.conversation_id;
            this.$set(this.chatList, this.chatList.length - 1, {
              ...this.chatList[this.chatList.length - 1],
              answer: this.resultStr,
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
      var html1 = md.render(this.resultStr);
      html1 = html1.replace(/<img/g, '<img style="max-width: 100%;height: auto;"');
      const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"")

      this.$set(this.chatList, this.chatList.length - 1, {
          ...this.chatList[this.chatList.length - 1],
          answer: html,
        });
      console.log(this.selectedOption);
      if (this.selectedOption == "knowledgebase") {
        this.knowledgeBaseList = this.chatList.concat();
      }else {
        this.networkList = this.chatList.concat();
      }
      this.stop();
    },
    errCallback(err) {
      this.stop();
      console.log(err, "---");
    },
    successMultiDocCallback(msg){
      this.query = "";
      if (msg.event == "stop") {
        this.stop();
      }else {
        this.loading = false;
        const content = JSON.parse(msg.data).data.content;
        const integrate_answer = content.integrate_answer;
        this.doc_fragment = content.doc_fragment;
        this.data_source = content.doc_source;
        if (integrate_answer != undefined) {
          this.resultStr += integrate_answer;
        }
        this.$set(this.chatList, this.chatList.length - 1, {
          query: this.chatList[this.chatList.length - 1].query,
          answer: marked(this.resultStr),
          doc_fragment: this.doc_fragment,
          data_source: this.data_source,
        });
      }
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
  },
  watch: {
    loading(value) {
      this.scrollBottom();
    },
    chatList() {
      this.scrollBottom();
    },
    suggestedQuestionList() {
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
.flex {
  display: flex;
}
.mb-2\.5 {
  margin-bottom: .625rem;
}
.items-center {
  align-items: center;
}
.flex-wrap {
  flex-wrap: wrap;
}
.py-2 {
  padding-top: .5rem;
  padding-bottom: .5rem;
  justify-content: center;
}
.justify-center {
  justify-content: center;
}
.font-medium {
  font-weight: 500;
  font-size: 13px;
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(102 112 133 / var(--tw-text-opacity));
}
.btn-medium {
  height: 2rem;
  border-width:.5px;
  border-radius: .5rem;
  padding-left: .875rem;
  padding-right: .875rem;
  font-size: 13px;
  margin-left: 10px;
  color:#155aef;
  background-color:#fff;
  border-color: inherit;
  --tw-shadow: 0px 1px 2px 0px rgba(16,24,40,.05);
  --tw-shadow-colored: 0px 1px 2px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)
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

