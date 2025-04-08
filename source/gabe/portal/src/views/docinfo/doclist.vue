<template>
  <div id="prompt_list">
    <el-row>
      <el-col :span="24" style="height: 100vh">
        <div
          style="padding: 20px; height: calc(100% - 50px); overflow-y: auto"
        >
          <el-form
            ref="form1"
            :inline="true"
            :model="searchForm"
            @submit.native.prevent
            size="small"
          >
            <el-form-item>
              <el-input
                v-model="searchForm.name"
                style="width: 220px"
                @keyup.enter.native="searchSubmit"
                placeholder="请输入名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchSubmit">
                搜索
              </el-button>
              <el-button @click="resetForm()"> 重置 </el-button>
              <el-button @click="refresh()"> 刷新列表 </el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button size="small" type="primary" @click="addDocInfotBtn">
                上传文档
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="isTableLoading"
            :data="tableData"
            style="width: 100%"
            border
          >
            <el-table-column prop="id" label="ID" width="180" align="center"/>
            <el-table-column prop="file_name" label="文件名" width="220" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="handleFileView(scope.row)"
                  >{{ scope.row.file_name }}</el-link
                >
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="180">
              <template slot-scope="scope">
                {{ scope.row.status }}
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="进度" width="180">
              <template slot-scope="scope">
                {{ scope.row.progress }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="add_user_name" label="添加人" width="180" v-show="false">
              <template slot-scope="scope">
                {{ scope.row.add_user_name ? scope.row.add_user_name : "--" }}
              </template>
            </el-table-column>
            <el-table-column prop="owner_name" label="拥有者" width="180" v-show="false">
              <template slot-scope="scope">
                {{ scope.row.owner_name ? scope.row.owner_name : "--" }}
              </template>
            </el-table-column> -->
            <el-table-column
              prop="add_time"
              label="添加时间"
              :formatter="formatDate"
              width="180"  align="center"
            />
            <el-table-column prop="file_url" label="文件地址" align="center">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="480" trigger="hover">
                  <div>{{ scope.row.file_url }}</div>
                  <span slot="reference">{{
                    scope.row.file_url.substr(0, 80) + "..."
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-link
                    type="primary"
                    :underline="false"
                    class="operate_style"
                    @click="moveFileBtn(scope.$index, scope.row)"
                  >
                  迁移
                </el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  class="operate_style"
                  @click="delFileBtn(scope.$index, scope.row)"
                >
                  删除
                </el-link>
                  
              </template>
            </el-table-column>
          </el-table>
          <div class="margin-top-20 text-align-right">
            <el-pagination
              :current-page="pageNum"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <!-- 上传知识库dialog -->
          <el-dialog
            title="上传知识库"
            :visible.sync="docUploadVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="800px"
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
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="选择知识库"
      :visible.sync="dropdownVisible"
      :show-close="true"
      width="300px"
    >
      <div v-for="option in dirList" :key="option.id" style="display: flex;">
        <input
          type="radio"
          :id="option.id"
          :value="option.id"
          v-model="selectedOption"
        />
        <label :for="option.id" style="margin-left: 10px;">{{ option.kb_name }}</label>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dropdownVisible=!dropdownVisible">
          取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="moveFileReq(selectedOption)"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import { uploadFile } from "@/api/docinfo.js";

export default {
  data() {
    return {
      kb_id: 0,
      kb_name: "",
      name: "",
      searchForm: {
        name: "",
      },
      isTableLoading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      docUploadVisible: false,
      mapList: [],
      fileInfo: {
      },
      upBtnLoading: false,
      upBtnDisabled: true,
      file_size: 0,
      ids: [],
      dropdownVisible: false,
      dirList: [],
      selectedOption: "",
      uploadFileLoading: false,
    };
  },
  created() {
    this.kb_id = Number(this.$route.params.id);
    this.kb_name = this.$route.query.kb_name;
    this.getKnowledgeList();
    this.getDirList();
  },
  methods: {
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
    resetForm() {
      this.searchForm = {
        name: "",
      };
      this.pageNum = 1;
      this.getKnowledgeList();
    },
    beforeAvatarUpload(file) {
      this.file_size = file.size;
      const isLt2M = file.size / 1024 / 1024 <= 50;
      if (!isLt2M) {
        this.$message.error("上传文档大小不能超过 50MB!");
      }
      return isLt2M;
    },
    refresh() {
      this.getKnowledgeList();
    },
    searchSubmit() {
      if (this.searchForm.name !== "") {
        this.getKnowledgeList();
      }
    },
    getKnowledgeList() {
      this.isTableLoading = true;

      const data = {
        page: this.pageNum,
        page_size: this.pageSize,
        file_name: this.searchForm.name,
        kb_id: this.kb_id,
      };
      this.$request({
            url: "/knowledgebase/mmue/api/qadock/list?lang=zh-CN",
            method: "post",
            data,
          }).then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.isTableLoading = false;
          // console.log(res)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addDocInfotBtn() {
      this.docUploadVisible = true;
      this.upBtnLoading = false;
      this.upBtnDisabled = true;
    },
    handleCurrentChange(page) {
      this.pageNum = page;

      this.getKnowledgeList();
    },
    formatDate(row, column) {
      let objectDate = new Date(row.add_time);

      let formatDate = objectDate.toLocaleString({
        dateStyle: "long",
        timeStyle: "short",
        hour24: true,
      });

      return formatDate;
    },
    uploadAddFn() {
      this.upBtnLoading = true;
      if (this.fileInfo.file_size) {
        this.file_size = this.fileInfo.file_size;
      }
      const data = {
        file_url: this.fileInfo.file_url,
        file_name: this.fileInfo.file_name,
        kb_id: this.kb_id,
        file_size: this.file_size,
      };

      this.$request({
            url: "/knowledgebase/mmue/api/qadock/add?lang=zh-CN",
            method: "post",
            data,
          }).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: "知识库文件添加成功!",
              type: "success",
            });

            this.docUploadVisible = false;
            this.mapList = [];
            this.fileInfo = {};
            this.file_size = 0;
            this.pageNum = 1;
            this.getKnowledgeList();
          }
          // console.log(res, 'addfile')
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delFileBtn(index, row) {
      this.$confirm("确定删除此文件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            ids: [],
          };
          data.ids.push(row.id);

          this.$request({
            url: "/knowledgebase/mmue/api/qadock/del?lang=zh-CN",
            method: "post",
            data,
          }).then((res) => {
              if (res.code === 0) {
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });

                this.getKnowledgeList();
              }
            })
            .catch((err) => {
              this.$message.error("删除失败!请重试...");
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    moveFileBtn(index, row) {
      this.ids.push(row.id);
      console.log("this.kb_id:",this.kb_id);
      this.dirList = this.dirList.filter(item => {
        return item.id !== this.kb_id;
      });
      this.dropdownVisible = !this.dropdownVisible;
    },
    moveFileReq(kb_id) {
      const data = {
        kb_id: kb_id,
        ids: this.ids,
      };
      this.$request({
        url: "/knowledgebase/mmue/api/qadock/move?lang=zh-CN",
        method: "post",
        data,
      }).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: "迁移成功!",
              type: "success",
            });
            this.ids = [];
            this.selectedOption = ""
            this.getKnowledgeList();
            this.dropdownVisible = !this.dropdownVisible;
          }
        })
        .catch((err) => {
          this.$message.error("迁移失败!请重试...");
          console.log(err);
        });
    },
    handleFileView(scope) {
      if (scope.pdf_url !== "") {
        window.open(scope.pdf_url, "_blank");
      }
    },
    uploadCloseFn() {
      this.docUploadVisible = false;
      this.mapList = [];
      this.fileInfo = {};
    },
    uploadfileFn(params) {
      const forms = new FormData();
      forms.append("file1", params.file);
      forms.append("file_typo", "");
      this.uploadFileLoading = true;
      uploadFile(forms)
      .then((res) => {
          if (res.code === 0) {
            this.fileInfo = res.data;
            this.upBtnDisabled = false;
          }
          this.uploadFileLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.uploadFileLoading = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getKnowledgeList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getKnowledgeList();
    },
  },
};
</script>

<style lang="scss">
#prompt_list {
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
  .block {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .operate_style {
    margin-right: 5px;
    font-size: 12px;
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
  .dropdown {
    position: absolute;
    z-index: 10;
    /* 其他样式，比如位置、大小、背景等 */
  }
  
  .dropdown ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .el-upload-list {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 350px;
  }
}
</style>
