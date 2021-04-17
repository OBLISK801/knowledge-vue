<template>
  <div>
    <el-card>
      <h2>{{ tinymceData.title }}</h2>
      <el-container>
        <el-footer style="height: 90px; background-color: #eaedf1; color: #1a1a1a">
          <div style="margin: 10px 20px;">
            <span style="margin: 8px;">{{ tinymceData.writeUser }}</span>
            <span style="margin: 8px;">{{ tinymceData.createTime }}</span>
            <span style="margin: 8px;"><i class="el-icon-view"></i> {{ this.tinymceData.clickCount }}</span>
            <span style="margin: 8px;"><i class="el-icon-star-off"></i> {{ favoriteNum }}</span>
          </div>
          <div style="margin: 10px 20px;">
            <span style="margin-right: 15px;margin-left: 8px;">分类专栏：<el-tag style="margin-right: 10px;">{{
                classificationMap.get(this.tinymceData.classificationId)
              }}</el-tag></span>
            <span>文章标签：<el-tag type="warning" style="margin-right: 10px;"
                               v-for="item in this.tinymceData.tagName">{{ item }}</el-tag> </span>
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
        clickCount: 0,
        tagName: []
      },
      userInfo: {},
      value1: 0,
      pageNo: 1,
      pageSize: 7,
      classificationData: [],
      classificationMap: new Map(),
      favoriteNum: 0,

    }
  },
  created () {
    this.tinymceId = this.$route.query.id
    this.userInfo = this.$store.state.userInfo
    this.getContents()
    this.listAllClassification()
    this.getNum()
  },

  methods: {
    getContents () {
      this.$http.get('/admin/tinymce/listDetails', {
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
            this.tinymceData.writeUser = res.data.data.username
            this.tinymceData.clickCount = res.data.data.clickCount
            this.tinymceData.tagName = res.data.data.tagName
          }
        }
      }).catch()
    },
    listAllClassification () {
      this.$http.get('/admin/classification/listAll').then(res => {
        if (res.data.code === 20000) {
          this.classificationData = res.data.data
          for (let i = 0; i < this.classificationData.length; i++) {
            this.classificationMap.set(this.classificationData[i].id, this.classificationData[i].classificationName)
          }
        }
      })
    },
    getNum() {
      this.$http.get('/obtain/favorites/getNum',{params:{tinymceId:this.$route.query.id}}).then(res => {
        if (res.data.code === 20000) {
          this.favoriteNum = res.data.data
        }
      })
    },


  },

}
</script>
<style>
#like.el-button--text {
  color: red;
}
#favorite.el-button--text {
  color: red;
}
</style>
<style lang="stylus" scoped>
.my-reply
  padding 10px
  background-color #fafbfc

  .header-img
    display inline-block
    vertical-align top

  .reply-info
    display inline-block
    margin-left 5px
    width 90%
    @media screen and (max-width: 1200px) {
      width 80%
    }

    .reply-input
      min-height 20px
      line-height 22px
      padding 10px 10px
      color #ccc
      background-color #fff
      border-radius 5px

      &:empty:before
        content attr(placeholder)

      &:focus:before
        content none

      &:focus
        padding 8px 8px
        border 2px solid blue
        box-shadow none
        outline none

  .reply-btn-box
    height 25px
    margin 10px 0

    .reply-btn
      position relative
      float right
      margin-right 15px

.my-comment-reply
  margin-left 50px

  .reply-input
    width flex

.author-title:not(:last-child)
  border-bottom: 1px solid rgba(178, 186, 194, .3)

.author-title
  padding 10px

  .header-img
    display inline-block
    vertical-align top

  .author-info
    display inline-block
    margin-left 5px
    width 60%
    height 40px
    line-height 20px

    > span
      display block
      cursor pointer
      overflow hidden
      white-space nowrap
      text-overflow ellipsis

    .author-name
      color #000
      font-size 18px
      font-weight bold

    .author-time
      font-size 14px

  .icon-btn
    width 30%
    padding 0 !important
    float right
    @media screen and (max-width: 1200px) {
      width 20%
      padding 7px
    }

    > span
      cursor pointer

    .iconfont
      margin 0 5px

  .talk-box
    margin 0 50px

    > p
      margin 0

    .reply
      font-size 16px
      color #000

  .reply-box
    margin 10px 0 0 50px
    background-color #efefef
</style>
