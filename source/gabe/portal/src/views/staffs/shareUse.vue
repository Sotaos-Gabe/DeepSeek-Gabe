<template>
  <div class="detail-container">
    <div style="padding: 20px; height: calc(100vh - 40px)">
      <el-row style="margin-bottom: 10px">
        <el-col :span="6">
          {{ name }}
        </el-col>
        <el-col
          :span="18"
          style="text-align: right; display: flex; justify-content: flex-end">
          <el-button type="primary" size="small" @click="downloadChat">
            <i class="el-icon-document el-icon--left"></i>下载聊天记录</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1" style="height: calc(100vh - 50px);">
          
        </el-col>
        <el-col class="detail1" :span="22" style="height: calc(100vh - 50px);">
          <div style="height: 100%">
            <div style="height: 100%">
              <div class="detail1a">
                <el-card shadow="always" class="detail1a1">
                  <div class="chatContent">
                    <div class="chatHistory" id="answer">
                      <div
                        class="con1"
                        v-for="(
                          { question, answer, img_url, doc_fragment, data_source }, index
                        ) in chatList"
                      >
                        <div class="con1a">
                          <img src="/cloud-1.svg" alt="" />
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
                              <div>{{ question }}</div>
                            </div>
                          </div>
                        </div>
                        <div class="con1b">
                          <img src="/robot-1.png" alt="" />
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
                    <div style="display: flex; overflow-x: auto;width: 100%; ">
                      <div v-for="item in shortcuts" class="input2a3" @click="send(item.content)">
                        <el-popover placement="top-start" width="500" trigger="hover">
                          <div class="in">{{item.content}}</div>
                          <span slot="reference">{{
                            item.name.length>6?item.name.substr(0, 6) + "...": item.name
                          }}</span>
                        </el-popover>
                          
                      </div>
                    </div>
                    <div
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
                        placeholder="在这里发消息..."
                        v-model="question"
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
                        <div v-else class="input2a2_1" @click="send('')">
                          <div class="in">发送</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="1" style="height: calc(100vh - 50px);">

        </el-col>
      </el-row>
  </div>
  <el-dialog width="600px" title="答案分段" :visible.sync="doc_fragment_visible">
      <el-table
            border
            class="margin-top-10"
            :data="doc_fragment"
            fit
            highlight-current-row
            max-height="450"
          >
            <el-table-column align="center" label="文件名" width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.filename }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分段">
              <template slot-scope="scope">
                <span>{{ scope.row.answer_fragment }}</span>
              </template>
            </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="doc_fragment_visible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="数据源分段" :visible.sync="data_source_visible">
      <el-table
            border
            class="margin-top-10"
            :data="data_source"
            fit
            highlight-current-row
            max-height="450"
          >
            <el-table-column align="center" label="文件名" width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.filename }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分段">
              <template slot-scope="scope">
                <span>{{ scope.row.text_content }}</span>
              </template>
            </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="data_source_visible = false">关闭</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import Vue from "vue";
import { SSE } from "@/utils/sse";
import { marked } from "marked";
import { copy } from "@/utils/tools";
import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
import { reportSseRequset, shareChatSseRequset, shareMultiDocChatSseRequset } from "@/api/docinfo.js";

export default {
  name: "StaffShareUse",
  data() {
    return {
      id: "",
      code: "",
      name: "",
      category: "",
      doc_fragment_visible: false,
      doc_fragment: [],
      data_source_visible: false,
      data_source: [],
      visible: false,
      question: "",
      chatList: [],
      qaStream: null,
      loading: false,
      shortcuts: [],
      strLoading: `<div class="loading"><div></div><div></div><div></div></div>\r`,
      resultStr: "",
      report_id: "",
      language: "cn"
    };
  },
  created() {
    this.code = this.$route.params.code;
    this.getInfo();
    this.getHistoryList();
  },
  methods: {
    downloadChat() {
      let message = ""
      for (let x of this.chatList){
        message += "问："+x.question+"\n答："+x.answer+"\n"
      }
      message = message.replace(/<p>/g, "")
      message = message.replace(/<\/p>/g, "")
      const blob = new Blob([message], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${this.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    openDocFragment(doc_fragment) {
      this.doc_fragment = doc_fragment;
      this.doc_fragment_visible = true;
    },
    openDataSource(data_source) {
      this.data_source = data_source;
      this.data_source_visible = true;
    },
    clearChatHistory() {
      this.$confirm("确定清空聊天记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.$request({
          url: "/tech/amp/yaowei/delChatRecord ",
          method: "get",
        })
        .then(({ data }) => {
          this.chatList=[];
          this.getHistoryList();
        })
        .catch(() => {});
      })
      .catch(() => {});
    },
    getInfo() {
      this.$request({
        url: "/tech/virtualStaff/getShareInfo",
        method: "get",
        params: { share_code: this.code },
      })
        .then(({ data: {name ,commands, category, report_id} }) => {
          this.name = name;
          this.shortcuts = commands;
          this.category = category;
          this.report_id = (report_id==0 || report_id==-1)?'':report_id;
        })
        .catch(() => {});
    },
    stop() {
      this.qaStream?.close();
      this.resultStr = "";
      this.loading = false;
    },
    send(instruction) {
      if (instruction!='')
        this.question = instruction;
      let extra = null;
      if (!this.question.trim() && !extra)
        return this.$toast.show("请输入内容！", undefined, true);
      this.loading = true;
      this.resultStr = "";

      this.chatList = [
        ...this.chatList,
        {
          question: this.question,
          answer: "",
          ...(extra || {}),
        },
      ];
      if (this.report_id==''){
        if (this.category === '其他智能载体') {
          this.connectToMultiDocChatSSE(this.code)
        } else if (category === '绘画智能人') {
          this.connectToChatSSE(this.code,5);
        } else {
          this.connectToChatSSE(this.code,4);
        }
      }else {
        this.$request({
          url: "/tech/reporttemplate/info",
          method: "get",
          params: { id: this.report_id },
        })
        .then(({ data }) => {
          this.template_content = data.content;
          this.connectToReportSSE();
        })
        .catch(() => {});
      }
    },
    connectToChatSSE(share_code,chat_type) {
      this.loading = true;
      const json = {
        share_code: share_code,
        question: this.question,
        chat_type: chat_type
      }
      shareChatSseRequset(json, this.successCallback, this.errCallback);
    },
    connectToMultiDocChatSSE(share_code) {
      this.loading = true;
      const json = {
        share_code: share_code,
        question: this.question,
      }
      shareMultiDocChatSseRequset(json, this.successMultiDocCallback, this.errCallback);
    },
    connectToReportSSE() {
      this.loading = true;
      const json = {
            language: this.language,
            type: "report",
            message: this.question,
            template: this.template_content,
          }
      reportSseRequset(json, this.successCallback, this.errCallback);
    },
    successCallback(msg) {
      this.question = "";
      if (msg.event == "stop") {
        this.stopCallback();
      }else {
        this.loading = false;
        const data = JSON.parse(msg.data).data;
        this.resultStr += data.content;
        this.$set(this.chatList, this.chatList.length - 1, {
            ...this.chatList[this.chatList.length - 1],
            answer: this.resultStr,
          });
      }
    },
    stopCallback() {
      this.loading = false;
      this.question = "";
      const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
      // this.resultStr = this.resultStr.replace(/\n\n/g, '\n');
      var html1 = md.render(this.resultStr).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">');
      const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">')
      this.$set(this.chatList, this.chatList.length - 1, {
          ...this.chatList[this.chatList.length - 1],
          answer: html,
        });
      this.stop();
    },
    errCallback(err) {
      this.stop();
      console.log(err, "---");
    },
    successMultiDocCallback(msg){
      this.question = "";
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
          question: this.chatList[this.chatList.length - 1].question,
          answer: marked(this.resultStr),
          doc_fragment: this.doc_fragment,
          data_source: this.data_source,
        });
      }
    },
    generateReport() {
      const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
      const source = new SSE("/ppt/v1/feishu/doc/ask", {
        method: "POST",
        payload: JSON.stringify(
          {
            language: this.language,
            type: "report",
            message: this.question,
            template: this.template_content,
          }
        ),
      });
      this.qaStream = source;
      this.question = "";
      source.onmessage = (e) => {
        const data = JSON.parse(e.data).data;
        this.resultStr += data.content;
        this.$set(this.chatList, this.chatList.length - 1, {
              ...this.chatList[this.chatList.length - 1],
              answer: this.resultStr,
            });
      };
      source.addEventListener("stop", (e) => {
        // this.resultStr = this.resultStr.replace(/\n\n/g, '\n');
        var html1 = md.render(this.resultStr).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">');
        const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">')
        this.$set(this.chatList, this.chatList.length - 1, {
            ...this.chatList[this.chatList.length - 1],
            answer: html,
          });
        this.stop();
      });
      source.onerror = (event) => {
        this.stop();
      };
      source.stream();
    },
    multiDocChat(){
      let extra = null;
      const source = new SSE("/tech/virtualStaff/shareMultiDocChat", {
        method: "POST",
        payload: JSON.stringify(
          extra
            ? {
                question: this.question,
                share_code: this.code,
                ...extra,
              }
            : {
                question: this.question,
                share_code: this.code,
              }
        ),
      });
      this.qaStream = source;
      this.question = "";
      this.uploadUrl = [];
      this.hideUploadBtn = false;
      source.onmessage = (e) => {
        const content = JSON.parse(e.data).data.content;
        const integrate_answer = content.integrate_answer;
        this.doc_fragment = content.doc_fragment;
        this.data_source = content.doc_source;
        if (integrate_answer != undefined) {
          this.resultStr += integrate_answer;
        }
        this.$set(this.chatList, this.chatList.length - 1, {
          question: this.chatList[this.chatList.length - 1].question,
          answer: marked(this.resultStr),
          doc_fragment: this.doc_fragment,
          data_source: this.data_source,
        });
      };
      source.addEventListener("stop", (e) => {
        this.stop();
      });
      source.onerror = (event) => {
        this.stop();
      };
      source.stream();
    },
    keyDown(e) {
      if (!e.shiftKey && !this.loading) {
        this.send('');
        e.preventDefault();
      }
    },
    scrollBottom() {
      this.$nextTick(() => {
        const ele = document.getElementById("answer");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    getHistoryList() {
      this.$request({
        url: "/tech/virtualStaff/shareChatRecord",
        method: "get",
        params: { share_code: this.code, page: 1, limit: 1000 },
      })
        .then(({ data }) => {
          for (let i = 0; i < data.length; i++) {
            try {
              const answer = JSON.parse(data[i].answer);
              data[i].answer = marked(answer.integrate_answer).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">');
              if (answer.doc_fragment) {
                data[i].doc_fragment = answer.doc_fragment;
              }
              if (answer.doc_source) {
                data[i].data_source = answer.doc_source;
              }
            } catch (error) {
              // data[i].answer = data[i].answer.replace(/\n\n/g, '\n');
              const html = marked(data[i].answer).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">');
              data[i].answer = html;
            }
          }
          this.chatList = data;
          // this.chatList = data.map(({ answer, ...extra }) => ({
          //   ...extra,
          //   answer: marked(answer),
          // }));
        })
        .catch(() => {});
    },
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
  //   service?.stop();
  //   service = null;
  // },
  // mounted() {
  //   document.addEventListener("visibilitychange", function logData() {
  //     if (document.visibilityState === "hidden") {
  //       service?.stop();
  //       service = null;
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
  padding-bottom: 10px;
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

