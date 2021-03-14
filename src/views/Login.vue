<template>
  <div id="poster">
    <el-form label-position="left" label-width="0px" :rules="loginRules" :model="userLoginForm" class="login-container"
             ref="userLoginFormRef">
      <h2 class="login_title">个人知识管理系统</h2>
      <el-form-item prop="username">
        <el-input type="text" v-model="userLoginForm.username"
                  auto-complete="off" placeholder="用户名"
                  prefix-icon="el-icon-user-solid"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="userLoginForm.password"
                  auto-complete="off" placeholder="密码"
                  prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <div></div>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;border: none" @click="submit"
                   :loading="loading">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" style="float: right" @click="register">还没有账号? 点击注册</el-button>
      </el-form-item>
    </el-form>
    <!-- 验证码 -->
    <VerificationCode :show="isShow" @success="login" @close="close" :canvasWidth="500" :canvasHeight="350"/>
  </div>
</template>

<script>
import VerificationCode from 'vue-puzzle-vcode'

export default {
  name: 'Login',
  components: {
    VerificationCode
  },
  data () {
    return {
      isShow: false,
      userLoginForm: {
        username: 'xiaolei',
        password: '123456'
      },
      // 验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 是否显示登录加载
      loading: false
    }
  },
  methods: {
    // 登录提交
    submit () {
      this.isShow = true
    },
    close() {
      this.isShow = false;
    },
    // 登录
    login () {
      this.loading = true
      this.$http.post('system/user/login', this.userLoginForm).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '欢迎进入系统'
          })
          LocalStorage.set(LOCAL_KEY_KNOWLEDGE_ACCESS_TOKEN, res.data.data)
          this.getUserInfo()
        }
      }).catch(() => {
        this.$message.error({
          type: 'error',
          message: '登录失败'
        })
      })
      this.loading = false
    },
    // 根据登录接口返回的token获取当前用户详情
    getUserInfo () {
      this.$http.get('system/user/info').then(res => {
        if (res.data.code === 20000) {
          this.userInfo = res.data.data
          this.$store.commit('setUserInfo', res.data.data)
          this.$router.push('/home')
        }
      }).catch(() => {
        this.$message.error({
          type: 'error',
          message: '获取用户详情数据失败'
        })
      })
    },
    // 注册
    register () {
      this.$router.push('/register')
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

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 400px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
