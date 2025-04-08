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
                placeholder="请输入大纲名称"
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
            <el-table-column align="center" label="名称">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="生成时间">
              <template slot-scope="scope">
                <div>{{ scope.row.create_time | formatDate }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="selectStyleTemplate(scope.row)"
                >
                  选择风格模板导出
                </el-button>
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
    <el-dialog
      :title="'选择风格模板'"
      :visible.sync="visible"
    >
      <el-row style="margin-left: 40px;">
        <div v-for="({code,name,image},index) in styleList" :key="name">
          <el-col cols="auto" style="width: 230px; height: 150px;margin: 3px;">
            <el-card style="cursor:pointer;" class="list-card" :class="{ 'is-selected': styleSelectedIndex === index }">
              <el-image
                  @click="styleSelectedBtn(index)"
                :src="image"
              />
            </el-card>
          </el-col>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false"> 取 消 </el-button>
        <el-button
          size="small"
          type="primary"
          @click="expectPPT"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
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
      username: "",
      outlineSelected: {},
      styleSelectedIndex: 0,
      styleList:[
        {"code": "edu_template1","name": "经典淡蓝","image":"/img/edu_template1.jpg"},
        {"code": "edu_template2","name": "有趣卡通","image":"/img/edu_template2.jpg"},
        {"code": "beige","name": "经典米黄","image":"/img/beige.jpg"},
        {"code": "bubbles","name": "可爱泡泡","image":"/img/bubbles.jpg"},
        {"code": "blue","name": "蓝色风雅","image":"/img/blue.jpg"},
        {"code": "lively","name": "活泼可爱","image":"/img/lively.jpg"},
        {"code": "green","name": "绿色经典","image":"/img/green.jpg"},
        {"code": "refreshing_green","name": "绿色清新","image":"/img/refreshing_green.jpg"},
        {"code": "warm_red","name": "温馨红色","image":"/img/warm_red.jpg"},
        {"code": "warm_family","name": "温馨家庭","image":"/img/warm_family.jpg"},
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.username = this.$route.query.username;
    this.getList();
  },

  methods: {
    back() {
      this.$router.replace({
        path: `/ppt`,
      });
    },
    resetForm() {
      this.form1 = {
        name: "",
      };
      this.pageNum = 1;
      this.getList();
    },
    selectStyleTemplate(row) {
      this.visible = true;
      this.outlineSelected = row;
    },
    styleSelectedBtn(index) {
      console.log("=======================styleSelectedBtn=============================");
      console.log(index);
      this.styleSelectedIndex = index;
    },
    expectPPT() {
      this.visible = false;
      const data = {
        user_id:store.getters.userId,
        title:this.outlineSelected.name,
        template:this.styleList[this.styleSelectedIndex].code,
        message:this.outlineSelected.ppt_json
      }
      this.$request({
        url: "/ppt/v1/yaovia/ppt/ask_export_ppt",
        method: "post",
        data: data,
      })
        .then((res) => {
          this.$message.success("生成PPT成功");
          this.$router.replace({
            path: `/ppt/pptList`,
          });
        })
    },
    confirmDelete(row) {
      this.$confirm("确定删除该PPT大纲?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/ppt/v1/yaovia/delpptjson",
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
        url: "/ppt/v1/yaovia/pptjsons",
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
list-card {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.list-card:hover {
  background-color: #F7F7F9;
  .right-box {
    display: flex;
  }
}
.list-card.is-selected {
  background-color: #dcdcde;
  .right-box {
    display: flex;
  }
}
</style>
