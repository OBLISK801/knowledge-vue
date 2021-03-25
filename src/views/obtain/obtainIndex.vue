<template>
  <div>
    <el-card>
      <h2>{{ tinymceData.title }}</h2>
      <el-container>
        <el-footer style="height: 90px; background-color: #eaedf1; color: #1a1a1a">
          <div style="margin: 10px 20px;">
            <span style="margin: 8px;">{{ tinymceData.writeUser }}</span>
            <span style="margin: 8px;">{{ tinymceData.createTime }}</span>
            <span style="margin: 8px;"><i class="el-icon-view"></i> 9999999</span>
            <span style="margin: 8px;"><i class="el-icon-star-on"></i> 9999999</span>
          </div>
          <div style="margin: 10px 20px;">
            <span style="margin-right: 15px;margin-left: 8px;">分类专栏：<el-tag style="margin-right: 10px;">软件工程</el-tag> <el-tag
              type="success">GIT</el-tag></span>
            <span>文章标签：<el-tag type="warning" style="margin-right: 10px;">GIT</el-tag> <el-tag
              type="danger">代码托管</el-tag></span>
          </div>
        </el-footer>
        <el-main style="background-color: white">
<!--          <div v-html="content"></div>-->
          <mavon-editor
            :value="content"
            defaultOpen="preview"
            :editable="false"
            :subfield="false"
            :toolbarsFlag="false"
          >
          </mavon-editor>
        </el-main>

        <el-footer
          style="height: 60px; background-color: #eaedf1;display: flex;justify-content: space-between;align-items: center;">
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
          <el-rate v-model="value1" show-text style="float: right"></el-rate>
        </el-footer>

      </el-container>
    </el-card>
    <el-card style="margin-top: 10px; height: 500px;">
      <el-container>
        <el-footer>
          <el-form inline>
            <el-row style="display: flex;align-items: center;">
              <el-avatar :size="40" :src="this.userInfo.avatar"
                         style="cursor: pointer; margin-right: 10px;"></el-avatar>
              <el-input style="margin-right: 10px;" placeholder="优质评论可以帮助作者获得更高权重" type="textarea" autosize
                        v-model="commentData.commentContent"></el-input>
              <el-button type="info" @click="commentTinymce">评论</el-button>
            </el-row>
            <el-row v-for="item in commentList" style="margin-right: 15px; margin-bottom: 15px; margin-top: 15px; display: flex;align-items: center;">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                         style="cursor: pointer; margin-right: 5px;"></el-avatar>
              <span>{{item.commentUser}}：{{item.commentContent}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style="font-size: 10px; margin-right: 15px;">{{item.commentTime}}</span>
                  <el-button type="text" style="font-size: 15px;" @click="replyComment">回复</el-button></span>
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
      value1: 0,
      commentData: {
        tinymceId: '',
        commentUser: '',
        commentContent: ''
      },
      pageNo: 1,
      pageSize: 7,
      commentList: []

    }
  },
  created () {
    this.tinymceId = this.$route.query.id
    this.userInfo = this.$store.state.userInfo
    this.getContents()
    this.getComment()
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
    commentTinymce() {
      this.commentData.tinymceId = this.$route.query.id
      this.commentData.commentUser = this.userInfo.username
      this.$http.post('/obtain/comment/comment',this.commentData).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '感谢您的评论'
          })
          this.commentData.commentContent = ''
        }
      }).catch()
    },
    getComment() {
      this.$http.get('/obtain/comment/getComment', {
        params:{
          tinymceId : this.$route.query.id
        }
      }).then(res => {
        if (res.data.code === 20000) {
          this.commentList = res.data.data.results
        }
      }).catch()
    },
    replyComment() {

    },





  },

}
</script>

<style scoped>

</style>
