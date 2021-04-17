<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>知识分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card>
          <el-row>
            <el-col :span="16">
              <div>
                <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable></el-input>
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                <el-button type="primary" icon="el-icon-plus" style="margin-left:20px;" @click="openParentAdd" disabled>父级</el-button>
              </div>
            </el-col>
          </el-row>
          <el-tree
            style="margin-top: 10px;"
            node-key="id"
            :data="data"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :default-expanded-keys="[1]"
            ref="tree"
            :render-content="renderContent">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div style=" height: 580px; width: 100%;">
            <div id="main-chart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--新增框-->
    <el-dialog :title="addTitle" :visible.sync="addDialogVisible" @close="addClose" width="50%">
      <span>
         <el-form size="mini" ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
          <el-form-item label="分类名称" prop="classificationName">
            <el-input v-model="addForm.classificationName"></el-input>
          </el-form-item>
          <el-form-item label="分类简介" prop="classificationIntroduction">
            <el-input type="textarea" v-model="addForm.classificationIntroduction"></el-input>
          </el-form-item>
         </el-form>
      </span>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNode" :loading="btnLoading" :disabled="btnDisabled">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑框-->
    <el-dialog :title="editTitle" :visible.sync="editDialogVisible" width="50%" @close="editClose">
      <span>
         <el-form size="mini" ref="editFormRef" :model="editForm" label-width="80px" :rules="addFormRules">
          <el-form-item label="分类名称" prop="classificationName">
            <el-input v-model="editForm.classificationName"></el-input>
          </el-form-item>
          <el-form-item label="分类简介" prop="classificationIntroduction">
            <el-input type="textarea" v-model="editForm.classificationIntroduction" autosize></el-input>
          </el-form-item>
         </el-form>
      </span>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMenu" :loading="btnLoading" :disabled="btnDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Classification',
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    const data = []
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'classificationName'
      },
      data: JSON.parse(JSON.stringify(data)),
      addTitle: '',
      addDialogVisible: false,
      addForm: {
        parentId: '',
        classificationName: '',
        classificationIntroduction: ''
      },
      //添加表单验证规则
      addFormRules: {},
      btnLoading: false,
      btnDisabled: false,
      editTitle: '',
      editDialogVisible: false, //编辑分类弹出框
      editForm: {}, //编辑分类表单数据
      pNode: {}, //父节点
      // 关系图数据
      graphData:[],
      graphLinks:[],
    }
  },
  created () {
    this.getClassificationTree()
    setTimeout(() => {
      this.loading = false
    }, 500)
  },
  methods: {
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.classificationName.indexOf(value) !== -1
    },
    // 加载数据
    getClassificationTree () {
      this.$http.get('/admin/classification/tree').then(res => {
        // console.log(res.data)
        if (res.data.code === 20000) {
          this.data = res.data.data.tree
          this.getGraphData()
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      })
    },
    // 添加最高父级节点
    openParentAdd () {
      this.addTitle = '添加第一分类'
      this.addDialogVisible = true
      this.addForm.parentId = 0
    },
    // 添加节点
    addNode() {
      this.$refs.addFormRef.validate(vaild => {
        if (vaild) {
          this.btnLoading = true
          this.btnDisabled = true
          this.$http.post('/admin/classification/add',this.addForm).then(res => {
            if (res.data.code === 20000) {
              this.$message.success('分类添加成功')
              this.addDialogVisible = false
              this.getClassificationTree()
            }
          }).catch(() => {
            this.$message.error('分类添加失败')
          })
          this.btnLoading = false
          this.btnDisabled = false
        }
      })
    },
    //关闭添加
    addClose () {
      this.$refs.addFormRef.clearValidate()
      this.addForm = {}
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
           <span>
             {node.label}
           </span>
                <span style='float:right;'>
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => {
                    this.edit(data)
                    return false
                  }}
                >
            <i class="el-icon-edit"></i>&nbsp;编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="text"
                      on-click={() => {
                        this.openAdd(data)
                      }}
                    >
            <i class="el-icon-plus"></i>&nbsp;增加
                    </el-button>

                    <el-button
                      size="mini"
                      type="text"
                      on-click={() => this.delNode(node, data)}
                    >
            <i class="el-icon-delete"></i>&nbsp;删除
                    </el-button>
                  </span>
        </span>
      )
    },
    //点击编辑节点
    edit (data) {
      this.editTitle = '编辑：【' + data.classificationName + '】'
      this.$http.get('admin/classification/edit/' + data.id).then(res => {
        if (res.data.code === 20000) {
          this.editForm = res.data.data
          this.editDialogVisible = true
        }
      }).catch(() => {
        this.$message.error('分类编辑失败')
      })
    },
    //打开添加框
    openAdd (data) {
      this.addTitle = '添加节点 ：当前【' + data.classificationName + '】'
      this.addDialogVisible = true
      this.addForm.parentId = data.id
      this.pNode = data
    },
    //点击删除节点
    delNode (node, data) {
      console.log(node.data.parentId === 0)
      if (node.data.parentId === 0) {
        this.$message({
          type: 'warning',
          message: '该节点不可删除'
        })
        return
      }
      this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('admin/classification/delete/' + node.data.id).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('分类删除成功')
            this.getClassificationTree()
          }
        }).catch(() => {
          this.$message.error('分类删除失败' )
        })
      })
    },
    updateMenu() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.btnDisabled = true
          this.$http.put('admin/classification/update/' + this.editForm.id, this.editForm).then(res => {
            if (res.data.code === 20000) {
              this.$message({
                message: '分类信息更新成功',
                type: 'success'
              })
              this.editForm = {}
              this.editDialogVisible = false
              this.getClassificationTree()
            }
          }).catch(() => {
            this.$message.error('更新分类失败')
          })
          this.btnLoading = false
          this.btnDisabled = false
        }
      })
    },
    editClose () {
      this.$refs.editFormRef.clearValidate()
      this.editForm = {}
    },
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
    },
    setOption() {
      return {
        title: {
          text: "知识分类关系图",
        },
        tooltip: {}, //提示框
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
