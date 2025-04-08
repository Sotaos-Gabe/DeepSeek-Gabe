<template>
  <div class="dashboard-container">
    <div style="height: calc(100% - 50px); overflow-y: auto">
      <h3 style="margin-left: 150px;margin-top: 20px; margin-bottom: 30px;">修改密码</h3>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px" style="width: 600px;">
        <el-form-item label="旧密码" prop="oldpassword">
          <el-input v-model="form.oldpassword" type="password" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input v-model="form.newpassword" type="password" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="newpassword2">
          <el-input v-model="form.newpassword2" type="password" autocomplete="off" style="width: 200px;"/>
        </el-form-item>
      </el-form>
      <div style="margin-left: 150px;margin-top: 30px;">
        <el-button size="small" @click="back">取 消</el-button>
        <el-button size="small" type="primary" @click="updatePassword" v-loading="updatepasswordLoading">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { resetPassword } from '@/api/user'
export default {
  name: 'updatePassword',
  data() {
    const validatePassword = (rule, value, callback) => {
      const strongPasswordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,40}$/;
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
    }
  },
  methods: {
    back() {
      this.$router.push({ path: '/' })
    },
    updatePassword() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updatepasswordLoading = true;
          resetPassword({ new_pwd:this.form.newpassword, old_pwd: this.form.oldpassword })
            .then(({ data }) => {
              this.$message.success("修改成功");
              this.updatepasswordLoading = false;
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.updatepasswordLoading = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
