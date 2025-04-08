<template>
  <div class="home-container">
    <el-row>
      <el-col :span="5" style="height: 100vh">
        <div style="height: 100%;overflow-y: auto; padding-bottom: 5px;">
          <el-row style="margin-bottom: 10px">
            <el-button
              size="big"
              type="text"
              style="color: black;"
              @click="back">|<i class="el-icon-back el-icon--left"></i>
            </el-button>
            <el-button
              size="big"
              type="text"
              style="color: black; float: right;margin-right: 20px;"
              @click="addNote">
              <i class="el-icon-document-add el-icon--right;"></i>
            </el-button>
            <!-- <el-button
              size="big"
              type="text"
              style="color: black; float: right;margin-right: 10px;"
              @click="back">
              <i class="el-icon-delete el-icon--right;"></i>
            </el-button> -->
          </el-row>
          <el-row>
            <div
                class="con1"
                v-for="(
                  { id,create_time, name,tags, content, category }, index
                ) in notes"
              >
                <div class="list-item" :class="{ 'is-selected': selectedIndex === index }" @click="selectItem(index)">
                  <div class="left-box" @click="openContent(id,content)">
                    <div style="width: 100%;padding-right: 20px;">
                      {{ name }}
                      <el-button class="right-box" size="mini" type="text" @click="deleteNote(id, index)"
                        style="float: right;">
                        <i class="el-icon-delete el-icon--right;"></i>
                      </el-button>
                      <el-button class="right-box" size="mini" type="text" @click="editNote(id,name,tags,category)"
                        style="float: right;margin-right: 5px;">
                        <i class="el-icon-edit el-icon--right;"></i>
                      </el-button>
                      <el-button class="right-box" size="mini" type="text" @click="unlockNote(id,category)"
                        style="float: right;">
                        <i v-if="category == 'public'" class="el-icon-circle-check el-icon--right;"></i>
                        <i v-else class="el-icon-lock el-icon--right;"></i>
                      </el-button>
                    </div>
                    <div style="margin-top: 5px; width: 100%;">
                      <span style="color: rgb(132, 132, 132);margin-right: 5px;">
                      {{ create_time | formatDate}}
                      </span>
                      <span style="font-size: 13px;color: #ccc;">{{
                        tags.length>30?tags.substr(0, 30) + "...": tags
                      }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="editNoteSpan" style="height: 100vh;padding-right: 5px;padding-bottom: 5px;">
        <div style="height: 100%; overflow-y: auto;padding-right: 2px;">
          <mavon-editor
            placeholder="请输入内容..."
            v-show="notes.length>0"
            id="md"
            v-model="content"
            ref="md"
            :defaultOpen="'edit'"
            :toolbarsFlag="true"
            :editable="true"
            :boxShadow="false"
            :toolbars="toolbars"
            @change="change"
            @save="save"
            style="min-height: 550px;height: 100%; width: 100%">
            <template v-slot:right-toolbar-before>
              <el-button
                :class="{ hidden: !yaogptBtnShow }"
                size="middle"
                type="text"
                style="color: blue; float: right;margin-right: 10px;text-decoration: underline;font-size: 16px;"
                @click="yaogptOpen">
                <i class="el-icon-question" />问问YaoGPT
              </el-button>
            </template>
          </mavon-editor>
        </div>
      </el-col>
      <el-col :span="yaogptSpan" style="height: 100vh;">
        <div style="height: 100%; padding-bottom: 10px;">
          <div class="chatContent">
            <div style="">
              <el-button
                size="big"
                type="text"
                style="font-weight: bold; color: black; margin-right: 10px;">
                YaoGPT
              </el-button>
              <el-button
                size="big"
                type="text"
                style="color: black; float: right;margin-right: 10px;"
                @click="yaogptClose">
                <i class="el-icon-close el-icon--right;"></i>
              </el-button>
            </div>
            <h5 style="padding-left: 20px;padding-right: 20px;margin-top: 0px;">你好，我是你的智能助手，能帮你生成答案、答疑解惑，快向我提问吧！</h5>
            <div class="chatHistory" id="answer">
              <div
                class="con1"
                v-for="(
                  { query,create_time, answer, img_url }, index
                ) in chatList"
              >
                <div class="con1a">
                  <!-- <img src="/cloud-1.svg" alt="" /> -->
                  <div class="con1a1">
                    <div class="con1a1a" style="float: right;margin-right: -50px;">
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
                      <!-- <span style="color: rgb(132, 132, 132); font-size: 14px">
                        {{ create_time | formatDate }}</span> -->
                    </div>
                  </div>
                </div>
                <div class="con1b">
                  <!-- <img src="/robot-1.png" alt="" /> -->
                  <span style="margin-left: 20px;
                  width: 80px;
                  font-size: 18px;
                  font-weight: bold;">
                    <i class="el-icon-chat-line-round" /> 回答
                  </span>
                  <div class="con1b1" style="padding-right: 0px;">
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
                    <div style="width: 100%;" :class="{ hidden: loading }">
                      <el-button class="right-box" size="mini" type="text" title="复制" @click="copyText(answer)"
                        style="float: right;margin-right: 5px;">
                        <i class="el-icon-copy-document" />
                      </el-button>
                      <el-button class="right-box" size="mini" type="text" title="插入到笔记" @click="addNoteFromGPT(answer)"
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
    </el-row>
    <el-dialog
      width="800px"
      :title="id ? '修改' : '新增'"
      :visible.sync="visible"
    >
      <el-form
        ref="form2"
        :model="form2"
        :rules="rules2"
        size="small"
        label-width="150px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form2.name"
            placeholder="请输入名称"
            style="width: 300px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="类型" prop="category">
          <el-select
            v-model="form2.category"
            style="width: 300px"
            placeholder="请选择类型"
          >
            <el-option label="public" :value="'public'" :key="'public'" />
            <el-option label="private" :value="'private'" :key="'private'" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input
            v-model="form2.tags"
            style="width: 300px"
            placeholder="请输入标签，多个标签以逗号分隔"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false"> 取 消 </el-button>
        <el-button
          v-loading="addLoading"
          size="small"
          type="primary"
          @click="add"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
// import { marked } from "marked";
// import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
import { chatSseRequset } from "@/api/docinfo.js";
import { copy } from "@/utils/tools";
export default {
  components: { mavonEditor },
  data() {
    return {
      selectedIndex: 0,
      editNoteSpan: 19,
      yaogptSpan: 0,
      yaogptBtnShow: true,
      query: "",
      conversation_id: "",
      loading: false,
      chatList: [],
      strLoading: `<div class="loading"><div></div><div></div><div></div></div>\r`,
      resultStr: "",
      notes: [],
      listLoading: false,
      visible: false,
      addLoading: false,
      content: "",
      form2: {
        name: "",
        category: "private",
        tags: ""
      },
      rules2: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择类型", trigger: "blur" },
        ],
      },
      uploadLoading: false,
      hideUploadBtn: false,
      action: '/tech/agent/uploadFile',
      id: "",
      firstTime: true,
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: false, // 单双栏模式
        preview: false, // 预览
      }
    };
  },
  computed: {},
  watch: {
    loading(value) {
      this.scrollBottom();
    },
    chatList() {
      this.scrollBottom();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    back() {
      this.$router.replace({
        path: `/frontpage`,
      });
    },
    selectItem(index) {
      console.log("=======================selectItem=============================");
      console.log(index);
      this.selectedIndex = index;
      this.firstTime = true;
    },
    save() {
      console.log("=======================save=============================");
      console.log(this.content);
      const data = {
        content: this.content,
        id: this.id,
      };
      const url = "/tech/api/yao/user/notebook/update"
      this.$request({
        url,
        method: "post",
        data,
      })
      .then((res) => {
        this.notes[this.selectedIndex].content = this.content;
        this.$message.success("修改成功");
      })
      .catch(() => {
      });
    },
    change() {
      if (this.firstTime) {
        this.firstTime = false;
        return;
      }
      console.log("=======================change=============================");
      console.log(this.content);

      const data = {
        content: this.content,
        id: this.id,
      };
      const url = "/tech/api/yao/user/notebook/update"
      this.$request({
        url,
        method: "post",
        data,
      })
      .then((res) => {
        this.notes[this.selectedIndex].content = this.content;
      })
      .catch(() => {
      });
    },
    openContent(id,content) {
      this.id = id;
      console.log(content)
      this.content = content;
    },
    unlockNote(id,category) {
      if (category == "public") {
        category = "private";
      } else {
        category = "public";
      }
      const data = {
        category: category,
        id: id,
      };
      const url = "/tech/api/yao/user/notebook/update"
      this.$request({
        url,
        method: "post",
        data,
      })
      .then((res) => {
        this.$message.success("修改成功");
        this.getList();
      })
      .catch(() => {
      });
    },
    deleteNote(id,index) {
      this.$confirm("确定删除该笔记?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.$request({
          url: "/tech/api/yao/user/notebook/delete",
          method: "post",
          data: { id: id},
        })
          .then(() => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch(() => {});
      })
      .catch(() => {});
    },
    editNote(id,name,tags,category) {
      this.id = id;
      this.visible = true;
      this.hideUploadBtn = true;
      this.$nextTick(() => {
        this.$refs["form2"].clearValidate();
        this.form2 = {
          name: name,
          category: category,
          tags: tags,
        };
      });
    },
    add() {
      this.$refs["form2"].validate((valid) => {
        if (valid) {
          console.log(this.form2)
          this.addLoading = true;
          const data = {
            name: this.form2.name,
            category: this.form2.category,
            tags: this.form2.tags,
          };
          if (this.id) {
            data.id = this.id;
          } else {
            data.category = this.form2.category;
          }
          const url = this.id
            ? "/tech/api/yao/user/notebook/update"
            : "/tech/api/yao/user/notebook/create";
          this.$request({
            url,
            method: "post",
            data,
          })
          .then((res) => {
            debugger;
            this.addLoading = false;
            this.$message.success(this.id ? "修改成功" : "新建成功");
            this.visible = false;

            if (this.id) {
              this.id = "";
            }
            this.getList();
          })
          .catch(() => {
            this.addLoading = false;
          });
        }
      });
    },
    addNote() {
      this.visible = true;
      this.hideUploadBtn = false;
      this.id = "";
      this.$nextTick(() => {
        this.$refs["form2"].clearValidate();
        this.form2 = {
          name: "",
          category: "private",
          tags: "",
        };
      });
    },
    getList() {
      this.listLoading = true;
      this.$request({
        url: "/tech/api/yao/user/notebook/list",
        method: "get",
      })
        .then(({ data }) => {
          console.log("=======================getList=============================");
          console.log(data);
          this.listLoading = false;
          this.notes = data;
          this.content = data[0].content;
          this.id = data[0].id;
        })
        .catch(() => {
          this.listLoading = false;
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

      this.connectToChatSSE("2");
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
        if (msg.data.includes('agent_message')) {
          const data = JSON.parse(msg.data);
          if (data.event == "agent_message") {
            this.resultStr += data.answer;
            this.conversation_id = data.conversation_id;
            this.$set(this.chatList, this.chatList.length - 1, {
              ...this.chatList[this.chatList.length - 1],
              answer: this.resultStr,
            });
          }
        }
      }
    },
    stopCallback() {
      this.loading = false;
      // const md = require('markdown-it')({
      //         html: true,
      //         linkify: true,
      //         typographer: true
      //       }).use(markdownItMermaid);
      // var html1 = md.render(this.resultStr);
      // html1 = html1.replace(/<ol>/g, '<ol style="margin-top: 5px; margin-bottom: 5px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">')
      // const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"")

      this.$set(this.chatList, this.chatList.length - 1, {
          ...this.chatList[this.chatList.length - 1],
          answer: this.resultStr,
        });
      this.stop();
    },
    errCallback(err) {
      this.stop();
      console.log(err, "---");
    },
    keyDown(e) {
      if (!e.shiftKey && !this.loading) {
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
    yaogptOpen() {
      this.editNoteSpan = 14;
      this.yaogptSpan = 5;
      this.yaogptBtnShow = false;
    },
    yaogptClose() {
      this.editNoteSpan = 19;
      this.yaogptSpan = 0;
      this.yaogptBtnShow = true;
    },
    copyText(answer) {
      copy(answer)
      this.$message.success('复制成功')
    },
    addNoteFromGPT(answer) {
      this.content += answer;
    }
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
.list-item {
  display: flex;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  // margin-left: 10px;
  padding-left: 10px;
  margin-right: 0px;
  border-radius: 6px;
  font-size: 14px;
  .label {
    margin-left: 5px;
  }
  .right-box {
    align-items: center;
    color: #B2B8D0;
    display: none;
    padding: 0;
    .el-button {
      margin-right: 5px;
    }
  }
  .left-box {
    width: 100%;
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
.list-item.is-selected {
  background-color: #dcdcde;
  .right-box {
    display: flex;
  }
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
  border-radius: 6px;
}
.hidden {
  display: none;
}
</style>
