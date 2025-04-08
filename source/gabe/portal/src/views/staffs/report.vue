<template>
    <div class="detail-container">
      <div style="padding: 20px; height: calc(100vh - 40px)">
        <el-row style="margin-bottom: 10px">
          <el-col :span="14">
            <el-button type="primary" size="small" @click="back(virtual_id, agent_id, name, template_id)">
              <i class="el-icon-back el-icon--left"></i>返回
            </el-button>
            <span style="color: rgb(132, 132, 132); font-size: 14px"
            >（Auto-saved {{ new Date() | formatDate }}）</span>
            <!-- <el-select v-if="show_template"
              v-model="template_id"
              style="width: 200px"
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
            <el-button v-if="show_template" style="margin-left: 10px;" type="primary" size="small" :disabled="reportGenerate" @click="generateReport()">
              <i class="el-icon-refresh "></i>生成
            </el-button> -->
          </el-col>
          <el-col
            :span="10"
            style="text-align: right; display: flex; justify-content: flex-end">
  
            <span style="margin-top: 6px;">文件名</span>
            <el-input
              v-model="htmlTitle"
              style="width: 200px; margin-left: 10px; margin-right: 10px"
              size="small"
              placeholder="请输入文件名"
            />
            <!-- <el-button type="primary" size="small" :disabled="reportGenerate || html=='' || reportexport" v-on:click="download('word_export')">
              <i class="el-icon-download el-icon--left"></i>导出Word
            </el-button> -->
            <el-button type="primary" size="small" :disabled="reportGenerate || html=='' || reportexport" v-on:click="openExportPPT()">
              <i class="el-icon-download el-icon--left"></i>生成PPT
            </el-button>
            <el-button type="primary" size="small" :disabled="reportGenerate || html=='' || reportexport" v-on:click="openPPTList()">
              <i class="el-icon--left"></i>PPT列表
            </el-button>
            <el-button type="primary" size="small" :disabled="reportGenerate || html=='' || reportexport" v-on:click="download('pdf_export')">
              <i class="el-icon-download el-icon--left"></i>导出PDF
            </el-button>
            <el-button type="primary" size="small" :disabled="reportGenerate" @click="openNewPage()">
              <i class="el-icon-share el-icon--left"></i>分享页面
            </el-button>
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="2" style="height: 100vh">
          <div class="row" id="pdfDom" v-show="false" >
            {{ html }}
          </div>
        </el-col>
        <el-col class="detail1" :span="20" style="height: 100vh">
          <div style="height: 100%">
            <div style="padding: 10px; height: calc(100% - 80px);">
              <mavon-editor
                v-model="report"
                ref="md"
                @change="change"
                @save="save"
                style="min-height: 550px;height: 100%; width: 100%"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="1" style="height: 100vh">
        </el-col>
      </el-row>
    </div>
    <el-dialog
      width="500px"
      :title="'PPT生成'"
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
            <el-option label="淡蓝简约" :value="'edu_template1'"></el-option>
            <el-option label="卡通清新" :value="'edu_template2'"></el-option>
            <el-option label="米黄经典" :value="'beige'"></el-option>
            <el-option label="可爱泡泡" :value="'bubbles'"></el-option>
            <el-option label="蓝色风雅" :value="'blue'"></el-option>
            <el-option label="活泼可爱" :value="'lively'"></el-option>
            <el-option label="绿色经典" :value="'green'"></el-option>
            <el-option label="绿色清新" :value="'refreshing_green'"></el-option>
            <el-option label="温馨红色" :value="'warm_red'"></el-option>
            <el-option label="温馨家庭" :value="'warm_family'"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="方式" prop="template">
          <el-select
            v-model="form1.model"
            style="width: 300px"
            placeholder="请选择生成方式"
          >
            <el-option label="快速（固定布局）" :value="'fast'">
            </el-option>
            <el-option label="灵活（大模型布局）" :value="'flex'">
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div style="margin-top: 60px;margin-left: 80px;margin-right: 80px;margin-bottom: 20px;">
        <el-button size="small" @click="pptvisible = false"> 取 消 </el-button>
        <el-button style="float: right"
          size="small"
          type="primary"
          @click="download('ppt_export')"
        >
          生成PPT
        </el-button>
      </div>
    </el-dialog>
  </div>
  </template>
  <script>
  import Vue from "vue";
  import store from '@/store'
  import { SSE } from "@/utils/sse";
  import { marked } from "marked";
  // 导入组件 及 组件样式
  import { mavonEditor } from "mavon-editor";
  import "mavon-editor/dist/css/index.css";
  import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
  export default {
    name: "Report",
    components: {
        mavonEditor,
    },
    data() {
      return {
        id: "",
        agent_id: "",
        name: "",
        report: "",
        html:'',
        reportexport: false,
        htmlTitle: "",
        virtual_id: "",
        content: undefined,
        language: "cn",
        reportGenerate: false,
        show_template: false,
        template_id: "",
        template_content: "",
        templateList: [],
        isTableLoading: false,
        pptvisible: false,
        question: "",
        form1: {
          template: "",
          model: "fast",
        },
      };
    },
    created() {
      // const reportanswer = this.$route.query.reportanswer;
      this.virtual_id = Number(this.$route.query.virtual_id);
      this.id = this.$route.query.id;
      this.language = this.$route.query.language;
      this.agent_id = Number(this.$route.query.agent_id);
      this.name = this.$route.query.name;
      this.htmlTitle = this.$route.query.title;
      this.content = this.$route.query.content;
      this.template_id = Number(this.$route.query.template_id);
      debugger;
      if (this.id == "" && this.content!=undefined && this.template_id !=undefined) {
        if (this.template_id == 0) {
          this.generateReport();
        } else {
          this.getTemplateContent();
        }
        // this.show_template = true;
      }else {
        this.getReport();
      }
    },
    methods: {
      // handleMermaid(val) {
      //   const mermaidElement = this.$refs.mermaid;
      //   const insertSvg = (svgCode) => {
      //     mermaidElement.innerHTML = svgCode;
      //   };
      //   mermaid.mermaidAPI.render("mermaid", val, insertSvg);
      // },
      stopGenerate() {
        this.reportGenerate = false;
      },
      getTemplateContent() {
        this.$request({
          url: "/tech/amp/reporttemplate/info",
          method: "get",
          params: { id: this.template_id },
        })
        .then(({ data }) => {
          this.template_content = data.content;
          this.generateReport();
        })
        .catch(() => {});
      },
      generateReport() {
        this.reportGenerate = true;
        const source = new SSE("/ppt/v1/feishu/doc/ask", {
          method: "POST",
          payload: JSON.stringify(
            {
              language: this.language,
              type: "report",
              message: this.content,
              template: this.template_content,
            }
          ),
        });
        this.qaStream = source;
        source.onmessage = (e) => {
          const data = JSON.parse(e.data).data;
          this.report += data.content;
          this.html = marked(this.report)
        };
        source.addEventListener("stop", (e) => {
          // this.report = this.report.replace("```markdown","").replace("```","");
          const md = require('markdown-it')({
                html: true,
                linkify: true,
                typographer: true
              }).use(markdownItMermaid);
          // var html = marked(data.content);
          var html1 = md.render(this.report);
          this.html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">')
          // this.html = marked(this.report)
          var parser = new DOMParser();
          var doc = parser.parseFromString(this.html, "text/html");
          // 获取<h1>标签
          var h1 = doc.querySelector('h1');
          // 获取<h1>标签的内容
          const htmlTitle = h1 ? h1.textContent : this.htmlTitle;
          this.htmlTitle = htmlTitle;
          this.$request({
            url: "/tech/amp/virtualStaff/reportCreateOrUpdate",
            method: "post",
            data: { id: "", virtual_id: this.virtual_id, title: this.htmlTitle, content: this.report, question: "test" },
          })
          .then(({ data }) => {
            this.id = data.id ? data.id : "";
          })
          .catch(() => {});
          this.stopGenerate();
          
        });
        source.onerror = (event) => {
          this.stopGenerate();
        };
        source.stream();
      },
      openNewPage() {
        window.open(`${window.location.origin}?ui_locales=zh_CN#/s/report/${this.id}`,"_blank");
      },
      getReport() {
        this.$request({
          url: "/tech/virtualStaff/reportShareInfo",
          method: "get",
          params: { id: this.id },
        })
        .then(({ data }) => {
          this.report = data.content;
          this.question = data.question;
          const md = require('markdown-it')({
                html: true,
                linkify: true,
                typographer: true
              }).use(markdownItMermaid);
              // var html = marked(data.content);
          var html1 = md.render(data.content).replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">');
          this.html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">')
          // this.html = marked(data.content)
          this.htmlTitle = data.title;
        })
        .catch(() => {});
      },
      change(value, render) {
        this.html = render
      },
      save() {
        this.$request({
          url: "/tech/amp/virtualStaff/reportCreateOrUpdate",
          method: "post",
          data: { id: this.id, virtual_id: this.virtual_id, title: this.htmlTitle, content: this.report, question: "test" },
        })
        .then(({ data }) => {
          this.id = data.id ? data.id : "";
          // this.$message.success("修改成功");
        })
        .catch(() => {});
      },
      openExportPPT() {
        this.pptvisible = true;
      },
      openPPTList() {
        window.open(`${window.location.origin}/#/staffs/pptList?agent_id=${this.agent_id}&username=${store.getters.name}`,"_blank");
        // this.$router.replace({
        //   path: `/staffs/pptList`,
        //   query: { agent_id: this.agent_id, username:store.getters.name },
        // });
      },
      download(type) {
        this.reportexport = true;
        this.pptvisible = false;
        const formatter = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g;
        this.htmlTitle = this.htmlTitle.replace(formatter,'');
        let data = {
            agent_id: this.agent_id,
            user_id: store.getters.name,
            message: this.report,
            type: type,
            title: this.htmlTitle
          }
        if (type === 'ppt_export') {
          data["template"] = this.form1.template;
          data["model"] = this.form1.model;
          data["question"] = this.question;
        }
        this.$request({
          method: 'POST',
          url: '/ppt/v1/feishu/doc/ask',
          responseType: 'blob',
          data: data
        })
        .then((res) => {
          this.reportexport = false;
          if (type === 'ppt_export') {
            // this.openPPTList();
          }else {
            const blob = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            if (type === 'pdf_export') {
              a.download = this.htmlTitle + '.pdf';
            } else if (type === 'ppt_export') {
              a.download = this.htmlTitle + '.pptx';
            } else if (type === 'word_export') {
              a.download = this.htmlTitle + '.docx';
            }
            a.click();
            window.URL.revokeObjectURL(url);
            }
        })
        .catch((err) => {
          debugger  
          console.log(err)
          this.reportexport = false;
        })
      },
      back(id, agent_id, name, template_id) {
        this.$router.replace({
          path: `/reportorstaffsuse/${id}`,
          query: { name, agent_id , template_id },
        });
      },
      change(value, render){
            // render 为 markdown 解析后的结果[html]
            this.html = render;
      },
      scrollBottom() {
        this.$nextTick(() => {
          const ele = document.getElementById("answer");
          ele.scrollTop = ele.scrollHeight;
        });
      },
    },
    watch: {
      report(next, prev) {
        if (!this.reportGenerate){
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.save();
          }, 400);
        }
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
  
  