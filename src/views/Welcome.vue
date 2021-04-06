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
        <!-- 用户登入报表 -->
        <div id="loginReport" style="width: 650px;height:270px;"></div>
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
      tableInfo: []
    }
  },
  methods: {
    myEcharts(){
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById("loginReport"))
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  },
  created () {
    this.userInfo = this.$store.state.userInfo
    const roles = this.userInfo.isAdmin ? "超级管理员" : this.userInfo.roles;
    this.tableInfo.push({
      username: this.userInfo.username,
      nickname: this.userInfo.nickname,
      roles: roles
    })
  },
  mounted () {
    this.myEcharts()
  }
}
</script>

<style scoped>

</style>
