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
              <h3 style="font-weight: bold;">历史记录</h3>
              <div class="con1a">
                <div style="display: flex;">
                  <label class="custom-radio">
                    <input type="radio" value="all" v-model="selectedOption" @click="openAllBtn">
                    <span class="radio-button">全部</span>
                  </label>
                  <label class="custom-radio">
                    <input type="radio" value="knowledgeBase" v-model="selectedOption" @click="openKnowledgeBaseBtn">
                    <span class="radio-button"><i class="el-icon-notebook-1 el-icon--left"></i>基于知识库</span>
                  </label>
                  <label class="custom-radio">
                    <input type="radio" value="network" v-model="selectedOption" @click="openNetworkBtn">
                    <span class="radio-button"><i class="el-icon-discover el-icon--left"></i>基于网络</span>
                  </label>
                </div>
              </div>
              <div
                class="con1" style="margin-top: 0px;"
                v-for="(
                  { datePart, asks }, index
                ) in chatList"
              >
              <h4 style="font-weight: bold;">{{ datePart }}</h4>
              <hr class="base-divider"/>
              <div
                class="con1"
                v-for="(
                  { create_time, answer, conversation_id, query, ask_type }, ask_index
                ) in asks"
              >
                <div class="list-item">
                  <div class="left-box" @click="openHistoryChat(conversation_id,ask_type)">
                    <div>
                      <span style="color: rgb(132, 132, 132);margin-right: 30px;">
                      {{ create_time }}
                      </span>
                      {{ query }}
                    </div>
                    <div style="margin-top: 5px;">
                      <span style="font-size: 13px;color: #ccc; margin-left: 90px;">{{
                        answer.length>30?answer.substr(0, 30) + "...": answer
                      }}
                      </span>
                    </div>
                  </div>
                  <el-button class="right-box" size="mini" type="text" @click="deleteChatHistory(conversation_id,ask_index, index)"
                    style="float: right;">
                    <i class="el-icon-delete el-icon--right;margin-left: 0px"></i>
                  </el-button>
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
import { chatSseRequset, multiDocChatSseRequset } from "@/api/docinfo.js";
import store from '@/store'
export default {
  name: "ask",
  components: { },
  data() {
    return {
      init_qustion: "",
      query: "",
      selectedOption: 'all',
      id: "",
      agent_id: "",
      name: "",
      category: "",
      doc_fragment_visible: false,
      doc_fragment: [],
      visible: false,
      chatList: [],
      allList: [],
      loading: false,
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
    console.log("=======================created=============================");
    this.getHistoryList();
  },
  methods: {
    openHistoryChat(conversation_id,askType) {
      if (askType === '1' || askType === '2') {
        this.$router.push({
          path: '/ask',
          query: {
            conversation_id: conversation_id,
            askType: askType
          }
        })
      } else if (askType === '3') {
        this.$router.push({
          path: '/ppt',
          query: {
            conversation_id: conversation_id,
            askType: askType
          }
        })
      } else if (askType === '4') {
        this.$router.push({
          path: '/imagegen',
          query: {
            conversation_id: conversation_id,
            askType: askType
          }
        })
      }
      
    },
    deleteChatHistory(conversation_id, ask_index, index) {
      this.$request({
        url: "/tech/api/yao/ask/deleteUserHistoryConversation",
        method: "get",
        params: { conversation_id },
      })
        .then(({ data }) => {
          console.log("=======================deleteUserHistoryConversation=============================");
          console.log(data);
          console.log(conversation_id);
          for (let i = 0; i < this.allList.length; i++) {
            for (let j = 0; j < this.allList[i].asks.length; j++) {
              if (this.allList[i].asks[j].conversation_id === conversation_id) {
                this.allList[i].asks.splice(j, 1);
                break;
              }
            }
            if (this.allList[i].asks.length === 0) {
              this.allList.splice(i, 1);
            }
          }
          this.chatList[index].asks.splice(ask_index, 1);
          if (this.chatList[index].asks.length === 0) {
            this.chatList.splice(index, 1);
          }
          console.log(this.chatList);
        })
    },
    openAllBtn() {
      this.selectedOption = 'all';
      console.log("=======================openAllBtn=============================");
      this.chatList = this.allList.concat();
    },
    openKnowledgeBaseBtn() {
      this.selectedOption = 'knowledgeBase';
      let knowledgeBaseAsks = [];
      console.log(this.chatList);
      console.log("=======================openKnowledgeBaseBtn=============================");
      for (let i = 0; i < this.allList.length; i++) {
        knowledgeBaseAsks.push({
          datePart: this.allList[i].datePart,
          asks: [],
        });
        for (let j = 0; j < this.allList[i].asks.length; j++) {
          if (this.allList[i].asks[j].ask_type === '1') {
            knowledgeBaseAsks[knowledgeBaseAsks.length - 1].asks.push(this.allList[i].asks[j]);
          }
        }
        if (knowledgeBaseAsks[knowledgeBaseAsks.length - 1].asks.length === 0) {
          knowledgeBaseAsks.splice(knowledgeBaseAsks.length - 1, 1);
        }
      }
      this.chatList = knowledgeBaseAsks;
      console.log(this.chatList);
    },
    openNetworkBtn() {
      this.selectedOption = 'network';
      let networkAsks = [];
      console.log("=======================openNetworkBtn=============================");
      for (let i = 0; i < this.allList.length; i++) {
        networkAsks.push({
          datePart: this.allList[i].datePart,
          asks: [],
        });
        for (let j = 0; j < this.allList[i].asks.length; j++) {
          if (this.allList[i].asks[j].ask_type === '2') {
            networkAsks[networkAsks.length - 1].asks.push(this.allList[i].asks[j]);
          }
        }
        if (networkAsks[networkAsks.length - 1].asks.length === 0) {
          networkAsks.splice(networkAsks.length - 1, 1);
        }
      }
      this.chatList = networkAsks;
      console.log(this.chatList);
    },
    back() {
      this.$router.replace({
        path: `/frontpage`,
      });
    },
    getHistoryList() {
      this.$request({
        url: "/tech/api/yao/ask/getUserHistoryConversations",
        method: "get",
        params: { page_num: 1, page_size: 1000 },
      })
        .then(({ data }) => {
          console.log("=======================getHistoryList=============================");
          console.log(data);
          let datePartStr = "";
          let dateAsks = [];
          for (let i = 0; i < data.length; i++) {
            const { datePart, timePart } = this.splitDateTime(data[i].create_time);
            console.log(datePart, timePart);
            if (datePartStr !== datePart) {
              datePartStr = datePart;
              dateAsks.push({ datePart, asks: [] });
            }
            console.log(data[i].answer);
            
            try {
              const answer = JSON.parse(data[i].answer);
              if ("thought" in answer[0]) {
                data[i].answer = marked(answer[0].thought).replace(/<p>/g, '').replace(/<\/p>/g, '');
              }else {
                data[i].answer = marked(answer[0].answer).replace(/<p>/g, '').replace(/<\/p>/g, '');
              }
            } catch (error) {
              data[i].answer = data[i].answer=="null"?"":data[i].answer;
            }
            data[i].create_time = timePart;
            dateAsks[dateAsks.length - 1].asks.push(data[i]);
          }
          this.chatList = dateAsks;
          this.allList = dateAsks;
          console.log("=======================getHistoryList=============================");
          console.log(this.chatList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    splitDateTime(date) {
      console.log("=======================splitDateTime=============================");
      console.log(date);
      const dateObj = new Date(date);
      const datePart = dateObj.toLocaleDateString(); // 日期部分
      const timePart = dateObj.toLocaleTimeString(); // 时间部分
      return { datePart, timePart };
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
.list-item {
  display: flex;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  font-size: 14px;
  .label {
    margin-left: 5px;
  }
  .right-box {
    align-items: center;
    color: #B2B8D0;
    margin-right: 15px;
    display: none;
    .el-button {
      margin-right: 5px;
    }
  }
  .left-box {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
.list-item:hover {
  background-color: #F7F7F9;
  .right-box {
    display: flex;
  }
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

