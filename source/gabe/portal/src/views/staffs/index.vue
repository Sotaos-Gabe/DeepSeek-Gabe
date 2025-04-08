<template>
  <div class="home-container">
    <el-row>
      <el-col :span="24" style="height: 100vh">
        <div style="padding: 20px; height: calc(100% - 50px); overflow-y: auto">
          <el-form ref="form1" :inline="true" :model="form1" size="small">
            <el-form-item label="员工名称" prop="name">
              <el-input
                v-model="form1.name"
                style="width: 220px"
                @keyup.enter.native="search"
                placeholder="请输入员工名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search"> 搜索 </el-button>
              <el-button @click="resetForm('form1')"> 重置 </el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button size="small" type="primary" @click="addData">
                新增
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="listLoading"
            border
            class="margin-top-10"
            :data="list"
            element-loading-text="Loading"
            fit
            highlight-current-row
            max-height="650"
          >
            <el-table-column align="center" label="ID">
              <template slot-scope="scope">
                <div>{{ scope.row.id }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="名称" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="图标" align="center">
              <template slot-scope="scope">
                <el-popover placement="right" trigger="hover">
                  <img
                    :src="scope.row.icon"
                    style="width: 200px; height: 200px"
                  />
                  <img
                    slot="reference"
                    :src="scope.row.icon"
                    style="max-height: 50px; max-width: 50px; cursor: pointer"
                  />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="职位">
              <template slot-scope="scope">
                <div>{{ scope.row.job_title }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="籍贯">
              <template slot-scope="scope">
                <div>{{ scope.row.birth_place }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="生日">
              <template slot-scope="scope">
                <div>{{ scope.row.birthday }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="性别">
              <template slot-scope="scope">
                <div>{{ scope.row.gender }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="语言">
              <template slot-scope="scope">
                <div>{{ scope.row.lang }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="scope">
                <div>{{ scope.row.category }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="工作场景">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="500" trigger="hover">
                  <div>{{ scope.row.work_scene }}</div>
                  <span slot="reference">{{
                    scope.row.work_scene.length>5?scope.row.work_scene.substr(0, 5) + "...": scope.row.work_scene
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="技能描述">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="500" trigger="hover">
                  <div>{{ scope.row.skill_description }}</div>
                  <span slot="reference">{{
                    scope.row.skill_description.length>5?scope.row.skill_description.substr(0, 5) + "...": scope.row.skill_description
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="行业领域">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="500" trigger="hover">
                  <div>{{ scope.row.industry_sector }}</div>
                  <span slot="reference">{{
                    scope.row.industry_sector.length>5?scope.row.industry_sector.substr(0, 5) + "...": scope.row.industry_sector
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="工作经历">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="500" trigger="hover">
                  <div>{{ scope.row.job_experience }}</div>
                  <span slot="reference">{{
                    scope.row.job_experience.length>5?scope.row.job_experience.substr(0, 5) + "...": scope.row.job_experience
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="自我评价">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="500" trigger="hover">
                  <div>{{ scope.row.self_evaluation }}</div>
                  <span slot="reference">{{
                    scope.row.self_evaluation.length>5?scope.row.self_evaluation.substr(0, 5) + "...": scope.row.self_evaluation
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <div>{{ scope.row.create_time | formatDate }}</div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="edit(scope.row.id)">
                  修改
                </el-button>
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="goDetail(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="goUse(scope.row)"
                >
                  使用
                </el-button>
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="confirmDelete(scope.row.id)"
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
      width="800px"
      :title="id ? '修改数智员工' : '新增数智员工'"
      :visible.sync="visible"
    >
      <h2 style="margin-left: 80px;margin-top: 0px;">基本资料：</h2>
      <el-form
        ref="form2"
        :model="form2"
        :rules="rules2"
        size="small"
        label-width="150px"
      >
      <el-form-item label="头像" prop="icon">
          <div style="width: 260px">
            <el-upload
              :class="{ 'hide-upload-btn': hideUploadBtn }"
              class="avatar-uploader"
              :action="action"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              :file-list="form2.icon"
              accept="image/png, image/jpeg"
              :on-success="onSuccess"
              :on-remove="uploadImgRemove"
              :on-change="handleEditChange"
            >
              <i class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <span style="color: rgb(73, 70, 70)"
              >注意：图片最大不要超过<b>10M</b></span
            >
          </div>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form2.name"
            placeholder="请输入名称"
            style="width: 300px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="类型" prop="category">
          <el-select
            v-model="form2.category"
            style="width: 300px"
            placeholder="请选择类型"
          >
            <el-option label="虚拟智能人" :value="'虚拟智能人'" />
            <el-option label="绘画智能人" :value="'绘画智能人'" />
            <el-option label="实体机器人" :value="'实体机器人'" />
            <el-option label="其他智能载体" :value="'其他智能载体'" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="form2.gender"
            style="width: 300px"
            placeholder="请选择性别"
          >
            <el-option label="男" :value="'男'" />
            <el-option label="女" :value="'女'" />
            <el-option label="无" :value="'无'" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input
            v-model="form2.birthday"
            style="width: 300px"
            placeholder="请输入生日"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="籍贯" prop="birth_place">
          <el-select
            v-model="form2.birth_place"
            style="width: 300px"
            placeholder="请选择籍贯"
          >
            <el-option label="北京" :value="'北京'"></el-option>
            <el-option label="上海" :value="'上海'"></el-option>
            <el-option label="天津" :value="'天津'"></el-option>
            <el-option label="重庆" :value="'重庆'"></el-option>
            <el-option label="河北" :value="'河北'"></el-option>
            <el-option label="山西" :value="'山西'"></el-option>
            <el-option label="辽宁" :value="'辽宁'"></el-option>
            <el-option label="吉林" :value="'吉林'"></el-option>
            <el-option label="黑龙江" :value="'黑龙江'"></el-option>
            <el-option label="江苏" :value="'江苏'"></el-option>
            <el-option label="浙江" :value="'浙江'"></el-option>
            <el-option label="安徽" :value="'安徽'"></el-option>
            <el-option label="福建" :value="'福建'"></el-option>
            <el-option label="江西" :value="'江西'"></el-option>
            <el-option label="山东" :value="'山东'"></el-option>
            <el-option label="河南" :value="'河南'"></el-option>
            <el-option label="湖北" :value="'湖北'"></el-option>
            <el-option label="湖南" :value="'湖南'"></el-option>
            <el-option label="广东" :value="'广东'"></el-option>
            <el-option label="海南" :value="'海南'"></el-option>
            <el-option label="四川" :value="'四川'"></el-option>
            <el-option label="贵州" :value="'贵州'"></el-option>
            <el-option label="云南" :value="'云南'"></el-option>
            <el-option label="陕西" :value="'陕西'"></el-option>
            <el-option label="甘肃" :value="'甘肃'"></el-option>
            <el-option label="青海" :value="'青海'"></el-option>
            <el-option label="台湾" :value="'台湾'"></el-option>
            <el-option label="内蒙古" :value="'内蒙古'"></el-option>
            <el-option label="广西" :value="'广西'"></el-option>
            <el-option label="西藏" :value="'西藏'"></el-option>
            <el-option label="宁夏" :value="'宁夏'"></el-option>
            <el-option label="新疆" :value="'新疆'"></el-option>
            <el-option label="香港" :value="'香港'"></el-option>
            <el-option label="澳门" :value="'澳门'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技能" prop="skill_description">
          <el-input
            v-model="form2.skill_description"
            style="width: 300px"
            placeholder="请输入技能"
            maxlength="200"
          />
        </el-form-item>
        <h2 style="margin-left: 80px;margin-top: 20px;">职场信息：</h2>
        <el-form-item label="行业领域" prop="industry_sector">
          <el-input
            v-model="form2.industry_sector"
            style="width: 300px"
            placeholder="请输入服务行业"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="工作场景" prop="work_scene">
          <el-input
            v-model="form2.work_scene"
            style="width: 300px"
            placeholder="请输入工作场景"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="职位" prop="job_title">
          <el-input
            v-model="form2.job_title"
            style="width: 300px"
            placeholder="请输入职位"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="语言" prop="lang">
          <el-select
            v-model="form2.lang"
            style="width: 300px"
            placeholder="请选择语言"
          >
            <el-option label="简体中文" :value="'zh-CN'" />
            <el-option label="英文" :value="'en-US'" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作经历" prop="job_experience">
          <el-input
            v-model="form2.job_experience"
            style="width: 300px"
            type="textarea"
            resize="none"
            :rows="3"
            placeholder="请输入工作经历"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <h2 style="margin-left: 80px;margin-top: 20px;">综合评估：</h2>
        <el-form-item label="自我评价" prop="self_evaluation">
          <el-input
            v-model="form2.self_evaluation"
            style="width: 300px"
            type="textarea"
            resize="none"
            :rows="3"
            placeholder="请输入自我评价"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false"> 取 消 </el-button>
        <el-button
          v-loading="addLoading"
          :disabled="uploadLoading"
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
      form2: {
        name: "",
        category: "虚拟智能人",
        icon: [],
        job_title: "",
        birth_place: "北京",
        birthday: "",
        gender: "无",
        lang: "zh-CN",
        work_scene: "",
        skill_description: "",
        industry_sector: "",
        job_experience: "",
        self_evaluation: "",
      },
      rules2: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择数智员工类型", trigger: "blur" },
        ],
      },
      uploadLoading: false,
      hideUploadBtn: false,
      action: '/tech/agent/uploadFile',
      id: "",
      skilltplid: 15,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
    this.getSkillTplList();
  },
  methods: {
    getSkillTplList() {
      this.$request({
        url: "/tech/amp/virtualStaff/getSkillTplID",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
            this.skilltplid = res.data;
        }
      }).catch(() => {});
    },
    resetForm() {
      this.form1 = {
        name: "",
      };
      this.pageNum = 1;
      this.getList();
    },
    confirmDelete(id) {
      this.$confirm("确定删除该数智员工?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/tech/amp/virtualStaff/delete",
            method: "post",
            data: { id: id},
          })
            .then(() => {
              this.$message.success("删除成功");
              this.getList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    goDetail({ id, agent_id, name, category }) {
      this.$router.push({
        path: `/staffsdesign/${id}`,
        query: { name, agent_id, category },
      });
    },
    goUse({ id, agent_id, name, category }) {
      const params = {
        agent_id: agent_id
      };
      this.$request({
        url: "/tech/amp/virtualStaff/getSysPrompt",
        method: "get",
        params
      })
        .then(({ data: { commands, report_id } }) => {
          this.shortcuts = commands;
          const template_id = (report_id==0 || report_id==-1)?'':report_id;
          if (template_id == '') {
            this.$router.push({
              path: `/staffsuse/${id}`,
              query: { name, agent_id, category },
            });
          } else {
            this.$router.push({
              path: `/reportorstaffsuse/${id}`,
              query: { name, agent_id, category, template_id },
            });
          }
        })
        .catch(() => {
        })
    },
    edit(id) {
      this.id = id;
      this.visible = true;
      this.hideUploadBtn = true;
      this.$nextTick(() => {
        this.$refs["form2"].clearValidate();
        const data = this.list.find((item) => item.id === id);
        this.form2 = {
          name: data.name,
          job_title: data.job_title,
          icon: [{ url: data.icon }],
          birth_place: data.birth_place,
          birthday: data.birthday,
          gender: data.gender,
          category: data.category,
          lang: data.lang,
          work_scene: data.work_scene,
          skill_description: data.skill_description,
          industry_sector: data.industry_sector,
          job_experience: data.job_experience,
          self_evaluation: data.self_evaluation,
        };
      });
    },
    add() {
      this.$refs["form2"].validate((valid) => {
        if (valid) {
          console.log(this.form2)
          this.addLoading = true;
          const data = {
            name: this.form2.name,
            job_title: this.form2.job_title,
            icon: this.form2.icon.length>0?this.form2.icon[0].url:"",
            birth_place: this.form2.birth_place,
            birthday: this.form2.birthday,
            gender: this.form2.gender,
            category: this.form2.category,
            lang: this.form2.lang,
            work_scene: this.form2.work_scene,
            skill_description: this.form2.skill_description,
            industry_sector: this.form2.industry_sector,
            job_experience: this.form2.job_experience,
            self_evaluation: this.form2.self_evaluation,
            skilltplid: this.skilltplid,
          };
          if (this.id) {
            data.id = this.id;
          } else {
            data.category = this.form2.category;
          }
          const url = this.id
            ? "/tech/amp/virtualStaff/update"
            : "/tech/amp/virtualStaff/create";
          this.$request({
            url,
            method: "post",
            data,
          })
            .then((res) => {
              debugger;
              this.addLoading = false;
              this.$message.success(this.id ? "修改成功" : "新建成功");
              this.visible = false;

              if (this.id) {
                this.id = "";
                this.getList();
              } else {
                const {
                  data: { id,agent_id, name },
                } = res;
                this.$router.push({
                  path: `/staffsdesign/${id}`,
                  query: { name, agent_id },
                });
              }
            })
            .catch(() => {
              this.addLoading = false;
            });
        }
      });
    },
    handleEditChange(file, fileList) {
      this.hideUploadBtn = fileList.length >= 1;
    },
    uploadImgRemove(file, fileList) {
      this.hideUploadBtn = fileList.length >= 1;
    },
    onSuccess({ data: { url } }) {
      this.uploadLoading = false;
      this.form2.icon = [{ url }];
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 <= 10;
      this.uploadLoading = true;
      if (!isLt2M) {
        this.uploadLoading = false;
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isLt2M;
    },
    addData() {
      this.visible = true;
      this.hideUploadBtn = false;
      this.id = "";
      // 获取当前日期
      var date = new Date();
      // 获取当前月份
      var nowMonth = date.getMonth() + 1;
      // 获取当前是几号
      var strDate = date.getDate();
      // 添加分隔符“-”
      var seperator = "-";
      // 对月份进行处理，1-9月在前面添加一个“0”
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
      }
      // 对月份进行处理，1-9号在前面添加一个“0”
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
      this.$nextTick(() => {
        this.$refs["form2"].clearValidate();
        this.form2 = {
          name: "",
          category: "虚拟智能人",
          icon: [],
          job_title: "",
          birth_place: "北京",
          birthday: nowDate,
          gender: "女",
          lang: "zh-CN",
          work_scene: "",
          skill_description: "",
          industry_sector: "",
          job_experience: "",
          self_evaluation: "",
        };
      });
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
        page: this.pageNum,
        limit: this.pageSize,
      };
      if (this.form1.name) {
        params.name = this.form1.name;
      }
      this.$request({
        url: "/tech/amp/virtualStaff/list",
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
