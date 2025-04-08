<template>
  <div id="setting-container">
    <div style="padding: 5px; height: calc(100vh - 20px)">
      <el-row style="margin-bottom: 10px">
        <el-col :span="6"
          ><el-button 
          size="big"
          type="text" 
          style="color: black;"
          @click="back"
            >|<i class="el-icon-back el-icon--left"></i></el-button
          >
        </el-col>
        <el-col
          :span="18"
          style="text-align: right; display: flex; justify-content: flex-end">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" style="height: 100vh">
        </el-col>
        <el-col class="detail1" :span="12" style="height: 100vh">
          <!-- <div v-html="html" style="height: 100%;width: 100%;overflow: auto">
          </div> -->
          <h1 style="font-weight: bold;">设置</h1>
          <!-- <div style="padding: 10px; margin-top: 10px">账号</div> -->
           <div style="padding: 10px; margin-top: 10px; color: #616060;">对话设置：</div>
           <el-form
            ref="form1"
            :model="form1"
            :rules="rules1"
            size="small"
            label-width="180px"
          >
            <el-form-item label="基于网络的URL" prop="networkUrl">
              <el-input
                v-model="form1.networkUrl"
                style="width: 500px"
                placeholder="请输入基于网络的URL"
                maxlength="256"
              />
            </el-form-item>
            <el-form-item label="基于网络的Key" prop="networkKey">
              <el-input
                v-model="form1.networkKey"
                style="width: 500px"
                placeholder="请输入基于网络的Key"
                maxlength="256"
              />
            </el-form-item>
            <el-form-item label="基于知识库的URL" prop="knowledgeBaseUrl">
              <el-input
                v-model="form1.knowledgeBaseUrl"
                style="width: 500px"
                placeholder="请输入基于知识库的URL"
                maxlength="256"
              />
            </el-form-item>
            <el-form-item label="基于知识库的Key" prop="knowledgeBaseKey">
              <el-input
                v-model="form1.knowledgeBaseKey"
                style="width: 500px"
                placeholder="请输入基于知识库的Key"
                maxlength="256"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                v-loading="saveLoading"
                size="small"
                type="danger"
                 style="margin-left: 130px;margin-right: 60px;"
                @click="getApiInfo"
              >
                重置
              </el-button>
              <el-button
                v-loading="saveLoading"
                size="small"
                type="primary"
                @click="save"
              >
                确 定
              </el-button>
            </el-form-item>
          </el-form>
          <hr/>
          <div style="padding: 10px; margin-top: 10px; color: #616060;">账号安全：
            <el-button
                size="big"
                type="text"
                style="float: right;margin-right: 20px;"
                @click="showUpdatePassword"
              >
                修改密码
            </el-button>
          </div>
          <div style="margin-top: 30px;background-color: #e4e7ed;width: 100%; text-align: center;">
            <el-button
                size="big"
                type="text"
                @click="logout"
              >退出登录
            </el-button>
          </div>
        </el-col>
        <el-col :span="6" style="height: 100vh;">
        </el-col>
      </el-row> 
    </div>
    <el-dialog
      width="600px"
      :title="'修改密码'"
      :visible.sync="updatepasswordVisible"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px" style="width: 600px;">
        <el-form-item label="旧密码" prop="oldpassword">
          <el-input v-model="form.oldpassword" type="password" autocomplete="off" style="width: 300px;"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input v-model="form.newpassword" type="password" autocomplete="off" style="width: 300px;"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="newpassword2">
          <el-input v-model="form.newpassword2" type="password" autocomplete="off" style="width: 300px;"/>
        </el-form-item>
      </el-form>
      <div style="margin-left: 200px;margin-top: 30px;">
        <el-button size="small" @click="closeUpdatePassword">取 消</el-button>
        <el-button size="small" type="primary" @click="updatePassword" v-loading="updatepasswordLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import { resetPassword } from '@/api/user';
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      const strongPasswordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!_@#$%^&*]).{8,40}$/;
      if (value === "") {
          callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newpassword) {
          callback(new Error("两次输入密码不一致!"));
      } else if (!strongPasswordRegex.test(value)) {
        callback(new Error('密码长度介于8到40之间，且至少包含数字、字母和特殊字符'))
      } else {
        callback()
      }
    }
    return {
      saveLoading: false,
      form1: {
        knowledgeBaseUrl: "",
        knowledgeBaseKey: "",
        networkUrl: "",
        networkKey: "",
      },
      rules1: {
        knowledgeBaseUrl: [
          { required: true, message: "请输入基于知识库的URL", trigger: "blur" },
        ],
        knowledgeBaseKey: [
          { required: true, message: "请输入基于知识库的Key", trigger: "blur" },
        ],
        networkUrl: [
          { required: true, message: "请输入基于网络的URL", trigger: "blur" },
        ],
        networkKey: [
          { required: true, message: "请输入基于网络的Key", trigger: "blur" },
        ]
      },
      updatepasswordVisible: false,
      updatepasswordLoading: false,
      form: {
        oldpassword: '',
        newpassword: '',
        newpassword2: ''
      },
      rules: {
          oldpassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newpassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          newpassword2: [
            { required: true, trigger: 'blur', validator: validatePassword }
          ]
        }
    };
  },
  created() {
    this.getApiInfo();
  },
  methods: {
    back() {
      this.$router.replace({
        path: `/frontpage`,
      });
    },
    save() {
      this.$refs["form1"].validate((valid) => {
        if (valid) {
          let data = [
            {
                "key": this.form1.knowledgeBaseKey,
                "api_url": this.form1.knowledgeBaseUrl,
                "ask_type":"1"
            },
            {
                "key": this.form1.networkKey,
                "api_url": this.form1.networkUrl,
                "ask_type":"2"
            }
          ]
          this.$request({
                url: "/tech/api/yao/user/agent/set",
                method: "post",
                data,
              }).then((res) => {
                this.$message.success('保存成功')
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getApiInfo(){
      this.$request({
            url: "/tech/api/yao/user/agent/get",
            method: "get",
          }).then((res) => {
            if (res.data ) {
              if (res.data.length > 0) {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].ask_type == 1) {
                    this.form1.knowledgeBaseUrl = res.data[i].api_url;
                    this.form1.knowledgeBaseKey = res.data[i].key;
                  } else if (res.data[i].ask_type == 2) {
                    this.form1.networkUrl = res.data[i].api_url;
                    this.form1.networkKey = res.data[i].key;
                  }
                }
              }
            }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showUpdatePassword() {
      this.updatepasswordVisible = true;
    },
    closeUpdatePassword() {
      this.updatepasswordVisible = false;
      this.$refs.form.resetFields();
    },
    updatePassword() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updatepasswordLoading = true;
          resetPassword({ new_pwd:this.form.newpassword, old_pwd: this.form.oldpassword })
            .then(({ data }) => {
              this.$message.success("修改成功");
              this.updatepasswordLoading = false;
              this.updatepasswordVisible = false;
            })
            .catch(() => {
              this.updatepasswordLoading = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
  },
};
</script>

<style lang="scss">
#setting-container {
  .detail1 ::v-deep .el-card__body {
    height: 100%;
  }
}
</style>
