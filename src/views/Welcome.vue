<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container>
      <el-aside style="width: 800px; background-color: #EBEEF5">
        <el-container>
          <el-footer style="background-color: #EBEEF5; height: 215px;">
            <el-card style="height: 220px;">
              <el-row :gutter="4">
                <el-col :span="8">
                  <div style="text-align: center;">
                    <el-image :src="src1" style="width: 100px; height: 100px;"></el-image><br>
                    <span class="demonstration" style="font-size: 20px; font-weight: bold;">我的文章</span><br>
                    <span style="font-size: 20px; font-weight: bold; color: #2d8cf0;">{{sum1}}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;">
                    <el-image :src="src2" style="width: 100px; height: 100px;"></el-image><br>
                    <span class="demonstration" style="font-size: 20px; font-weight: bold;">我的文档</span><br>
                    <span style="font-size: 20px; font-weight: bold; color: #2d8cf0;">{{sum2}}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center;">
                    <el-image :src="src3" style="width: 100px; height: 100px;"></el-image><br>
                    <span class="demonstration" style="font-size: 20px; font-weight: bold;">我的收藏</span><br>
                    <span style="font-size: 20px; font-weight: bold; color: #2d8cf0;">{{sum3}}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-footer>
          <el-main>
            <el-card>
              <div id="weekClick" style="width: 750px; height:420px;"></div>
            </el-card>
          </el-main>
        </el-container>
      </el-aside>
      <el-main id="main">
        <el-card>
          <h2>个性推荐</h2>
          <el-table :data="article" style="width: 100%;height: auto;" border>
            <el-table-column prop="username" label="作者" width="100" align="center"></el-table-column>
            <el-table-column label="文章名">
              <template slot-scope="{row}">
                <router-link :to="{path:'/obtain/obtainIndex',query: {id: row.id}}" class="link-type">
                  <span>{{ row.title }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="文章标签">
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.tagName" style="margin-right: 3px;" type="success">{{ item }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="margin-top: 20px;">
          <h2>最近阅读</h2>
          <el-table :data="recentlyReadData" style="width: 100%;height: auto;" border>
            <el-table-column prop="writeUser" label="作者" width="100" align="center"></el-table-column>
            <el-table-column label="文章名">
              <template slot-scope="{row}">
                <router-link :to="{path:'/obtain/obtainIndex',query: {id: row.resourceId}}" class="link-type">
                  <span>{{ row.title }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="文章标签">
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.tagName" style="margin-right: 3px;" type="success">{{ item }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>

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
      article: [],
      statistics: {},
      lineX: [],
      lineY: [],
      src1: 'https://bysj01.oss-cn-beijing.aliyuncs.com/icon/forum%20discusstion.png',
      src2: 'https://bysj01.oss-cn-beijing.aliyuncs.com/icon/document.png',
      src3: 'https://bysj01.oss-cn-beijing.aliyuncs.com/icon/Briefcase.png',
      sum1: 0,
      sum2: 0,
      sum3: 0,
      recentlyReadData: []

    }
  },
  methods: {
    getRecommenderArticle () {
      this.$http.get('/obtain/score/getRecommenderArticle', { params: { username: this.$store.state.userInfo.username } }).then(res => {
        if (res.data.code === 20000) {
          this.article = res.data.data
        }
      }).catch()
    },
    getStatistics () {
      this.$http.get('/obtain/statistics/getStatistics', { params: { username: this.$store.state.userInfo.username } }).then(res => {
        if (res.data.code === 20000) {
          this.statistics = res.data.data
          this.sum1 = this.statistics[0].sum
          this.sum2 = this.statistics[1].sum
          this.sum3 = this.statistics[2].sum
        }
      }).catch()
    },
    myEcharts7 () {
      const myChart = this.$echarts.init(document.getElementById('weekClick'))
      const option = {
        title: {
          text: '最近一周点击量',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.lineX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.lineY,
          type: 'line',
          itemStyle : {
            normal : {
              color:'red',
              lineStyle:{
                color:'red'
              }
            }
          },
        }]
      }
      myChart.setOption(option)
    },
    getUserClick () {
      this.$http.get('/obtain/statistics/getUserClick', { params: { username: this.$store.state.userInfo.username } }).then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            this.lineX.push(array[i].time)
            this.lineY.push(array[i].sum)
          }
          this.myEcharts7()
        }
      }).catch()
    },
    getRecentlyRead () {
      this.$http.get('/admin/tinymce/getRecentlyRead', { params: { username: this.$store.state.userInfo.username } }).then(res => {
        if (res.data.code === 20000) {
          this.recentlyReadData = res.data.data
        }
      }).catch()
    },

  },
  created () {
    this.userInfo = this.$store.state.userInfo
    const roles = this.userInfo.isAdmin ? '超级管理员' : this.userInfo.roles
    this.tableInfo.push({
      username: this.userInfo.username,
      nickname: this.userInfo.nickname,
      roles: roles
    })
    this.getRecommenderArticle()
    this.getStatistics()
    this.getUserClick()
    this.getRecentlyRead()

  },
  mounted () {

  }
}
</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
#main.el-main {
  padding: 0;
}
</style>
<style scoped>
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>
