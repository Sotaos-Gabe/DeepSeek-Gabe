<template>
    <div class="detail-container">
      <div style="padding: 20px; height: calc(100vh - 40px)">
        <el-row style="margin-bottom: 10px">
          <el-col :span="15">
            <el-button type="primary" size="small" @click="back()">
              <i class="el-icon-back el-icon--left"></i>返回
            </el-button>
            <span style="color: rgb(132, 132, 132); font-size: 14px"
            >（Auto-saved {{ new Date() | formatDate }}）</span>
          </el-col>
          <el-col
            :span="9"
            style="text-align: right; display: flex; justify-content: flex-end">
  
            <!-- <span style="margin-top: 6px;">文件名</span>
            <el-input
              v-model="htmlTitle"
              style="width: 200px; margin-left: 10px; margin-right: 10px"
              size="small"
              placeholder="请输入文件名"
            />
            <el-button type="primary" size="small" :disabled="reportGenerate || html=='' || reportexport" v-on:click="downloadPdf()">
              <i class="el-icon-download el-icon--left"></i>导出PDF
            </el-button>
            <el-button type="primary" size="small" :disabled="reportGenerate" @click="openNewPage()">
              <i class="el-icon-share el-icon--left"></i>分享页面
            </el-button> -->
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="10" style="height: 100vh">
          <el-card style="height: 100%" shadow="never">
            <div class="detail1a">
              <div style="margin-top: -10px; margin-bottom: -10px;">
                <el-button :disabled="loading" size="small" type="primary" @click="addDocInfotBtn">
                  上传文档
                </el-button>
                <!-- <el-button :disabled="loading || s_content == ''" size="small" type="primary" @click="saveDocInfotBtn" style="float: right;margin-left: 20px;">
                  保存
                </el-button> -->
                <el-input
                  v-model="fileInfoS.name"
                  style="width: 100px; margin-left: 10px; margin-right: 10px;float: right;"
                  size="small"
                  placeholder="请输入名称"
                />
                <span style="margin-left: 20px;margin-top: 6px;float: right;">名称</span>
                
              </div>
              <el-card shadow="always" class="detail1a1">
                <div class="chatContent">
                  <el-input
                    style="margin-top: 5px"
                    type="textarea"
                    resize="none"
                    :rows="26"
                    v-model="s_content">
                  </el-input>
                </div>
              </el-card>
            </div>
          </el-card>
         
        </el-col>
        <el-col class="detail1" :span="3" style="height: 100vh">
          <div style="padding:20px;padding-top: 180px;padding-left: 45px;">
            <el-button :disabled="loading || s_content == ''" size="small" type="primary" @click="toMarkDownBtn">
              格式清洗<i class="el-icon-right"></i>
            </el-button>
          </div>
          <div style="padding:20px;padding-left: 45px;">
            <el-button :disabled="loading || s_content == ''" size="small" type="primary" @click="clearContentDir">
              通用清洗<i class="el-icon-right"></i>
            </el-button>
          </div>
          <div style="padding:20px;padding-left: 45px;">
            <el-button :disabled="loading || s_content == ''" size="small" type="primary" @click="openContentSelectBtn">
              定制清洗<i class="el-icon-right"></i>
            </el-button>
          </div>
        </el-col>
        <el-col :span="10" style="height: 100vh">
          <el-card style="height: 100%" shadow="never">
            <div class="detail1a">
              <div style="margin-top: -10px; margin-bottom: -10px;">
                <span style="margin-top: 6px;">名称</span>
                <el-input
                  v-model="fileInfoD.name"
                  style="width: 100px; margin-left: 10px; margin-right: 10px;"
                  size="small"
                  placeholder="请输入名称"
                />
                <el-button :disabled="loading || content == ''" size="small" type="primary" @click="exportTxtBtn" style="float: right;margin-left: 10px;">
                  导出TXT文档
                </el-button>
                <el-button :disabled="loading || content == ''" size="small" type="primary" @click="saveToSourceBtn" style="float: right;margin-left: 10px;">
                  保存到数据源
                </el-button>
                <el-button :disabled="loading || content == ''" size="small" type="primary" @click="saveToPromptBtn" style="float: right;margin-left: 10px;">
                  保存到提示词
                </el-button>
                <el-button :disabled="loading || content == ''" size="small" type="primary" @click="saveToknowledgeBaseBtn" style="float: right;margin-left: 10px;">
                  保存到知识库
                </el-button>
              </div>
              <el-card shadow="always" class="detail1a1">
                <div class="chatContent">
                  <el-input
                    style="margin-top: 5px"
                    type="textarea"
                    resize="none"
                    :rows="26"
                    v-model="content">
                  </el-input>
                </div>
              </el-card>
            </div>
          </el-card>
          <!-- <div style="height: 100%">
            <div style="padding: 10px; height: calc(100% - 80px);">
              <tinymce 
                v-model="s_content"
               :toolbar="toolbar"
               @upload="addDocInfotBtn"
               style="min-height: 650px;height: 100%; width: 100%" />
            </div>
          </div> -->
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="上传文档"
      :visible.sync="docUploadVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <div class="upload_box">
        <el-upload
          class="upload-demo"
          drag
          accept=".doc,.docx,.pdf,.txt,.md"
          action="#"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadfileFn"
          :multiple="false"
          :limit="1"
          :file-list="mapList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            只能上传doc,docx,pdf,txt,md文件,且每次只能上传一个
          </div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadCloseFn">
          取 消
        </el-button>
        <i v-if="uploadFileLoading" class="el-icon-loading" />
        <el-button
          size="small"
          type="primary"
          :loading="upBtnLoading"
          :disabled="upBtnDisabled"
          @click="uploadAddFn"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500px"
      :title="'模板选择'"
      :visible.sync="show_template"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="模板" prop="template_id">
          <el-select
              v-model="form.template_id"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="show_template = false"> 取 消 </el-button>
        <el-button
          size="small"
          type="primary"
          @click="toSelectContent"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择知识库"
      :visible.sync="dropdownVisible"
      :show-close="true"
      width="500px"
    >
    <el-form
        ref="form1"
        :model="form1"
        :rules="rules1"
        size="small"
        label-width="80px"
      >
        <el-form-item label="知识库" prop="kb_id">
          <el-select
              v-model="form1.kb_id"
              style="width: 300px"
              placeholder="请选择知识库"
              size="small"
            >
            <el-option
              v-for="item in dirList"
              :key="item.id"
              :label="item.kb_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dropdownVisible=!dropdownVisible"> 取 消 </el-button>
        <el-button
          size="small"
          type="primary"
          @click="toknowledgeBaseBtn(form1.kb_id)"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
  </template>
  <script>
  import Vue from "vue";
  // import Tinymce from '@/components/Tinymce'
  import { uploadFile,docContentHandlerSseRequset } from "@/api/docinfo.js";
  // import { insertPrompt } from "@/api/prompt.js";
  import store from '@/store'
  export default {
    name: "Report",
    components: {
        // Tinymce
    },
    data() {
      return {
        id: "",
        d_id: "",
        name: "",
        virtual_id: "",
        s_content: "",
        content: "",
        loading: false,
        dropdownVisible: false,
        form1: {
          kb_id: "",
        },
        dirList: [],
        show_template: false,
        form: {
          template_id: "",
        },
        template_content: "",
        templateList: [],
        isTableLoading: false,
        docUploadVisible: false,
        mapList: [],
        fileInfoS: {
          name: ""
        },
        fileInfoD: {
          name: ""
        },
        prompt_id:"",
        upBtnLoading: false,
        upBtnDisabled: true,
        file_size: 0,
        uploadFileLoading: false,
        toolbar:['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist charmap anchor pagebreak insertdatetime table emoticons forecolor backcolor fullscreen'],
        rules: {
          template_id: [
            { required: true, message: "请选择模板", trigger: "blur" },
          ],
        },
        rules1: {
          kb_id: [
            { required: true, message: "请选择知识库", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      this.id = this.$route.query.id;
      if (this.id && this.id!=""){
        this.getDataSource();
      }
    },
    methods: {
      getDataSource(){
        const params = {
          _id: this.id,
        };
        this.$request({
            url: "/ppt/v1/yaovia/getDocInfo",
            method: "get",
            params,
          }).then((res) => {
          this.fileInfoS = res.data;
          this.s_content = this.fileInfoS.content;
          // console.log(res)
        })
        .catch((err) => {
          console.log(err);
        });
      },
      getTemplateList() {
        this.templateList = [];
        const data = {
          page: 1,
          limit: 1000
        };
        this.$request({
            url: "/tech/amp/reporttemplate/list",
            method: "get",
            data,
          }).then((res) => {
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].category == "extract") {
              // console.log(res.data.list[i])
              this.templateList.push(res.data.list[i]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      saveToSourceBtn(){
        const name = this.fileInfoD.name;
        this.$request({
          method: 'POST',
          url: '/ppt/v1/yaovia/saveDocInfo',
          data: {
            _id: this.d_id,
            username: store.getters.name,
            content: this.content,
            name: name,
            filename: this.fileInfoD.name,
            file_type: "text",
          }
        })
        .then((res) => {
          this.d_id = res.data;
          console.log(res);
          this.$message({
                message: "保存成功!",
                type: "success",
           });
        })
        .catch((err) => {
          console.log(err);
        })
      },
      saveDocInfotBtn(){
        // this.fileInfoS.name = this.fileInfoS.filename.split(".")[0];
        this.$request({
          method: 'POST',
          url: '/ppt/v1/yaovia/saveDocInfo',
          data: {
            _id: this.id,
            username: store.getters.username,
            content: this.s_content,
            name: this.fileInfoS.name,
            filename: this.fileInfoS.filename,
            file_type: this.fileInfoS.file_type,
          }
        })
        .then((res) => {
          this.id = res.data;
          console.log(res);
          // this.$message({
          //       message: "保存成功!",
          //       type: "success",
          //  });
           
        })
        .catch((err) => {
          console.log(err);
        })
      },
      clearContentDir(){
        const json = {
          username: store.getters.name,
          content: this.s_content,
          handleType: "toClearDir"
        }
        this.docContentHandlerSSE(json)
      },
      openContentSelectBtn(){
        this.getTemplateList();
        this.show_template = true;
      },
      toSelectContent(){
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.show_template = false;
            this.getTemplateContent();
          }
        });
      },
      getTemplateContent() {
        this.$request({
          url: "/tech/amp/reporttemplate/info",
          method: "get",
          params: { id: this.form.template_id },
        })
        .then(({ data }) => {
          this.template_content = data.content;
          const json = {
            username: store.getters.name,
            content: this.s_content,
            template: this.template_content,
            handleType: "toSelectContent"
          }
          this.docContentHandlerSSE(json);
        })
        .catch(() => {});
      },
      toMarkDownBtn(){
        const json = {
          username: store.getters.name,
          content: this.s_content,
          handleType: "toMarkdown"
        }
        this.docContentHandlerSSE(json)
      },
      docContentHandlerSSE(json) {
        this.loading = true;
        this.content = ""
        this.fileInfoD.name = this.fileInfoS.name;
        docContentHandlerSseRequset(json, this.successCallback, this.errCallback);
      },
      successCallback(msg) {
        if (msg.event == "stop") {
          this.stopCallback();
        }else {
          this.loading = false;
          const data = JSON.parse(msg.data).data;
          this.content += data.content;
        }
      },
      stopCallback() {
        this.loading = false;
      },
      errCallback(err) {
        this.loading = false;
      },
      saveToknowledgeBaseBtn(){
        this.getDirList();
        this.dropdownVisible = !this.dropdownVisible;
      },
      getDirList() {
        const data = {
          page: 1,
          page_size: 100,
        };
        this.$request({
              url: "/knowledgebase/mmue/api/qadockb/list?lang=zh-CN",
              method: "post",
              data,
            }).then((res) => {
            this.dirList = res.data.list;
            // console.log(res)
          })
          .catch((err) => {
            console.log(err);
          });
      },
      toknowledgeBaseBtn(kb_id){
        this.$refs["form1"].validate((valid) => {
          if (valid) {
            this.$request({
              method: 'POST',
              url: '/ppt/v1/yaovia/toSaveKnowledgebase',
              data: {
                content: this.content,
                name: this.fileInfoD.name
              }
            })
            .then((res) => {
              if (res.code === 0) {
                const data = {
                  file_url: res.data.file_url,
                  file_name: res.data.file_name,
                  kb_id: kb_id,
                  file_size: res.data.file_size,
                };

                this.$request({
                  url: "/knowledgebase/mmue/api/qadock/add?lang=zh-CN",
                  method: "post",
                  data,
              }).then((res) => {
              if (res.code === 0) {
                this.$message({
                  message: "添加知识库成功!",
                  type: "success",
                });

                this.dropdownVisible = !this.dropdownVisible;
              }
              console.log(res, 'addfile')
            })
            .catch((err) => {
              console.log(err);
            });
          }
        })
        .catch((err) => {
          console.log(err)
        });
          }
        });
      },
      saveToPromptBtn(){
        const data = {
              id: this.prompt_id,
              name: this.fileInfoD.name,
              prompt: this.content,
              description: this.fileInfoD.name,
            };
        this.$request({
            url: "/prompt/v1/yaovia/addPrompt",
            method: "post",
            data,
          })
          .then((res) => {
            this.prompt_id = res.data
            this.$message({
              message: "添加成功!",
              type: "success",
            });
          })
          .catch((err) => {
            this.$message.error("添加失败!请重试...");
            console.log(err);
          });
      },
      exportTxtBtn() {
        const blob = new Blob([this.content], {
          type: "text/plain;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${this.fileInfoD.name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      addDocInfotBtn() {
        this.docUploadVisible = true;
        this.upBtnLoading = false;
        this.upBtnDisabled = true;
      },
      uploadCloseFn() {
        this.docUploadVisible = false;
        this.mapList = [];
        this.fileInfoS = {
          name: "",
        };
      },
      beforeAvatarUpload(file) {
        this.file_size = file.size;
        const isLt2M = file.size / 1024 / 1024 <= 50;
        if (!isLt2M) {
          this.$message.error("上传文档大小不能超过 50MB!");
        }
        return isLt2M;
      },
      uploadfileFn(params) {
        const forms = new FormData();
        forms.append("file1", params.file);
        forms.append("file_typo", "handle");
        this.uploadFileLoading = true;
        uploadFile(forms)
        .then((res) => {
            if (res.code === 0) {
              this.fileInfoS = res.data;
              this.fileInfoS.name = this.fileInfoS.filename.split(".")[0];
              this.upBtnDisabled = false;
            }
            this.uploadFileLoading = false;
          })
          .catch((err) => {
            console.log(err);
            this.uploadFileLoading = false;
          });
      },
      uploadAddFn() {
        this.upBtnLoading = true;
        this.s_content = this.fileInfoS.content;
        this.docUploadVisible = false;
      },
      back() {
        this.$router.replace({
          path: `/develop/datasource`,
        });
      },
      scrollBottom() {
        this.$nextTick(() => {
          const ele = document.getElementById("answer");
          ele.scrollTop = ele.scrollHeight;
        });
      },
    },
    watch: {
      s_content(next, prev) {
        if (this.s_content!=""){
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.saveDocInfotBtn();
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
  .upload_box {
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }
  .el-upload-list__item .el-icon-close {
    display: absolute;
    top: -9999px;
    right: -9999px;
  }
  .el-upload-list {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 350px;
  }

</style>
  
  