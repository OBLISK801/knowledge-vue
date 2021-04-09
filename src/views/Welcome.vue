<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="15">
      <el-col :span="13">
        <el-card>
          <div slot="header">
            <span>用户信息</span>
            <el-button style="float: right;" size="mini" plain loading type="primary">用户中心</el-button>
          </div>
          <el-tooltip effect="dark" content="换头像功能还未实现" placement="top-start">
            <el-avatar shape="square" :size="80" :src="userInfo.avatar" style="float:left;" :key="1"></el-avatar>
          </el-tooltip>
          <div style="float:right; width:520px;">
            <el-table :data="tableInfo" border style="margin-bottom: 10px;">
              <el-table-column prop="username" label="用户账号"></el-table-column>
              <el-table-column prop="nickname" label="用户昵称"></el-table-column>
              <el-table-column fixed="right" prop="roles" label="用户角色" width="150"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card style="margin-top:20px; padding:0;">
          <h2>个性推荐</h2>
        <el-table :data="article"
                  style="width: 100%;height: auto;"
                  border>
          <el-table-column prop="id" label="文章ID" width="70" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
          <el-table-column prop="username" label="作者" width="120" align="center"></el-table-column>
          <el-table-column label="文章名">
            <template slot-scope="{row}">
              <router-link :to="{path:'/obtain/obtainIndex',query: {id: row.id}}" class="link-type">
                <span>{{ row.title }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="文章标签">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.tagName" style="margin-right: 3px;" type="success">{{item}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
  </div>

</template>

<script>
// import echarts from 'echarts'
export default {
  name: 'Welcome',
  data () {
    return {
      userInfo: {},
      tableInfo: [],
      article:[],

    }
  },
  methods: {
    getRecommenderArticle() {
      this.$http.get('/obtain/score/getRecommenderArticle',{params:{username: this.$store.state.userInfo.username}}).then(res => {
        if (res.data.code === 20000) {
          this.article = res.data.data
          console.log(res.data.data)
        }
      }).catch()
    },



  },
  created () {
    this.userInfo = this.$store.state.userInfo
    const roles = this.userInfo.isAdmin ? "超级管理员" : this.userInfo.roles;
    this.tableInfo.push({
      username: this.userInfo.username,
      nickname: this.userInfo.nickname,
      roles: roles
    })
    this.getRecommenderArticle()

  },
  mounted () {

  }
}
</script>

<style>
.el-table th.gutter{
  display: table-cell!important;
}
</style>
