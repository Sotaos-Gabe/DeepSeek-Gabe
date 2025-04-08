<template>
  <div id="datasource_list">
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
              <el-button size="small" type="primary" @click="docHandleBtn">
                文档处理
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
            <el-table-column prop="_id" label="ID" align="center"/>
            <el-table-column prop="name" label="名称" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="handleFileView(scope.row)"
                  >{{ scope.row.name }}</el-link
                >
              </template>
            </el-table-column>
            <!-- <el-table-column prop="add_user_name" label="添加人" width="180" v-show="false">
              <template slot-scope="scope">
                {{ scope.row.add_user_name ? scope.row.add_user_name : "--" }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="owner_name" label="租户编码" align="center">
              <template slot-scope="scope">
                {{ scope.row.owner_name ? scope.row.owner_name : "--" }}
              </template>
            </el-table-column> -->
            <el-table-column
              prop="create_time"
              label="添加时间"
              :formatter="formatDate"
               align="center"
            />
            <el-table-column
              prop="update_time"
              label="更新时间"
              :formatter="updateFormatDate"
               align="center"
            />
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  class="operate_style"
                  @click="handleDataSource(scope.$index, scope.row)"
                >
                  处理
                </el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  class="operate_style"
                  @click="delDataSourceBtn(scope.$index, scope.row)"
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
  </div>
</template>
<script>
import Vue from "vue";
import store from '@/store'
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
      isTableLoading: false,
      tableData: [],
      page_no: 1,
      page_size: 10,
      total: 0,
      docUploadVisible: false,
    };
  },
  created() {
    this.getDataSourceList();
  },
  methods: {
    delDataSourceBtn(index, row) {
      this.$confirm("确定删除此数据源吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.$request({
          url: "/ppt/v1/yaovia/deleteDocInfo",
          method: "post",
          data: {
            _id: row._id,
          },
        }).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getDataSourceList();
        });
      });
    },
    handleDataSource(index, row) {
      this.$router.push({
        path: "/dochandler",
        query: {
          id: row._id,
        },
      });
    },
    resetForm() {
      this.searchForm = {
        name: "",
      };
      this.page_no = 1;
      this.getDataSourceList();
    },
    searchSubmit() {
      if (this.searchForm.name !== "") {
        this.getDataSourceList();
      }
    },
    getDataSourceList() {
      this.isTableLoading = true;

      const params = {
        page: this.page_no,
        page_size: this.page_size,
        username: store.getters.name,
        name: this.searchForm.name,
      };
      this.$request({
            url: "/ppt/v1/yaovia/dataSourceList",
            method: "get",
            params,
          }).then((res) => {
          this.tableData = res.data.items;
          this.total = res.data.total;
          this.isTableLoading = false;
          // console.log(res)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatDate(row, column) {
      let objectDate = new Date(row.create_time);
      let formatDate = objectDate.toLocaleString({
        dateStyle: "long",
        timeStyle: "short",
        hour24: true,
      });
      return formatDate;
    },
    updateFormatDate(row, column) {
      let objectDate = new Date(row.update_time);
      let formatDate = objectDate.toLocaleString({
        dateStyle: "long",
        timeStyle: "short",
        hour24: true,
      });
      return formatDate;
    },
    docHandleBtn() {
      this.$router.push({
        path: `/dochandler`
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataSourceList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getDataSourceList();
    },
  },
};
</script>

<style lang="scss">
#datasource_list {
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
