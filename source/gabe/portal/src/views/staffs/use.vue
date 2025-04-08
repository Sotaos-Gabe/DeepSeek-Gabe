<template>
<div class="detail-container">
    <div style="padding: 20px; height: calc(100vh - 40px)">
      <el-row style="margin-bottom: 10px">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="back">
            <i class="el-icon-back el-icon--left"></i>返回
          </el-button>
          {{ name }}
        </el-col>
        <el-col
          :span="18"
          style="text-align: right; display: flex; justify-content: flex-end">
          <el-button v-if="showApi" type="primary" size="small" @click="openToApiBtn">
            <i class="el-icon-link el-icon--left"></i>查看API信息</el-button>
          <el-button type="primary" size="small" @click="downloadChat">
            <i class="el-icon-document el-icon--left"></i>下载聊天记录</el-button>
          <el-button v-if="showReport" type="primary" size="small" @click="openGenerateReport">
            <i class="el-icon-document-copy el-icon--left"></i>记录生成报告</el-button>
          <el-button type="primary" size="small" @click="share">
            <i class="el-icon-share el-icon--left"></i>分享</el-button>
        </el-col>
      </el-row>
    <el-row>
      <el-col :span="5" style="height: 100vh">

      </el-col>
      <el-col class="detail1" :span="12" style="height: 100vh">
        <div style="height: 100%">
          <div style="padding: 20px; height: calc(100% - 50px);">
            <div class="detail1a">
              <el-card shadow="always" class="detail1a1">
                <div class="chatContent">
                  <div style="width: 100%;">
                    <el-tooltip content="清空聊天记录" placement="top">
                      <el-button size="mini" @click="clearChatHistory()"
                      style="border-radius: 20px; border-color: white;float: right;margin-top: -20px;margin-right: -20px;">
                        <i class="el-icon-delete el-icon--right;margin-left: 0px"></i>
                      </el-button>
                    </el-tooltip>
                  </div>
                  <div class="chatHistory" id="answer">
                    <div
                      class="con1"
                      v-for="(
                        { question, answer, img_url, doc_fragment, data_source }, index
                      ) in chatList"
                    >
                      <div class="con1a" v-show="opening_remarks=='' || index!=0">
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
                  <div style="display: block;
                      padding-left: 10px;
                      padding-right: 10px;
                      gap: 10px;">
                    <div class="input3" v-show="showStaff">
                      <span style="text-align: right; display: flex; justify-content: flex-end;margin-right: 5px;height: 6px;">
                        <span class="at-button" style="cursor:pointer" @click="cancelAt">x</span>
                      </span>
                      <span name="at" id= "0" contentEditable="false">
                        <span contentEditable="false" style="white-space: pre;">&#x200B;正在与</span>
                        <span class="at-button"
                        contentEditable="false">@{{user.name}}</span>
                        <span contentEditable="false" style="white-space: pre;">&#x200B;</span>
                      </span>
                      对话

                    </div>
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
                        placeholder="在这里发消息或者@您的团队成员"
                        v-model="question"
                        resize="none"
                        @input="inputValue($event)"
                        @keydown="handleKeyDown($event)"
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
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7" style="height: 100vh;">
        <div style="width: 100%; height: 100%; overflow: auto;">
          <h3>共享码列表：</h3>
          <ul style="width: 100%; ">
            <li v-for="s in shareCodes" :key="s.share_code" style="width: 100%; ">
                {{s.share_code_name !=""?s.share_code_name:s.share_code}}({{ s.create_time| formatDate }})
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="openSharePage(s.share_code)"
                >
                  查看
                </el-button>
                <el-button v-if="showReport"
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="getHistoryListByShareCode(s.share_code)"
                >
                  生成报告
                </el-button>
                <!-- <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="confirmDelete(p.id)"
                >
                  删除
                </el-button> -->
            </li>
        </ul>
        </div>
      </el-col>
    </el-row>
  </div>
  <AtDialog
      v-if="showDialog"
      :visible="showDialog"
      :position="position"
      :queryString="queryString"
      :staffId="id"
      @onPickUser="handlePickUser"
      @onHide="handleHide"
      @onShow="handleShow">
    </AtDialog>
  <el-dialog
      width="500px"
      :title="'分享信息'"
      :visible.sync="visible"
    >
      <el-form
        ref="form2"
        :model="form2"
        size="small"
        label-width="10px"
      >
        <el-form-item prop="name">
          <el-input
            v-model="form2.name"
            placeholder="为您的分享留个记号吧"
            style="width: 350px;padding-right: 10px;"
            maxlength="50"
          />
          <el-button
          :disabled="form2.url!==''"
          size="small"
          type="primary"
          @click="genShareCodebtn">
          生成共享码
        </el-button>
        </el-form-item>
        <el-form-item prop="url">
          <el-input
            :readonly="true"
            v-model="form2.url"
            style="width: 350px;padding-right: 10px;"
            maxlength="50"
          />
          <i v-if="genShareCodeLoading" class="el-icon-loading" />
          <el-button
          :disabled="form2.url==''"
          size="small"
          type="primary"
          @click="copybtn"
        >
          复制
        </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      width="500px"
      :title="'生成PPT'"
      :visible.sync="pptvisible"
    >
      <el-form
        ref="form1"
        :model="form1"
        size="small"
        label-width="80px"
      >
        <el-form-item label="模版" prop="template">
          <el-select
            v-model="form1.template"
            style="width: 300px"
            placeholder="请选择模版"
          >
            <el-option label="淡蓝" :value="'template1'" />
            <el-option label="数字人" :value="'template2'" />
            <el-option label="机器人" :value="'template3'" />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select
            v-model="form1.language"
            style="width: 300px"
            placeholder="请选择语言"
          >
            <el-option label="简体中文" :value="'cn'" />
            <el-option label="英文" :value="'en'" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="pptInput">
          <el-input
            v-model="form1.pptInput"
            style="width: 300px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div style="margin-left: 80px;margin-right: 80px;margin-bottom: 20px;">
          <el-button
            v-if="pptloading"
            type="primary"
            size="small"
            @click="stopGenerate"
            >停止</el-button>
          <el-button v-else
          size="small"
          type="primary"
          @click="generateppt('ppt')"
        >
          生成PPT大纲
        </el-button>

        <el-button style="float: right"
          :disabled="pptanswer=='' || pptexport"
          size="small"
          type="primary"
          @click="generateppt('ppt_export')"
        >
          导出PPT
        </el-button>
      </div>
      <div
        id="pptanswer"
        class="con1b1"
        v-highlight
        v-html="pptanswer"
        style="height: 300px;width: 400px;overflow: auto;margin-left: 30px;"
      ></div>
    </el-dialog>
    <el-dialog
      width="500px"
      :title="'生成报告'"
      :visible.sync="reportvisible"
    >
      <el-form
        ref="form3"
        :model="form3"
        size="small"
        label-width="80px"
      >
        <el-form-item label="语言" prop="language">
          <el-select
            v-model="form3.language"
            style="width: 300px"
            placeholder="请选择语言"
          >
            <el-option label="简体中文" :value="'cn'" />
            <el-option label="英文" :value="'en'" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板" prop="template">
          <el-select
              v-model="form3.template_id"
              style="width: 300px"
              placeholder="请选择模板"
              size="small"
            >
            <el-option
              v-for="item in templateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form3.content"
            style="width: 300px"
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div style="margin-left: 80px;margin-right: 80px;margin-bottom: 20px;">
          <el-button
            v-if="reportloading"
            type="primary"
            size="small"
            style="width: 300px;"
            @click="stopGenerate"
            >停止</el-button>
          <el-button v-else
          size="small"
          type="primary"
          :disabled="form3.content==''"
          style="width: 300px;"
          @click="openReportPage(id,name,agent_id,form3.content,form3.language,form3.template_id)"
        >
          生成报告
        </el-button>

        <!-- <el-button style="float: right"
          :disabled="reportanswer=='' || reportexport"
          size="small"
          type="primary"
          @click="openNewPage(id,name,agent_id,reportanswer)"
        >
          编辑和导出
        </el-button> -->
      </div>
      <!-- <div
        id="reportanswer"
        class="con1b1"
        v-highlight
        v-html="reportanswer"
        style="height: 300px;width: 400px;overflow: auto;margin-left: 30px;"
      >
      </div> -->

    </el-dialog>
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
// import { SSE } from "@/utils/sse";
import { marked } from "marked";
import { copy } from "@/utils/tools";
import AtDialog from "@/components/atDialog/index.vue";
// import { getToken} from "@/utils/auth";
import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
import { reportSseRequset, chatSseRequset, multiDocChatSseRequset } from "@/api/docinfo.js";
import store from '@/store'
export default {
  name: "StaffsUse",
  components: { AtDialog },
  data() {
    return {
      form1: {
        template: "template1",
        language: "cn",
        pptType: "public",
        pptInput: ""
      },
      form2: {
        url: "",
        name: "",
      },
      form3: {
        language: "cn",
        template_id: "",
        content: ""
      },
      id: "",
      agent_id: "",
      name: "",
      category: "",
      doc_fragment_visible: false,
      doc_fragment: [],
      data_source_visible: false,
      data_source: [],
      visible: false,
      pptvisible: false,
      pptloading: false,
      pptexport: false,
      pptanswer: "",
      reportvisible: false,
      reportloading: false,
      reportexport: false,
      reportanswer: "",
      question: "",
      chatList: [],
      qaStream: null,
      loading: false,
      shortcuts: [],
      opening_remarks: "",
      strLoading: `<div class="loading"><div></div><div></div><div></div></div>\r`,
      resultStr: "",
      reportList: [],
      templateList: [],
      shareCodes: [],
      genShareCodeLoading: false,
      user: '', // 选中项的内容
      queryString: '', // 搜索值
      showApi: false,
      showStaff: false,
      showReport: false,
      showDialog: false, // 是否显示弹窗
      atIndex: 0,
      questionSave: '',
      position: {
        x: 300,
        y: 200
      }// 弹窗显示位置
    };
  },
  created() {
    this.id = Number(this.$route.params.id);
    this.name = this.$route.query.name;
    this.agent_id = Number(this.$route.query.agent_id);
    this.category = this.$route.query.category;
    this.getHistoryList();
    this.getSysPrompt();
    // this.getReportList();
    // this.getTemplateList();
    this.getShareCodes();
    if (store.state.user.roles.includes('senior')) {
      this.showApi=true;
    }
  },
  methods: {
    openToApiBtn() {
      this.$request({
        url: "/tech/amp/virtualStaff/releaseinfo",
        method: "get",
        params: {
          agent_id: this.agent_id,
          virtual_id: this.id,
        },
      })
      .then(({ data }) => {
        // this.form1.release_record = data.release_record;
        // this.form1.model_code = data.model_code;
        this.$router.push({
          path: '/senior/api',
          query: { modelCode:data.model_code },
        });
      })
      .catch(() => {
      });
    },
    getHistoryListByShareCode(share_code) {
      this.$request({
        url: "/tech/virtualStaff/shareChatRecord",
        method: "get",
        params: { share_code: share_code, page: 1, limit: 1000 },
      })
        .then(({ data }) => {
          let share_code_history = "";
          for (let i = 0; i < data.length; i++) {
            share_code_history += "问："+data[i].question + "\n答："+data[i].answer+"\n";
            share_code_history = share_code_history.replace(/<p>/g, "");
            share_code_history = share_code_history.replace(/<\/p>/g, "");
          }
          this.question = share_code_history;
        })
        .catch(() => {});
    },
    getShareCodes() {
      const params = {
        agent_id: this.agent_id,
        page: 1,
        limit: 1000
      };
      this.$request({
        url: "/tech/amp/virtualStaff/getShareCodesByAgentId",
        method: "get",
        params,
      }).then((res) => {
        this.shareCodes = res.data;
      });
    },
    openSharePage(share_code){
      const url = `${window.location.origin}/?ui_locales=zh_CN#/s/${share_code}`;
      window.open(url, '_blank');
    },
    getTemplateList() {
      const data = {
        page: 1,
        limit: 1000
      };
      this.$request({
          url: "/tech/amp/reporttemplate/list",
          method: "get",
          data,
        }).then((res) => {
        this.templateList = res.data.list;
      })
      .catch((err) => {
        console.log(err);
      });
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
          url: "/tech/amp/virtualStaff/delChatRecord ",
          method: "post",
          data: {  agent_id: this.agent_id},
        })
        .then(({ data }) => {
          this.chatList=[];
          this.getHistoryList();
        })
        .catch(() => {});
      })
      .catch(() => {});
    },
    confirmDelete(id) {
      this.$confirm("确定删除该报告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/tech/amp/virtualStaff/reportDelete",
            method: "post",
            data: { id: id},
          })
            .then(() => {
              this.$message.success("删除成功");
              this.getReportList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    getReportList() {
      const params = {
        virtual_id: this.id
      };
      this.$request({
        url: "/tech/amp/virtualStaff/reportList",
        method: "get",
        params,
      })
        .then(({ data }) => {
          this.reportList = data;
        })
        .catch(() => {
        });
    },
    openReportPage(virtual_id,name,agent_id,content,language,template_id){
      this.$router.push({
        path: '/staffs/report',
        query: { virtual_id,name,agent_id,title: this.name,id:"",content:content,language:language,template_id:template_id},
      });

    },
    openNewPage(virtual_id,name,agent_id,content){
      this.html = marked(reportanswer)
      var parser = new DOMParser();
      var doc = parser.parseFromString(this.html, "text/html");
      // 获取<h1>标签
      var h1 = doc.querySelector('h1');
      // 获取<h1>标签的内容
      const htmlTitle = h1 ? h1.textContent : this.htmlTitle;
      this.$request({
        url: "/tech/amp/virtualStaff/reportCreateOrUpdate",
        method: "post",
        data: { id: "", virtual_id: virtual_id, title: htmlTitle, content: content, question: "test" },
      })
      .then(({ data }) => {
        this.$router.push({
          path: '/staffs/report',
          query: { virtual_id,name,agent_id,title: htmlTitle,id:data.id},
        });
      })
      .catch(() => {});

    },
    openEditPage(agent_id,name,{id,virtual_id,title}){
      this.$router.push({
        path: '/staffs/report',
        query: { virtual_id,name,title,agent_id,id},
      });
    },
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
    stopGenerate() {
      this.pptexport = false;
      this.pptloading = false;
      this.reportexport = false;
      this.reportloading = false;
    },
    openGenerateReport() {
      // this.reportvisible=true;
      let message = "";
      for (let x of this.chatList){
        message += "问："+x.question+"\n答："+x.answer+"\n";
      }
      message = message.replace(/<p>/g, "");
      message = message.replace(/<\/p>/g, "");
      this.question = message;
    },
    openGenerateppt() {
      this.pptvisible=true;
      let message = "";
      for (let x of this.chatList){
        message += x.question+"\n"+x.answer+"\n";
      }
      message = message.replace(/<p>/g, "");
      message = message.replace(/<\/p>/g, "");
      this.form1.pptInput = message;
    },
    generateppt(type) {
      if (type=='ppt') {
        if (this.form1.pptInput === "") {
          this.$message.error("没有内容");
          return;
        }
        this.pptloading = true;
        this.pptexport = true;

        const source = new SSE("/ppt/v1/feishu/doc/ask", {
          method: "POST",
          payload: JSON.stringify(
            {
              template: this.form1.template,
              language: this.form1.language,
              pptType: this.form1.pptType,
              type: type,
              message: this.form1.pptInput,
            }
          ),
        });
        this.qaStream = source;
        source.onmessage = (e) => {
          const data = JSON.parse(e.data).data;
          this.pptanswer += data.content;
        };
        source.addEventListener("stop", (e) => {
          this.stopGenerate();
        });
        source.onerror = (event) => {
          this.stopGenerate();
        };
        source.stream();
      }else{
        this.pptexport = true;
        // this.pptanswer = '{"title":"PPT生成示例","slides":{"slide1":[{"type":"text","content":"PPT生成示例"},{"type":"text","content":"汇报人：小红"}],"slide2":[{"type":"text","content":"目录"},{"type":"text","content":"CONTENTS"},{"type":"text","content":"01"},{"type":"text","content":"基本问候"},{"type":"text","content":"02"},{"type":"text","content":"问题处理"},{"type":"text","content":"03"},{"type":"text","content":"复杂对话"},{"type":"text","content":"04"},{"type":"text","content":"测试对话"}],"slide3":[{"type":"text","content":"PART 01"},{"type":"text","content":"基本问候"}],"slide4":[{"type":"text","content":"基本问候"},{"type":"text","content":"你好"},{"type":"text","content":"您好"},{"type":"text","content":"你叫什么名字"},{"type":"text","content":"大家好我是小达机器人,很高兴为您服务!"}],"slide5":[{"type":"text","content":"问题处理"},{"type":"text","content":"漏水了"},{"type":"text","content":"漏水了？您指的是什么方面呢？是家里水管漏水还是其他地方？"},{"type":"text","content":"停水了"},{"type":"text","content":"停水了？那怎么办呢？"}],"slide6":[{"type":"text","content":"复杂对话"},{"type":"text","content":"卫生间脏乱差"},{"type":"text","content":"您好，请问您需要什么帮助？"}],"slide7":[{"type":"text","content":"测试对话"},{"type":"text","content":"测试一下"},{"type":"text","content":"这是测试答案。您还可以问我：的就业怎么样"},{"type":"text","content":"测试6"},{"type":"text","content":"好的，我们开始吧。请告诉我你的名字和性别。"}],"slide8":[{"type":"text","content":"PART 02"},{"type":"text","content":"深入对话"}],"slide9":[{"type":"text","content":"深入对话"},{"type":"text","content":"天气怎么样"},{"type":"text","content":"今日天气晴朗，温度适中，适宜外出。"},{"type":"text","content":"今天有什么新闻"},{"type":"text","content":"今日头条新闻有：经济改革取得重大进展。"}],"slide10":[{"type":"text","content":"复杂讨论"},{"type":"text","content":"关于AI的未来"},{"type":"text","content":"AI技术正在迅速发展，未来可能会在各个领域带来革命性的变化。"},{"type":"text","content":"关于环境保护"},{"type":"text","content":"环境保护是全球面临的重要问题，需要各国共同努力，采取积极措施。"}],"slide11":[{"type":"text","content":"日常对话"},{"type":"text","content":"你喜欢什么颜色"},{"type":"text","content":"我喜欢蓝色，因为蓝色让人感到平静。"},{"type":"text","content":"你会做饭吗"},{"type":"text","content":"我不会做饭，但我可以告诉你一些简单的食谱。"}],"slide12":[{"type":"text","content":"PART 03"},{"type":"text","content":"总结与展望"}],"slide13":[{"type":"text","content":"汇报总结"},{"type":"text","content":"对话总结"},{"type":"text","content":"本PPT展示了不同类型的对话示例，包括基本问候、问题处理、复杂对话等。"}],"slide18":[{"type":"text","content":"感谢您的观看"},{"type":"text","content":"汇报人：小红"}]}}'
        const obj = JSON.parse(this.pptanswer.replace(/```json/g, '').replace(/```/g, ''));
        const params = JSON.stringify({
          ...obj,
          template: this.form1.template,
          type: this.form1.pptType
        });
        this.$request({
          method: 'POST',
          url: '/ppt/v1/feishu/doc/ask',
          responseType: 'blob',
          data: {
            message: params,
            type: type
          }
        })
        .then((res) => {
          this.pptexport = false;
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = obj.title + '.pptx';
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => {
          debugger
          console.log(err)
          this.pptexport = false;
        })
      }
    },
    getSysPrompt() {
      const params = {
        agent_id: this.agent_id
      };
      this.$request({
        url: "/tech/amp/virtualStaff/getSysPrompt",
        method: "get",
        params
      })
        .then(({ data: { commands,opening_remarks } }) => {
          this.shortcuts = commands;
          this.opening_remarks = opening_remarks;
        })
        .catch(() => {
        })
    },
    back() {
      this.$router.replace({
        path: `/team/staffs`,
      });
    },
    share(){
      this.visible = true
    },
    genShareCodebtn() {
      this.genShareCodeLoading = true;
      const params = {
        id: this.id,
        name: this.form2.name
      };
      this.$request({
        url: "/tech/amp/virtualStaff/getShareCode",
        method: "get",
        params,
      })
      .then(({ data }) => {
        const url = `${window.location.origin}/?ui_locales=zh_CN#/s/${data}`;
        this.form2.url = url;
        console.log( this.form2.url)
        this.genShareCodeLoading = false;
      })
      .catch(() => {
        this.genShareCodeLoading = false;
      });
    },
    copybtn() {
      copy(this.form2.url)
      this.$message.success('复制成功')
      this.visible = false
      getShareCodes();
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
      let agent_id = undefined
      let category = undefined
      if (this.user != "" && this.user.report_id !=0 && this.user.report_id!=-1){
        this.$request({
          url: "/tech/amp/reporttemplate/info",
          method: "get",
          params: { id: this.user.report_id },
        })
        .then(({ data }) => {
          this.template_content = data.content;
          this.connectToReportSSE();
        })
        .catch(() => {});
      }else{
        if (this.user != ""){
          agent_id = Number(this.user.id)
          category = this.user.category
        }else {
          agent_id = this.agent_id
          category = this.category
        }
        if (category === '其他智能载体') {
          this.connectToMultiDocChatSSE(agent_id)
        } else if (category === '绘画智能人') {
          this.connectToChatSSE(agent_id,5);
        } else {
          this.connectToChatSSE(agent_id,4);
        }
      }
    },
    connectToChatSSE(agent_id,chat_type) {
      this.loading = true;
      const json = {
        agent_id: agent_id,
        question: this.question,
        chat_type: chat_type
      }
      chatSseRequset(json, this.successCallback, this.errCallback);
    },
    connectToMultiDocChatSSE(agent_id) {
      this.loading = true;
      const json = {
        agent_id: agent_id,
        question: this.question,
      }
      multiDocChatSseRequset(json, this.successMultiDocCallback, this.errCallback);
    },
    connectToReportSSE() {
      this.questionSave = this.question;
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
      this.resultStr;
      var html1 = md.render(this.resultStr);
      html1 = html1.replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">')
      const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"")

      this.$set(this.chatList, this.chatList.length - 1, {
          ...this.chatList[this.chatList.length - 1],
          answer: html,
        });
      console.log(this.user)
      if(this.user != "" && this.user.report_id !=0 && this.user.report_id !=-1){
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        // 获取<h1>标签
        var h1 = doc.querySelector('h1');
        // 获取<h1>标签的内容
        const htmlTitle = h1 ? h1.textContent : this.htmlTitle;
        this.htmlTitle = htmlTitle;
        if (this.questionSave == "") {
          this.questionSave = "test"
        }
        this.$request({
          url: "/tech/amp/virtualStaff/reportCreateOrUpdate",
          method: "post",
          data: { id: "", virtual_id: this.user.virtual_id, title: this.htmlTitle, content: this.resultStr, question: this.questionSave },
        })
        .then(({ data }) => {
        })
        .catch(() => {});
      }
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
    keyDown(e) {
      if (this.showDialog) {
        e.preventDefault();
      }else if (!e.shiftKey && !this.loading) {
        this.send('');
        e.preventDefault();
      }
    },
    inputValue(e) {
      if (e == "@" && this.user == ""){
        this.position = {
          x: document.getElementById("message_input").getBoundingClientRect().x,
          y: document.getElementById("message_input").getBoundingClientRect().y-238
        }
        this.showDialog = true;
      }else{
        this.showDialog = false;
      }
    },
    scrollBottom() {
      this.$nextTick(() => {
        const ele = document.getElementById("answer");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    pptScrollBottom() {
      this.$nextTick(() => {
        const ele = document.getElementById("pptanswer");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    reportScrollBottom() {
      this.$nextTick(() => {
        const ele = document.getElementById("reportanswer");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    getHistoryList() {
      this.$request({
        url: "/tech/amp/virtualStaff/chatRecord",
        method: "get",
        params: { agent_id: this.agent_id, page: 1, limit: 1000 },
      })
        .then(({ data }) => {
          for (let i = 0; i < data.length; i++) {
            try {
              const answer = JSON.parse(data[i].answer);
              data[i].answer = marked(answer.integrate_answer).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"");
              if (answer.doc_fragment) {
                data[i].doc_fragment = answer.doc_fragment;
              }
              if (answer.doc_source) {
                data[i].data_source = answer.doc_source;
              }
            } catch (error) {
              data[i].answer = marked(data[i].answer).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"");
            }
          }
          this.chatList = data;
        })
        // .catch(() => {
        //   this.chatList = data.map(({ answer, ...extra }) => ({
        //     ...extra,
        //     answer: marked(answer),
        //     doc_fragment: this.doc_fragment,
        //     data_source: this.data_source,
        //   }));
        // })
        .catch(() => {});
    },
    cancelAt() {
      this.showStaff = false;
      this.showReport = false;
      this.user = ""
    },
    replaceString (raw, replacer) {
      return raw.replace(/@([^@\s]*)$/, replacer)
    },
    handleKeyDown (e) {
      console.log("handleKeyDown")
      if (this.showDialog) {
        if (e.code === 'ArrowUp' ||
          e.code === 'ArrowDown' ||
          e.code === 'Enter') {
          e.preventDefault()
        }
      }
    },
    // 插入标签后隐藏选择框
    handlePickUser (user) {
      this.question = ""
      this.user = user
      this.showDialog = false
      this.showStaff = true
      const params = {
        agent_id: this.user.id
      };
      this.$request({
        url: "/tech/amp/virtualStaff/getSysPrompt",
        method: "get",
        params
      })
        .then(({ data: { report_id } }) => {
          console.log("report_id", report_id);
          this.user.report_id = report_id;
          console.log("user.report_id", this.user.report_id);
          if (report_id!=null && report_id!=undefined && report_id!=0 && report_id!="" && report_id!=-1) {
            this.showReport = true
          }else {
            this.showReport = false
          }
        })
        .catch(() => {
        })
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
    pptanswer(){
      this.pptScrollBottom();
    },
    reportanswer(){
      this.reportScrollBottom();
    }
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
</style>

