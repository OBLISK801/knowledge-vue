<template>
  <div id="poster">
    <el-form label-position="right" label-width="80px" class="register-container" ref="userRegisterFormRef"
             :rules="registerRules" :model="userRegisterForm">
      <h2 class="register_title">欢迎注册</h2>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="userRegisterForm.username"
                      auto-complete="off" placeholder="用户名"
                      prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input type="text" v-model="userRegisterForm.nickname"
                      auto-complete="off" placeholder="昵称"
                      prefix-icon="el-icon-s-custom"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input type="text" v-model="userRegisterForm.phoneNumber"
                      auto-complete="off" placeholder="手机号"
                      prefix-icon="el-icon-mobile-phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="userRegisterForm.email"
                      auto-complete="off" placeholder="邮箱"
                      prefix-icon="el-icon-message"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="userRegisterForm.password"
                      auto-complete="off" placeholder="密码"
                      prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <template>
              <el-radio v-model="userRegisterForm.sex" label="0">男</el-radio>
              <el-radio v-model="userRegisterForm.sex" label="1">女</el-radio>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生日" prop="birth">
            <el-date-picker v-model="userRegisterForm.birth" type="date" placeholder="选择日期"
                            prefix-icon="el-icon-tableware">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" style="width: 100%;border: none" @click="register">注册</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }

    const checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }

    return {
      userRegisterForm: {
        username: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        sex: '2',
        birth: '',
        password: ''
      },
      registerRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur'
          }
        ],
        sex: [{
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }],
        birth: [{
          required: true,
          message: '请填写出生日期',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          validator: checkEmail,
          trigger: 'blur'
        }],
        phoneNumber: [
          {
            required: true,
            message: '请输入联系方式',
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    register () {
      this.$refs.userRegisterFormRef.validate(valid => {
        if (!valid) {
          return
        } else {
          this.$http.post('system/user/register', this.userRegisterForm).then(res => {
            if (res.data.code === 20000) {
              this.$message.success('用户注册成功，请登录')
              this.$router.push('/login')
            }
          }).catch(res => {
            return this.$message.error('用户添加失败')
          })
        }
      })
    },

  }
}
</script>

<style scoped>
#poster {
  background: url("../assets/1.jpg") no-repeat center;
  /*background-color: #505458;*/
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0px;
}

.register-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 840px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.register_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
