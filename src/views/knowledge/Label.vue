<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>知识标签</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 10px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="tagName" label="标签名" width="180"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleAdd(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pageNum"
        :page-sizes="[6, 10, 20, 30]"
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
      defaultWords: [{
        'name': 'Java',
        'value': 26
      },
        {
          'name': 'Git',
          'value': 19
        },
        {
          'name': 'Maven',
          'value': 18
        },
        {
          'name': 'Spring',
          'value': 16
        },
        {
          'name': 'SpringBoot',
          'value': 15
        },
        {
          'name': 'SpringMVC',
          'value': 9
        },
        {
          'name': 'MyBatis',
          'value': 9
        },
        {
          'name': 'MyBatis-Plus',
          'value': 9
        },
        {
          'name': 'Thread',
          'value': 9
        }
      ],
      tableData: [],
      queryData: {
        pageNum: 1,
        pageSize: 10,

      },
      total: 0,


    }
  },
  methods: {
    wordClickHandler (name, value, vm) {
      console.log('wordClickHandler', name, value, vm)
    },
    handleAdd() {

    },
    handleEdit() {

    },
    handleDelete() {

    },
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this.getTinymceData()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this.getTinymceData()
    },


  },

}
</script>

<style scoped>

</style>
