<template>
  <div>
    <el-card>
      <h2>图表统计</h2>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="标签词云" name="first">
          <div style="width: 1250px; height: 520px;">
            <wordCloud
              :data="defaultWords"
              nameKey="name"
              valueKey="value"
              :color="myColors"
              :showTooltip="false"
              :wordClick="wordClickHandler">
            </wordCloud>
          </div>
        </el-tab-pane>
        <el-tab-pane label="文章点击" name="second">
          <div>
            <span style="margin-left: 5px; font-size: 18px; font-weight: bold;">请选择查看时间：</span>
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-button type="primary" size="medium" style="margin-left: 15px;" @click="getTopClickByTime">生成</el-button>
          </div>
          <div id="click" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
        <el-tab-pane label="文章点赞" name="third">
          <div id="like" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
        <el-tab-pane label="文章评论" name="fourth">
          <div id="comment" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
        <el-tab-pane label="文章收藏" name="fifth">
          <div id="favorite" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
        <el-tab-pane label="文章发布" name="sixth">
          <div id="public" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
        <el-tab-pane label="资源上传" name="seventh">
          <div id="upload" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
        <el-tab-pane label="文章评分" name="eighth">
          <div id="rate" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
        <el-tab-pane label="资源下载" name="ninth">
          <div id="download" style="width: 1250px; height:520px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import wordCloud from 'vue-wordcloud'

export default {
  name: 'EchartsStatistics',
  components: {
    wordCloud
  },
  data () {
    return {
      activeName: 'first',
      firstX: [],
      firstY: [],
      secondX: [],
      secondY: [],
      thirdX: [],
      thirdY: [],
      myColors: ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef'],
      defaultWords: [],
      pieData: [{
        value: '',
        name: ''
      }],
      lineData: [],
      fourthX: [],
      fourthY: [],
      fifthX: [],
      fifthY: [],
      sixthX: [],
      sixthY: [],
      dateValue:[],
      query: {
        beginDate: '',
        endDate: ''
      }

    }
  },
  created () {
    this.getTopAvg()
    this.getTopLike()
    this.getTopFavourite()
    this.listWordCloudData()
    this.getTopComment()
    this.getTopClick()
    this.getCountPublic()
    this.getTopUpload()
    this.getTopDownload()
    this.getTopClickByTime()
  },
  mounted () {

  },
  methods: {
    getTopClickByTime() {
      if (this.dateValue !== '' && this.dateValue !== null) {
        this.query.beginDate = this.dateValue[0]
        this.query.endDate = this.dateValue[1]
      }
      this.$http.get('/obtain/statistics/getTopClickByTime',{params: this.query}).then(res => {
        if (res.data.code === 20000) {
          this.lineData = []
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            let a = []
            a[0] = array[i].time
            a[1] = array[i].sum
            this.lineData.push(a)
            this.myEcharts5()
          }
        }
      }).catch()
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    wordClickHandler (name, value, vm) {
      console.log('wordClickHandler', name, value, vm)
    },
    listWordCloudData () {
      this.$http.get('/admin/tag/listWordCloudData').then(res => {
        this.defaultWords = res.data.data
      }).catch()
    },
    // 评分图
    myEcharts1 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('rate'))
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '平均评分top10'
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: this.firstX,
          triggerEvent: true,//一定要设置为true
          axisLabel: {
            formatter: function (value) {
              let res = value
              if (res.length > 5) {//根据自身需求设置显示字数
                res = res.substring(0, 5) + '..'
              }
              return res
            },
          },
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: this.firstY,
          itemStyle: {
            normal: {
              color: function (params) {
                const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',]
                const index = params.dataIndex % colorList.length
                return colorList[index]
              }
            }
          },
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    getTopAvg () {
      this.$http.get('/obtain/statistics/getTopAvg').then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            this.firstX.push(array[i].title)
            this.firstY.push(array[i].avg)
          }
          this.myEcharts1()
        }
      }).catch()
    },
    // 点赞图
    myEcharts2 () {
      const myChart = this.$echarts.init(document.getElementById('like'))
      const option = {
        title: {
          text: '文章点赞top10'
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: this.secondX,
          triggerEvent: true,
          axisLabel: {
            formatter: function (value) {
              let res = value
              if (res.length > 5) {
                res = res.substring(0, 5) + '..'
              }
              return res
            },
          },
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: this.secondY,
          itemStyle: {
            normal: {
              color: function (params) {
                const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',]
                const index = params.dataIndex % colorList.length
                return colorList[index]
              }
            }
          },
        }]
      }
      myChart.setOption(option)
    },
    getTopLike () {
      this.$http.get('/obtain/statistics/getTopLike').then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            this.secondX.push(array[i].title)
            this.secondY.push(array[i].countLike)
          }
          this.myEcharts2()
        }
      }).catch()
    },
    // 收藏图
    myEcharts3 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('favorite'))
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '文章收藏top10'
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: this.thirdX,
          triggerEvent: true,//一定要设置为true
          axisLabel: {
            formatter: function (value) {
              let res = value
              if (res.length > 5) {//根据自身需求设置显示字数
                res = res.substring(0, 5) + '..'
              }
              return res
            },
          },
        },
        yAxis: {},
        series: [{
          type: 'bar',
          data: this.thirdY,
          itemStyle: {
            normal: {
              color: function (params) {
                const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',]
                const index = params.dataIndex % colorList.length
                return colorList[index]
              }
            }
          },
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    getTopFavourite () {
      this.$http.get('/obtain/statistics/getTopFavourite').then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            this.thirdX.push(array[i].title)
            this.thirdY.push(array[i].countFavorite)
          }
          this.myEcharts3()
        }
      }).catch()
    },
    // 评论图
    myEcharts4 () {
      const myChart = this.$echarts.init(document.getElementById('comment'))
      const option = {
        title: {
          text: '文章评论top7',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getTopComment () {
      this.$http.get('/obtain/statistics/getTopComment').then(res => {
        if (res.data.code === 20000) {
          this.pieData = res.data.data
          console.log(this.pieData)
          this.myEcharts4()
        }
      }).catch()
    },
    // 点击率图
    myEcharts5 () {
      const myChart = this.$echarts.init(document.getElementById('click'))
      const option = {
        title: {
          text: '文章点击量'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '30%']
        },
        visualMap: {
          type: 'piecewise',
          show: false,
          dimension: 0,
          seriesIndex: 0,
          pieces: [{
            gt: 1,
            lt: 3,
            color: 'rgba(0, 0, 180, 0.4)'
          }, {
            gt: 5,
            lt: 7,
            color: 'rgba(0, 0, 180, 0.4)'
          }]
        },
        series: [
          {
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            lineStyle: {
              color: '#5470C6',
              width: 5
            },
            markLine: {
              symbol: ['none', 'none'],
              label: { show: false },
              data: [
                { xAxis: 1 },
                { xAxis: 3 },
                { xAxis: 5 },
                { xAxis: 7 }
              ]
            },
            areaStyle: {},
            data: this.lineData
          }
        ]
      }
      myChart.setOption(option)
    },
    getTopClick () {
      this.$http.get('/obtain/statistics/getTopClick').then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            let a = []
            a[0] = array[i].time
            a[1] = array[i].sum
            this.lineData.push(a)
          }
          console.log(this.lineData)
          this.myEcharts5()
        }
      }).catch()
    },
    // 文章发布图
    myEcharts6 () {
      const myChart = this.$echarts.init(document.getElementById('public'))
      const option = {
        title: {
          text: '文章发布top10',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: this.fourthY
        },
        series: [
          {
            type: 'bar',
            data: this.fourthX
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    getCountPublic () {
      this.$http.get('/obtain/statistics/getCountPublic').then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            this.fourthX.push(array[i].countPublic)
            this.fourthY.push(array[i].writeUser)
          }
          this.myEcharts6()
        }
      }).catch()
    },
    // 文件上传图
    myEcharts7 () {
      const myChart = this.$echarts.init(document.getElementById('upload'))
      const option = {
        title: {
          text: '每日资源上传量',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.fifthX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.fifthY,
          type: 'line'
        }]
      }
      myChart.setOption(option)
    },
    getTopUpload () {
      this.$http.get('/obtain/statistics/getTopUpload').then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            this.fifthX.push(array[i].time)
            this.fifthY.push(array[i].sum)
          }
          this.myEcharts7()
        }
      }).catch()
    },
    // 文件下载图
    myEcharts8 () {
      const myChart = this.$echarts.init(document.getElementById('download'))
      const option = {
        title: {
          text: '每日资源下载量',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.sixthX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.sixthY,
          type: 'line',
          smooth: true
        }]
      }
      myChart.setOption(option)
    },
    getTopDownload () {
      this.$http.get('/obtain/statistics/getTopDownload').then(res => {
        if (res.data.code === 20000) {
          let array = res.data.data
          for (let i = 0; i < array.length; i++) {
            this.sixthX.push(array[i].time)
            this.sixthY.push(array[i].sum)
          }
          this.myEcharts8()
        }
      }).catch()
    },

  },

}
</script>

<style scoped>

</style>
