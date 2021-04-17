<template>
  <el-container class="home-container">
    <!--菜单-->
    <el-aside :width="isOpen===true?'64px':'200px'">
      <div class="toggle-btn" @click="toggleMenu">|||</div>
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="isOpen"
        :router="true"
        :default-active="activePath"
        background-color="#001529"
        :collapse-transition="false"
        text-color="rgba(255,255,255,0.7)"
        unique-opened
        style="outline: none;">
        <MenuTree :menuList="this.menuList"></MenuTree>
      </el-menu>
    </el-aside>
    <el-container>
      <!--头部导航栏-->
      <el-header>
        <div>
          <span style="margin-left:20px; font-weight: bold;">个人知识管理系统</span>
        </div>
        <div>
          <div style="margin-left: 650px;">
            <el-input placeholder="检索知识库" v-model="searchText" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </div>
        <div style="align-items: center; display: flex;justify-content: left">
          <el-dropdown trigger="click">
            <div>
              <el-avatar :size="50" :src="this.userInfo.avatar" style="cursor: pointer;" shape="square"></el-avatar>
              <span style="font-size: 18px;color: #fff;margin-left: 8px;">{{ userInfo.username }}<i
                class="el-icon-arrow-down el-icon--right"></i></span>
            </div>
            <el-dropdown-menu slot="dropdown" trigger="click">
              <el-dropdown-item>
                <span type="danger" @click="toWelcome"><span class="el-icon-house"></span> &nbsp;系统首页</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span type="danger" @click="drawer = true"><span class="el-icon-user"></span> &nbsp;个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span type="danger" @click="logout"><span class="el-icon-switch-button"></span> &nbsp;退出登入</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!--右边主体-->
      <el-main v-loading="loading" style="background-color: #EBEEF5">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!--用户中心-->
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      style="height: auto">
      <el-card style="padding: 5px;">
        <div slot="header">
          <span>用户信息</span>
          <el-button style="float: right;" size="mini" plain loading type="primary">用户中心</el-button>
        </div>
        <div>
          <el-avatar shape="square" :size="80" :src="userInfo.avatar" style="float:left; margin-right: 10px;"
                     :key="1"></el-avatar>
          <div>
            <span>用户名：{{ userInfo.username }}</span><br>
            <span>用户昵称：{{ userInfo.nickname }}</span><br>
            <span>手机号：{{ userInfo.phoneNumber }}</span><br>
            <span>用户角色：{{ userInfo.roles }}</span>
          </div>
        </div>
        <div>
          <el-upload
            ref="upload"
            action=""
            :show-file-list="false"
            :before-upload="beforeUpload">
            <el-button type="primary" size="small">更换头像</el-button>
          </el-upload>
        </div>
      </el-card>
    </el-drawer>
  </el-container>
</template>

<script>
import MenuTree from '../components/MenuTree'

export default {
  data () {
    return {
      loading: true,
      activePath: '', //激活的路径
      isOpen: false,
      menuList: {},
      userInfo: {},
      drawer: false,
      searchText: '',
      avatarData: {
        username: '',
        url: ''
      },

    }
  },
  components: {
    MenuTree
  },
  methods: {
    beforeUpload(file) {
      let fd = new FormData();
      fd.append('file',file);//传文件
      this.$http.post('/admin/oss/uploadPhoto',fd).then(res => {
        if (res.data.code === 20000) {
          let url = res.data.data
          this.dialogVisible = true
          this.changeAvatar(url)
        }
      }).catch()
    },
    changeAvatar(url) {
      this.avatarData.username = this.userInfo.username
      this.avatarData.url = url
      this.$http.put('/system/user/changeAvatar',this.avatarData).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '更换头像成功'
          })
          this.getUserInfo()
        }
      })
    },
    logout () {
      this.$confirm('此操作将退出系统,是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        LocalStorage.clearAll()
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出登入'
        })
      })
    },
    toWelcome () {
      this.$router.push('/system/welcome')
    },
    getMenuList () {
      this.$http.get('system/user/findMenu').then(res => {
        if (res.data.code === 20000) {
          this.menuList = res.data.data
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取数据失败或者token已经过期'
        })
      })
    },
    getUserInfo () {
      this.$http.get('system/user/info').then(res => {
        if (res.data.code === 20000) {
          this.userInfo = res.data.data
          this.$store.commit('setUserInfo', res.data.data)
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '用户信息获取失败'
        })
      })
    },
    // 菜单伸缩
    toggleMenu () {
      this.isOpen = !this.isOpen
    },
    search() {
      let path = this.$router.resolve({
        path: '/share/fullTextSearch',
        query: {searchText: this.searchText  }
      })
      window.open(path.href, '_blank');
    },
  },
  mounted () {
    this.getUserInfo()
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    setTimeout(() => {
      this.loading = false
    }, 500)
  }
}
</script>
<style>
.el-header {
  background-color: #001529;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 19px;

  padding-left: 0;
}

.el-aside {
  background-color: #001529
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  width: 100%;
  height: 100% !important;
}

.toggle-btn {
  background-color: #001529 !important;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
/*选中菜单出现边框*/
.el-menu-item.is-active {
  color: #409EFF;
  border-right: 4px solid #409EFF;
}
/*菜单栏突出*/
.el-menu {
  border-right: none;
}
</style>
