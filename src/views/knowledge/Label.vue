<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>知识标签</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 10px;">
      <el-form inline>
        <el-form-item label="标签名">
          <el-input placeholder="请输入标签名检索" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleAdd()" style="float: right;">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="tagName" label="标签名" width="180" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="280" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-card>
      <wordCloud
        :data="defaultWords"
        nameKey="name"
        valueKey="value"
        :color="myColors"
        :showTooltip="false"
        :wordClick="wordClickHandler">
      </wordCloud>
    </el-card>

    <el-dialog
      title="新增标签"
      :visible.sync="dialogAddVisible"
      width="30%">
      <el-form label-position="left" :model="tagData">
        <el-form-item label="标签名">
          <el-input v-model="tagData.tagName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑标签"
      :visible.sync="dialogEditVisible"
      width="30%">
      <el-form label-position="left" :model="tagData">
        <el-form-item label="标签名">
          <el-input v-model="tagData.tagName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit" >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import wordCloud from 'vue-wordcloud'

export default {
  name: 'Label',
  components: {
    wordCloud
  },
  data () {
    return {
      myColors: ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef'],
      defaultWords: [],
      tableData: [],
      queryData: {
        pageNum: 1,
        pageSize: 5,

      },
      total: 0,
      dialogAddVisible: false,
      tagData: {
        tagName: '',
        createType: 0,
        createUser: ''
      },
      dialogEditVisible: false,
      selectId: ''

    }
  },
  methods: {
    wordClickHandler (name, value, vm) {
      console.log('wordClickHandler', name, value, vm)
    },
    handleAdd () {
      this.dialogAddVisible = true
    },
    handleEdit (row) {
      this.selectId = row.id
      this.dialogEditVisible = true
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/admin/tag/delete/' + row.id).then(res => {
          if (res.data.code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTableData()
          }
        }).catch(() => {
          this.$message.error('删除失败' )
        })
      })

    },
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this.getTableData()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this.getTableData()
    },
    getTableData () {
      this.$http.get('/admin/tag/listAll', { params: this.queryData }).then(res => {
        if (res.data.code === 20000) {
          this.tableData = res.data.data.results
          this.total = res.data.data.total
        }
      }).catch()
    },
    save() {
      this.dialogAddVisible = false
      this.$http.post('/admin/tag/add',this.tagData).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.tagData= {
            tagName: '',
            createType: 0,
            createUser: ''
          }
          this.getTableData()
        }
      }).catch()
    },
    edit() {
      this.dialogEditVisible = false
      this.$http.put('/admin/tag/edit/' + this.selectId, this.tagData).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.tagData= {
            tagName: '',
            createType: 0,
            createUser: ''
          }
          this.getTableData()
        }
      }).catch()
    },
    listWordCloudData() {
      this.$http.get('/admin/tag/listWordCloudData').then(res => {
        this.defaultWords = res.data.data
      }).catch()
    },

  },
  created () {
    this.getTableData()
    this.listWordCloudData()
  },

}
</script>

<style scoped>

</style>
