<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>知识标签</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="float: left; width: 250px; margin-right: 15px;"></el-card>
    <el-card>
      <wordcloud
        :data="defaultWords"
        nameKey="name"
        valueKey="value"
        :color="myColors"
        :showTooltip="false"
        :wordClick="wordClickHandler">
      </wordcloud>
    </el-card>
  </div>
</template>

<script>
import wordcloud from 'vue-wordcloud'

export default {
  name: 'Label',
  components: {
    wordcloud
  },
  methods: {
    wordClickHandler (name, value, vm) {
      console.log('wordClickHandler', name, value, vm)
    }
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
      ]
    }
  }

}
</script>

<style scoped>

</style>
