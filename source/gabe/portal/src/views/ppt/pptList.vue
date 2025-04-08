<template>
  <div class="home-container">
    <el-row>
      <el-col :span="24" style="height: 100vh">
        <div style="padding: 20px; height: calc(100% - 50px); overflow-y: auto">
          <el-form ref="form1" :inline="true" :model="form1" size="small">
            <el-form-item>
              <el-button 
                size="big"
                type="text" 
                style="color: black;padding-top: 0px;"
                @click="back"
                  >|<i class="el-icon-back el-icon--left"></i>
              </el-button>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="form1.name"
                style="width: 220px"
                @keyup.enter.native="search"
                placeholder="请输入课件名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search"> 搜索 </el-button>
              <el-button @click="resetForm()"> 重置 </el-button>
              <el-button type="primary" @click="search"> 刷新 </el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="listLoading"
            border
            :data="list"
            element-loading-text="Loading"
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="名称" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="问题内容">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="500" trigger="hover">
                  <div>{{ scope.row.question }}</div>
                  <span slot="reference">{{
                    scope.row.question.length>5?scope.row.question.substr(0, 5) + "...": scope.row.question
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="生成方式">
              <template slot-scope="scope">
                <div>{{ scope.row.model == 'fast' ? "快速" : "灵活" }}</div>
              </template>
            </el-table-column> -->
            <el-table-column align="center" label="文件名">
              <template slot-scope="scope">
                <div>{{ scope.row.ppt_file }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="模板名">
              <template slot-scope="scope">
                <div>{{ ppt_templates[scope.row.template] }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="开始时间">
              <template slot-scope="scope">
                <div>{{ scope.row.create_time | formatDate }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="完成时间">
              <template slot-scope="scope">
                <div>{{ scope.row.update_time | formatDate }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <div>{{ scope.row.status == 0 ? "已完成" : "生成中"}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <a v-if="scope.row.status == 0"
                  style="margin-left: 6px"
                  :href="`/ppt/v1/yaovia/ppt/download/`+scope.row.ppt_file" 
                >
                  下载
                </a>
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="confirmDelete(scope.row)"
                >
                  删除
                </el-button>
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
  </div>
</template>

<script>
import Vue from "vue";
import store from '@/store'
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      form1: {
        name: "",
      },
      pageNum: 1,
      total: 0,
      pageSize: 10,
      visible: false,
      addLoading: false,
      uploadLoading: false,
      ppt_templates: {
        "edu_template1": "淡蓝简约",
        "edu_template2": "卡通清新",
        "beige": "米黄经典",
        "bubbles": "可爱泡泡",
        "blue": "蓝色风雅",
        "lively": "活泼可爱",
        "green": "绿色经典",
        "refreshing_green": "绿色清新",
        "warm_red": "温馨红色",
        "warm_family": "温馨家庭",
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },

  methods: {
    back() {
      this.$router.replace({
        path: `/frontpage`,
      });
    },
    resetForm() {
      this.form1 = {
        name: "",
      };
      this.pageNum = 1;
      this.getList();
    },
    confirmDelete(row) {
      
      this.$confirm("确定删除该PPT?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/ppt/v1/yaovia/delppt",
            method: "post",
            data: {
              _id: row._id,
            },
          })
            .then(() => {
              this.$message.success("删除成功");
              this.getList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    search() {
      this.pageNum = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      const params = {
        page: this.page_no,
        page_size: this.page_size,
        user_id: store.getters.userId,
      };
      if (this.form1.name) {
        params.name = this.form1.name;
      }
      this.$request({
        url: "/ppt/v1/yaovia/ppts",
        method: "get",
        params,
      })
        .then(({ data: { list, total } }) => {
          this.listLoading = false;
          this.list = list;
          this.total = total;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
