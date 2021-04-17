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

        <el-footer
          style="height: 60px; background-color: #eaedf1;display: flex;justify-content: space-between;align-items: center;">
          <div>
            <el-form inline>
              <el-button id="like" v-if="isLikeArticleFlag" type="text" style="font-size: 18px; margin-right: 8px;" @click="unLikeArticle">
                <i class="el-icon-thumb"></i> 点赞</el-button>
              <el-button v-else type="text" style="font-size: 18px; margin-right: 8px;" @click="likeArticle"><i class="el-icon-thumb"></i> 点赞
              </el-button>
              <el-button type="text" style="font-size: 18px; margin-right: 8px;"><i class="el-icon-document"></i> 评论
              </el-button>
              <el-button id="favorite" v-if="isFavoriteArticleFlag" type="text" style="font-size: 18px; margin-right: 8px;" @click="unFavoriteArticle">
                <i class="el-icon-star-off"></i> 收藏
              </el-button>
              <el-button v-else type="text" style="font-size: 18px; margin-right: 8px;" @click="favoriteArticle">
                <i class="el-icon-star-off"></i> 收藏
              </el-button>
              <el-button type="danger" round style="font-size: 18px;" size="small">一键三联</el-button>

            </el-form>
          </div>
          <el-rate v-model="value1" style="float: right" @change="score"></el-rate>
        </el-footer>

      </el-container>
    </el-card>
    <el-card style="margin-top: 10px; ">
      <el-container>
        <el-footer style="height: auto">
          <div>
            <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
              <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
              <div class="reply-info">
                <div
                  tabindex="0"
                  contenteditable="true"
                  id="replyInput"
                  spellcheck="false"
                  placeholder="输入评论..."
                  class="reply-input"
                  @focus="showReplyBtn"
                  @input="onDivInput($event)"
                >
                </div>
              </div>
              <div class="reply-btn-box" v-show="btnShow">
                <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
              </div>
            </div>
            <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
              <el-avatar class="header-img" :size="40" :src="item.avatar"></el-avatar>
              <div class="author-info">
                <span class="author-name">{{ item.username }}</span>
                <span class="author-time">{{ item.time }}</span>
              </div>
              <div class="icon-btn">
                <span @click="showReplyInput(i,item.username,item.id)"><i
                 class="iconfont el-icon-s-comment"></i></span>
              </div>
              <div class="talk-box">
                <p>
                  <span class="reply">{{ item.comment }}</span>
                </p>
              </div>
              <div class="reply-box">
                <div v-for="(reply,j) in item.reply" :key="j" class="author-title">
                  <el-avatar class="header-img" :size="40" :src="reply.avatar"></el-avatar>
                  <div class="author-info">
                    <span class="author-name">{{ reply.username }}</span>
                    <span class="author-time">{{ reply.time }}</span>
                  </div>
                  <div class="icon-btn">
                  <span @click="showReplyInput(i,reply.username,reply.id)"><i
                    class="iconfont el-icon-s-comment"></i></span>
                  </div>
                  <div class="talk-box">
                    <p>
                      <span>回复 {{ reply.pname }}:</span>
                      <span class="reply">{{ reply.comment }}</span>
                    </p>
                  </div>
                  <div class="reply-box">

                  </div>
                </div>
              </div>
              <div v-show="_inputShow(i)" class="my-reply my-comment-reply">
                <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
                <div class="reply-info">
                  <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."
                       @input="onDivInput($event)" class="reply-input reply-comment-input"></div>
                </div>
                <div class=" reply-btn-box">
                  <el-button class="reply-btn" size="medium" @click="sendCommentReply(i,j)" type="primary">发表评论
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-card>

  </div>
</template>

<script>
const clickoutside = {
  // 初始化指令
  bind (el, binding, vnode) {
    function documentHandler (e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e)
      }
    }

    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler
    document.addEventListener('click', documentHandler)
  },
  update () {
  },
  unbind (el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside)
    delete el.vueClickOutside
  },
}

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
      commentList: [],
      classificationData: [],
      classificationMap: new Map(),
      // 评论
      btnShow: false,
      index: '0',
      replyComment: '',
      myName: '',
      myHeader: '',
      myId: '',
      pname: '',
      toId: 0,
      comments: [],
      commentForm: {
        username: '',
        avatar: '',
        comment: '',
        inputShow: false,
        pname: '',
        toId: 0,
        articleId: ''
      },
      likeArticleForm: {
        tinymceId: '',
        username: ''
      },
      isLikeArticleFlag: false,
      favoriteArticleForm: {
        tinymceId: '',
        username: ''
      },
      isFavoriteArticleFlag: false,
      scoreData: {
        tinymceId: '',
        score: '',
        username: ''
      },
      getScoreData: {
        tinymceId: '',
        username: ''
      },
      favoriteNum: 0,

    }
  },
  created () {
    this.tinymceId = this.$route.query.id
    this.userInfo = this.$store.state.userInfo
    this.myId = this.userInfo.id
    this.myName = this.userInfo.username
    this.myHeader = this.userInfo.avatar
    this.getContents()
    this.getCommentTree()
    this.listAllClassification()
    this.isLikeArticle()
    this.isFavoriteArticle()
    this.getScore()
    this.getNum()
  },
  directives: { clickoutside },
  methods: {
    getNum() {
      this.$http.get('/obtain/favorites/getNum',{params:{tinymceId:this.$route.query.id}}).then(res => {
        if (res.data.code === 20000) {
          this.favoriteNum = res.data.data
        }
      })
    },
    score() {
      this.scoreData.tinymceId = this.$route.query.id
      this.scoreData.score = this.value1
      this.scoreData.username = this.$store.state.userInfo.username
      this.$http.post('/obtain/score/score',this.scoreData).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '评价成功'
          })
        }
      }).catch()
    },
    getScore() {
      this.getScoreData.tinymceId = this.$route.query.id
      this.getScoreData.username = this.$store.state.userInfo.username
      this.$http.get('/obtain/score/getScore',{params:this.getScoreData}).then(res => {
        if (res.data.code === 20000) {
          this.value1 = res.data.data
        }
      }).catch()
    },
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
    getCommentTree() {
      this.$http.get('/obtain/comment/tree',{params: {articleId:this.$route.query.id }}).then(res => {
        if (res.data.code === 20000) {
          this.comments = res.data.data.tree
        }
      })
    },
    //
    inputFocus () {
      const replyInput = document.getElementById('replyInput')
      replyInput.style.padding = '8px 8px'
      replyInput.style.border = '2px solid blue'
      replyInput.focus()
    },
    showReplyBtn () {
      this.btnShow = true
    },
    hideReplyBtn () {
      this.btnShow = false
      replyInput.style.padding = '10px'
      replyInput.style.border = 'none'
    },
    showReplyInput (i, name, id) {
      this.comments[this.index].inputShow = false
      this.index = i
      this.comments[i].inputShow = true
      this.pname = name
      this.toId = id
      console.log(id)
    },
    _inputShow (i) {
      return this.comments[i].inputShow
    },
    sendComment () {
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '评论不能为空'
        })
      } else {
        let a = {}
        let input = document.getElementById('replyInput')
        let timeNow = new Date().getTime()
        let time = this.dateStr(timeNow)
        a.username = this.myName
        a.comment = this.replyComment
        a.avatar = this.myHeader
        a.time = time
        a.commentNum = 0
        this.comments.push(a)
        this.replyComment = ''
        input.innerHTML = ''
        this.addComment('',a.comment)
      }
    },
    sendCommentReply (i, j) {
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '评论不能为空'
        })
      } else {
        let a = {}
        let timeNow = new Date().getTime()
        let time = this.dateStr(timeNow)
        a.username = this.myName
        a.pname = this.pname
        a.avatar = this.myHeader
        a.comment = this.replyComment
        a.time = time
        a.commentNum = 0
        this.comments[i].reply.push(a)
        this.replyComment = ''
        document.getElementsByClassName('reply-comment-input')[i].innerHTML = ''
        this.addComment(a.pname,a.comment)
      }
    },
    onDivInput: function (e) {
      this.replyComment = e.target.innerHTML
    },
    dateStr (date) {
      //获取js 时间戳
      let time = new Date().getTime()
      //去掉 js 时间戳后三位，与php 时间戳保持一致
      time = parseInt((time - date) / 1000)
      //存储转换值
      let s
      if (time < 60 * 10) {//十分钟内
        return '刚刚'
      } else if ((time < 60 * 60) && (time >= 60 * 10)) {
        //超过十分钟少于1小时
        s = Math.floor(time / 60)
        return s + '分钟前'
      } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
        //超过1小时少于24小时
        s = Math.floor(time / 60 / 60)
        return s + '小时前'
      } else if ((time < 60 * 60 * 24 * 30) && (time >= 60 * 60 * 24)) {
        //超过1天少于30天内
        s = Math.floor(time / 60 / 60 / 24)
        return s + '天前'
      } else {
        //超过30天ddd
        var date = new Date(parseInt(date))
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
      }
    },
    addComment(pname,comment) {
      this.commentForm.username = this.userInfo.username
      this.commentForm.avatar = this.userInfo.avatar
      this.commentForm.comment = comment
      this.commentForm.pname = pname
      this.commentForm.toId = this.toId
      this.commentForm.articleId = this.$route.query.id
      this.$http.post('/obtain/comment/add',this.commentForm).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '评论成功'
          })
        }
      }).catch()
    },
    // 点赞
    likeArticle() {
      this.likeArticleForm.tinymceId = this.$route.query.id
      this.likeArticleForm.username = this.userInfo.username
      this.$http.post('/obtain/like/likeArticle',this.likeArticleForm).then(res => {
          if (res.data.code === 20000) {
            this.$message({
              type: 'success',
              message: '点赞成功'
            })
            this.isLikeArticle()
          }
      }).catch()
    },
    unLikeArticle() {
      this.likeArticleForm.tinymceId = this.$route.query.id
      this.likeArticleForm.username = this.userInfo.username
      this.$http.post('/obtain/like/unLikeArticle',this.likeArticleForm).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '取消成功'
          })
          this.isLikeArticle()
        }
      }).catch()
    },
    isLikeArticle() {
      this.likeArticleForm.tinymceId = this.$route.query.id
      this.likeArticleForm.username = this.userInfo.username
      this.$http.post('/obtain/like/isLikeArticle',this.likeArticleForm).then(res => {
        if (res.data.code === 20000) {
          this.isLikeArticleFlag = res.data.data
          console.log(this.isLikeArticleFlag)
        }
      }).catch()
    },
    // 收藏
    favoriteArticle() {
      this.favoriteArticleForm.tinymceId = this.$route.query.id
      this.favoriteArticleForm.username = this.userInfo.username
      this.$http.post('/obtain/favorites/favoriteArticle',this.favoriteArticleForm).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '收藏成功'
          })
          this.isFavoriteArticle()
        }
      }).catch()
    },
    unFavoriteArticle() {
      this.favoriteArticleForm.tinymceId = this.$route.query.id
      this.favoriteArticleForm.username = this.userInfo.username
      this.$http.post('/obtain/favorites/unFavoriteArticle',this.favoriteArticleForm).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '取消收藏成功'
          })
          this.isFavoriteArticle()
        }
      }).catch()
    },
    isFavoriteArticle() {
      this.favoriteArticleForm.tinymceId = this.$route.query.id
      this.favoriteArticleForm.username = this.userInfo.username
      this.$http.post('/obtain/favorites/isFavoriteArticle',this.favoriteArticleForm).then(res => {
        if (res.data.code === 20000) {
          this.isFavoriteArticleFlag = res.data.data
        }
      }).catch()
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
