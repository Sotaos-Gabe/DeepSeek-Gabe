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
            </el-form-item>
            <el-form-item style="float: right">
              <el-button size="small" type="primary" @click="addDocInfotBtn">
                新建知识库
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="isTableLoading"
            border
            class="margin-top-10"
            :data="tableData"
            element-loading-text="Loading"
            fit
            highlight-current-row
            max-height="650"
          >
            <el-table-column prop="id" label="ID" align="center"/>
            <el-table-column prop="kb_name" label="知识库名称" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="handleFileView(scope.row)"
                  >{{ scope.row.kb_name }}</el-link
                >
              </template>
            </el-table-column>
            <!-- <el-table-column prop="add_user_name" label="添加人" width="180" v-show="false">
              <template slot-scope="scope">
                {{ scope.row.add_user_name ? scope.row.add_user_name : "--" }}
              </template>
            </el-table-column> -->
            <el-table-column prop="owner_name" label="租户编码" align="center">
              <template slot-scope="scope">
                {{ scope.row.owner_name ? scope.row.owner_name : "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="add_time"
              label="添加时间"
              :formatter="formatDate"
               align="center"
            />
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  class="operate_style"
                  @click="updateDirBtn(scope.$index, scope.row)"
                >
                  修改
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
        </div>
      </el-col>
    </el-row>
    <el-dialog
      width="800px"
      :title="id ? '修改知识库' : '添加知识库'"
      :visible.sync="docUploadVisible"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="150px"
      >
        <el-form-item label="名称" prop="kb_name">
          <el-input
            v-model="form.kb_name"
            placeholder="请输入名称"
            style="width: 300px"
            maxlength="50"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="docUploadVisible = false"> 取 消 </el-button>
        <el-button
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
export default {
  data() {
    return {
      searchForm: {
        file_name: "",
      },
      form: {
        kb_name: "",
      },
      id: "",
      rules: {
        kb_name: [{ required: true, message: "请输入知识库名称", trigger: "blur" }],
      },
      isTableLoading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      docUploadVisible: false,
    };
  },
  created() {
    this.getKnowledgeList();
  },
  methods: {
    updateDirBtn(index, row) {
      this.id = row.id;
      this.form.kb_name = row.kb_name;
      this.docUploadVisible = true;
    },
    resetForm() {
      this.searchForm = {
        name: "",
      };
      this.pageNum = 1;
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
      };
      this.$request({
            url: "/knowledgebase/mmue/api/qadockb/list?lang=zh-CN",
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
    add() {
      let data = {};
      let resp_msg = "";
      let url = "";
      if (this.id) {
        data = {
          id: this.id,
          kb_name: this.form.kb_name,
        };
        resp_msg = "知识库修改成功!";
        url = "/knowledgebase/mmue/api/qadockb/edit?lang=zh-CN";
      }else{
        data = {
          kb_name: this.form.kb_name,
        };
        resp_msg = "知识库添加成功!";
        url = "/knowledgebase/mmue/api/qadockb/add?lang=zh-CN";
      }
      this.$request({
            url: url,
            method: "post",
            data,
          }).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: resp_msg,
              type: "success",
            });
            this.id = "";
            this.form.kb_name = "";
            this.docUploadVisible = false;
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
      this.$confirm("确定删除此知识库吗?", "提示", {
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
            url: "/knowledgebase/mmue/api/qadockb/del?lang=zh-CN",
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
    handleFileView({ id, kb_name }) {
      this.$router.push({
        path: `/team/knowledgebase/${id}`,
        query: { kb_name},
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
}
</style>
