<template>
  <div>
    <el-card style="float: left; width: 250px; margin-right: 15px;">
      <div>
          <span style="font-size: 20px; font-weight: bold; color: red;"><i
            class="el-icon-s-flag"></i> 知识分类</span>
      </div>
      <el-divider style="margin: 5px;"></el-divider>
      <el-tree
        style="margin-top: 10px;"
        node-key="id"
        :data="data"
        :props="defaultProps"
        default-expand-all
        ref="tree">
      </el-tree>
    </el-card>
    <el-card>
      <div>
          <span style="font-size: 20px; font-weight: bold; color: red;"><i
            class="el-icon-medal"></i> 热门知识</span>
      </div>
      <el-divider style="margin: 5px; width: 300px;"></el-divider>
      <div>
        <el-card v-for="item in num" style="margin-bottom: 5px;">
          aaafaf
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'fileIndex',
  data() {
    const data = []
    return {
      fileInfoId: '',
      data: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: 'children',
        label: 'classificationName'
      },
      num:[1,2,3,4,5,6,7,8,9]


    }
  },
  created () {
    this.fileInfoId = this.$route.query.id
    this.getClassificationTree()
  },
  methods: {
    // 加载数据
    getClassificationTree () {
      this.$http.get('/admin/classification/tree').then(res => {
        if (res.data.code === 20000) {
          this.data = res.data.data.tree
          this.title=this.data[0].children
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      })
    },



  }

}
</script>

<style>
.el-divider--horizontal {
  margin: 5px;
}
</style>
