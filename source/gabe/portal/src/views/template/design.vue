<template>
    <div class="detail-container">
      <div style="padding: 20px; height: calc(100vh - 40px)">
        <el-row style="margin-bottom: 10px">
          <el-col :span="16">
            <el-button type="primary" size="small" @click="back()">
              <i class="el-icon-back el-icon--left"></i>返回
            </el-button>
            {{ name }}
            <span style="color: rgb(132, 132, 132); font-size: 14px"
            >（Auto-saved {{ new Date() | formatDate }}）</span>
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
  </div>
  </template>
  <script>
  import Vue from "vue";
  import { marked } from "marked";
  // 导入组件 及 组件样式
  import { mavonEditor } from "mavon-editor";
  import "mavon-editor/dist/css/index.css";
  export default {
    name: "Report",
    components: {
        mavonEditor,
    },
    data() {
      return {
        id: "",
        name: "",
        report: "",
        category: "",
        html:'',
        language: "cn",
        default_template: "# 数宁数智化建设发展路线图\n## 一、需求识别\n在【具体场景】中，谈【具体需求】，导致需求产生的【具体原因】，需要在多长【具体时间】解决，涉及哪些【人群】。\n###  1. 需求采集\n|线上场景|需求 |原因 |时效 |人群 |\n|------|------|------|------|------|\n|政策解答|打造可以准确回复各类政策问询的客服|1.目前市场上没有成熟产品<br>2.大模型+RAG技术无法达到【全面、准确】的使用需求|越快越好|公务人员|\n\n###  2. 需求分析\n|人群|关注点|本质原因 |\n|------|------|------|\n|企业用户|能够<b>【随时、便捷】</b>进行咨询|需要增加咨询渠道以及服务时长|\n\n###  3. 解决对策\n\n|对策|内容|备注|\n|------|------|------|\n|强化|公务人员及企业用户使用技巧||\n\n###  4. 需求定级\n|优先级|内容|备注|\n|------|------|------|\n|P1|政策问答数智员工||\n## 二、项目定位\n\n以客户需求为基础，我方提出具体建议，双方进行目标对齐\n\n###  1. 客户需求\n\n请填写客户需求\n\n###  2. 我方建议\n请填写我方建议\n\n###  3. 目标对齐\n请填写目标对齐\n\n## 三、策划规划\n\n【三不原则】无策划不执行，无规划不执行，无目标不执行\n\n###  1. 总体架构\n请填写总体架构\n\n###  2. 创新原则\n请填写创新原则\n\n###  3. 创新目标\n请填写创新目标\n\n###  4. 创新流程\n```mermaid\ngraph LR\nA[成立联合创新实验室] --> B(政务服务-专业大模型)\nZ(专业多模态知识图谱) --> B(政务服务-专业大模型)\nB --> C(政策问答服务-专精大模型)\nB --> D(其他服务-专精大模型)\nB --> F(其他服务-专精大模型)\nC --> F(其他服务-专精大模型)\nD --> F(其他服务-专精大模型)\nE[算力服务] --> F{数智底座}\nF--> G((虚拟数智人))\nF--> H((实体人形机器人))\nF--> I((其他智能终端))\nG --> J((私有化部署))\nH --> J((私有化部署))\nI --> J((私有化部署))\nJ --> K(孪生空间建设)\nK --> L(规模化复制)\nY(专精多模态知识图谱) --> C(政务服务-专业大模型)\nY(专精多模态知识图谱) --> D(政务服务-专业大模型)\n```\n\n## 四、实施方案\n\n【四不原则】无对标不实施，无规划不执行\n\n###  1. 技术框架\n请填写技术框架\n\n###  2. 对标产品\n请填写对标产品\n\n###  3. 产品设计\n请填写产品设计\n\n###  4. 安全部署\n请填写安全部署\n\n###  5. 计划周期\n请填写计划周期\n\n## 五、项目统筹\n\n###  1. 项目预算\n请填写项目预算\n\n###  2. 决策人\n请填写决策人\n\n###  3. 管理团队\n请填写管理团队\n\n###  4. 技术团队\n请填写技术团队\n\n###  5. 交付产品\n请填写交付产品"
      };
    },
    created() {
      this.id = Number(this.$route.params.id);
      this.name = this.$route.query.name;
      this.category = this.$route.query.category;
      if (this.category == 'courseware'){
        this.default_template = "# The main title of the courseware, for example: Unit1\n## catalogue\n- 01 Title\n- 02 Title\n- 03 Title\n- 04 Title \n- 05 Title \n## PART 01 Title\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n- 3.Subtitle\ncontent\n## PART 02 Title\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n- 3.Subtitle\ncontent\n- 4.Subtitle\ncontent\n## PART 03 Title\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n- 3.Subtitle\ncontent\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n## PART 04 Title\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n- 3.Subtitle\ncontent\n### Title\n- 1.Subtitle\ncontent\n- 2.Subtitle\ncontent\n## PART 05 Title\n### Title\n- 1. Questions\n- 2. Answer\n- 3. Questions\n- 4. Answer\n- 5. Questions\n- 6. Answer\n### Key Words(Limit to 6)\n- Key word 1\n- Key word 2\n- Key word 3\n- Key word 4\n- Key word 5\n- Key word 6\n\n"
      }
      this.getReport()
    },
    methods: {
      getReport() {
        this.$request({
          url: "/tech/amp/reporttemplate/info",
          method: "get",
          params: { id: this.id },
        })
        .then(({ data }) => {
          if (data.content == '') {
            data.content = this.default_template;
          }
          this.report = data.content;
          this.html = marked(data.content)
          this.name = data.name;
        })
        .catch(() => {});
      },
      change(value, render) {
        this.html = render
      },
      save() {
        this.$request({
          url: "/tech/amp/reporttemplate/update",
          method: "post",
          data: { id: this.id, name: this.name, content: this.report },
        })
        .then(({ data }) => {
          this.id = data.id ? data.id : "";
          // this.$message.success("修改成功");
        })
        .catch(() => {});
      },
      back() {
        this.$router.replace({
          path: "/develop/template",
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
  
  