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
                新建模板
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
            <el-table-column prop="name" label="模板名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="模板类型" align="center">
              <template slot-scope="scope">
                <span>{{ categoryobject[scope.row.category] }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <div>{{ scope.row.create_time | formatDate }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
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
                  @click="goDetail(scope.row)"
                >
                  编辑
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
              :current-page="page_no"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="page_size"
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
      width="500px"
      :title="id ? '修改模板' : '添加模板'"
      :visible.sync="docUploadVisible"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            style="width: 300px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="类型" prop="category">
          <el-select
              v-model="form.category"
              style="width: 300px"
              placeholder="请选择类型"
              size="small"
            >
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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

export default {
  data() {
    return {
      categoryobject: {
        courseware:"课件模板",
        report: "报告模板",
        extract: "信息提取",
        question: "出题模板",
      },
      categoryList:
      [
        { label: "课件模板", value: "courseware" },
        { label: "报告模板", value: "report" },
        { label: "信息提取", value: "extract" },
        { label: "出题模板", value: "question" },
      ],
      searchForm: {
        file_name: "",
      },
      form: {
        name: "",
        category: "",
      },
      id: "",
      rules: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        category: [{ required: true, message: "请选择模板类型", trigger: "change" }],
      },
      isTableLoading: false,
      tableData: [],
      page_no: 1,
      page_size: 10,
      total: 0,
      docUploadVisible: false,
    };
  },
  created() {
    this.getTemplateList();
  },
  methods: {
    goDetail({ id, name, category }) {
      this.$router.push({
        path: `/template/${id}`,
        query: { name, category},
      });
    },
    updateDirBtn(index, row) {
      this.id = row.id;
      this.form.name = row.name;
      this.form.category = row.category;
      this.docUploadVisible = true;
    },
    resetForm() {
      this.searchForm = {
        name: "",
      };
      this.page_no = 1;
      this.getTemplateList();
    },
    searchSubmit() {
      if (this.searchForm.name !== "") {
        this.getTemplateList();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTemplateList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTemplateList();
    },
    getTemplateList() {
      this.isTableLoading = true;
      const params = {
        page: this.page_no,
        limit: this.page_size,
        name: this.searchForm.name,
      };
      this.$request({
          url: "/tech/amp/reporttemplate/list",
          method: "get",
          params,
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
      this.form = {
        name: "",
        category: "",
      };
      this.docUploadVisible = true;
    },
    handleCurrentChange(page) {
      this.page_no = page;
      this.getTemplateList();
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
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = {};
          let resp_msg = "";
          let url = "";
          if (this.id) {
            data = {
              id: this.id,
              name: this.form.name,
              category: this.form.category,
            };
            resp_msg = "模板修改成功!";
            url = "/tech/amp/reporttemplate/update";
          }else{
            data = {
              name: this.form.name,
              category: this.form.category,
            };
            resp_msg = "模板添加成功!";
            url = "/tech/amp/reporttemplate/create";
          }
            this.$request({
              url: url,
              method: "post",
              data,
            }).then((res) => {
              this.$message({
                message: resp_msg,
                type: "success",
              });
              this.id = "";
              this.form.name = "";
              this.docUploadVisible = false;
              this.page_no = 1;
              this.getTemplateList();
          })
          .catch((err) => {
            console.log(err);
          });
        }});
      },
      delFileBtn(index, row) {
        this.$confirm("确定删除此模板吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          const data = {
            id: row.id,
            status: -1
          };

          this.$request({
            url: "/tech/amp/reporttemplate/update",
            method: "post",
            data,
          }).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.getTemplateList();
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
