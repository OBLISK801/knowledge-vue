<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>知识分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="15">
      <el-col :span="14">
        <el-card>
          <div style=" height: 580px; width: 100%;">
            <div id="main-chart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-row>
          <el-card>
            <el-form :model="nodeData" label-width="80">
              <el-form-item label="分类名称:">
                <el-input v-model="nodeData.classificationName"></el-input>
              </el-form-item>
              <el-form-item label="分类介绍:">
                <el-input type="textarea" autosize v-model="nodeData.classificationIntroduction"></el-input>
              </el-form-item>
              <el-form-item label="资源数:">
                <el-input v-model="nodeData.num"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-row>
        <el-row>
          <el-card style="margin-top: 20px;">
            <h2>该分类热门文章</h2>
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
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ClassificationUser',
  data () {
    return {
      // 关系图数据
      graphData:[],
      graphLinks:[],
      nodeData:{
        classificationName:'',
        classificationIntroduction: '',
        num: 0
      },
      queryData: {
        name: '',
        level: ''
      },
      recentlyReadData: [],

    }
  },
  created () {

  },
  methods: {
    getGraphData() {
      this.$http.get('admin/classification/getGraphData').then(res => {
        if (res.data.code === 20000) {
          this.graphData = res.data.data.data
          this.getGraphLinks()
        }
      }).catch()
    },
    getGraphLinks() {
      this.$http.get('admin/classification/getGraphLinks').then(res => {
        if (res.data.code === 20000) {
          this.graphLinks = res.data.data.links
          this.initChart()
        }
      }).catch()
    },
    // echarts图表
    initChart() {
      let myChart = this.$echarts.init(document.getElementById("main-chart"));
      myChart.resize();
      myChart.setOption(this.setOption());
      myChart.on('click',this.nodeClick)
    },
    setOption() {
      return {
        title: {
          text: "知识分类关系图",
        },
        tooltip: {}, //提示框
        // 工具箱
        toolbox: {
          // 显示工具箱
          show: true,
          feature: {
            mark: {
              show: true
            },
            // 还原
            restore: {
              show: true
            },
            // 保存为图片
            saveAsImage: {
              show: true
            }
          }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "force",
            // symbolSize: 50, //倘若该属性不在link里，则其表示节点的大小；否则即为线两端标记的大小
            symbolSize: (value, params) => {
              switch (params.data.level) {
                case 1:
                  return 100;
                case 2:
                  return 50;
                case 3:
                  return 30;
              }
            },
            roam: true, //鼠标缩放功能
            label: {
              show: true, //是否显示标签
            },
            focusNodeAdjacency: true, //鼠标移到节点上时突出显示结点以及邻节点和边
            edgeSymbol: ["none", "arrow"], //关系两边的展现形式，也即图中线两端的展现形式。arrow为箭头
            edgeSymbolSize: [4, 10],
            draggable: true,
            edgeLabel: {
              fontSize: 20, //关系（也即线）上的标签字体大小
            },
            force: {
              repulsion: 200,
              edgeLength: 120,
            },
            data: this.graphData,
            links: this.graphLinks,
            lineStyle: {
              opacity: 5,
              width: 2,

            },
          },
        ],
      };
    },
    nodeClick(param) {
      console.log(param.data.name)
      console.log(param.data.level)
      this.queryData.name = param.data.name
      this.queryData.level = param.data.level
      this.$http.get('/admin/classification/listByNameLevel',{params:this.queryData}).then(res => {
        if (res.data.code === 20000) {
          this.nodeData = res.data.data
        }
      }).catch()
      this.$http.get('/admin/tinymce/getTopRead', { params: this.queryData }).then(res => {
        if (res.data.code === 20000) {
          this.recentlyReadData = res.data.data
        }
      }).catch()
    },

  },
  mounted() {
    this.getGraphData()
  },
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

</style>
