<template>
  <div>
    <el-card>
      <h2>{{ tinymceData.title }}</h2>
      <el-container>
        <el-footer style="height: 90px; background-color: #eaedf1; color: #1a1a1a">
          <div style="margin: 10px 20px;">
            <span style="margin: 8px;">{{tinymceData.writeUser}}</span>
            <span style="margin: 8px;">{{tinymceData.createTime}}</span>
            <span style="margin: 8px;"><i class="el-icon-view"></i> 9999999</span>
            <span style="margin: 8px;"><i class="el-icon-star-on"></i> 9999999</span>
          </div>
          <div style="margin: 10px 20px;">
            <span style="margin-right: 15px;margin-left: 8px;">分类专栏：<el-tag style="margin-right: 10px;">软件工程</el-tag> <el-tag type="success">GIT</el-tag></span>
            <span>文章标签：<el-tag type="warning" style="margin-right: 10px;">GIT</el-tag> <el-tag type="danger">代码托管</el-tag></span>
          </div>
        </el-footer>
        <el-main style="background-color: white">
          <div v-html="content"></div>
        </el-main>

        <el-footer style="height: 60px; background-color: #eaedf1;display: flex;justify-content: space-between;align-items: center;">
          <div>
            <el-form inline>
              <el-button type="text" style="font-size: 18px; margin-right: 8px;"><i class="el-icon-thumb"></i> 点赞
              </el-button>
              <el-button type="text" style="font-size: 18px; margin-right: 8px;"><i class="el-icon-document"></i> 评论
              </el-button>
              <el-button type="text" style="font-size: 18px; margin-right: 8px;"><i class="el-icon-star-off"></i> 收藏
              </el-button>
              <el-button type="danger" round style="font-size: 18px;" size="small">一键三联</el-button>
            </el-form>
          </div>
        </el-footer>

      </el-container>
    </el-card>
    <el-card style="margin-top: 10px;">
      <el-container>
        <el-footer>
          <el-form inline>
            <el-row style="display: flex;align-items: center;">
              <el-avatar :size="40" :src="this.userInfo.avatar" style="cursor: pointer; margin-right: 10px;"></el-avatar>
              <el-input style="margin-right: 10px;" placeholder="优质评论可以帮助作者获得更高权重" type="textarea" autosize
                        v-model="comment"></el-input>
              <el-button type="info">评论</el-button>
            </el-row>

          </el-form>

        </el-footer>
      </el-container>
    </el-card>

  </div>
</template>

<script>
// this.$route.query.id
export default {
  name: 'obtainIndex',
  data () {
    return {
      content: '',
      tinymceData: {
        classificationId: '',
        title: '',
        summary: '',
        createTime: '',
        writeUser: '',
      },
      userInfo: {},
      comment:'',

    }
  },
  created () {
    this.tinymceId = this.$route.query.id
    this.userInfo = this.$store.state.userInfo
    this.getContents()
  },
  methods: {
    getContents () {
      this.$http.get('/admin/tinymce/listById', {
        params: {
          tinymceId: this.tinymceId,
          userName: this.$store.state.userInfo.username
        }
      }).then(res => {
        if (res.data.code === 20000) {
          if (res.data.data !== null) {
            this.content = res.data.data.content
            this.tinymceData.classificationId = res.data.data.classificationId
            this.tinymceData.title = res.data.data.title
            this.tinymceData.summary = res.data.data.summary
            this.tinymceData.createTime = res.data.data.createTime
            this.tinymceData.writeUser = res.data.data.writeUser
          }
        }
      }).catch()
    },
  },

}
</script>

<style scoped>

</style>
