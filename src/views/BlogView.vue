<template>
  <div class="container" style="margin-top: 100px;">
    <div class="card">
      <div class="card-body">
        <!-- 标题和信息部分 start -->
        <div id="title">扩展欧几里得</div>
        <!-- 用户信息 -->
        <div id="author">
          <div class="inline-block-class font-big">作者：</div>
          <!-- 头像和用户名 -->
          <a class="head-and-name" href="#">
            <!-- 头像 -->
            <div id="author-head-image" class="inline-block-class">
              <img src="@/assets/img/demo/avatar.png" alt="头像" style="border-radius: 50%;">
            </div>
            <div class="inline-block-class" style="margin-right: 7px;"></div>
            <!-- 用户名 -->
            <div id="author-name" class="inline-block-class">蓝鲸上的孤岛</div>
          </a>
          <!-- <div class="inline-block-class" style="margin-right: 10px;"></div> -->
          <!-- 日期 -->
          <div class="inline-block-class">
            <div class="inline-block-class font-big">，发布时间：</div>
            <div id="date" class="inline-block-class">2024-02-16</div>
          </div>
        </div>
        <!-- 标题和信息部分 end -->

        <hr>
        <!-- 文章的正文 -->
        <div style="padding: 20px;">
          <VMarkdownView :content="markdownText" />
        </div>
      </div>
    </div>

    <div style="margin-top: 20px;"></div>

    <!-- 点赞，收藏，举报， 评论-->
    <div class="card">
      <div class="card-body">
        <div class="card" style="margin-bottom: 10px;">
          <div class="card-body">
            <div class="col-4 inline-block-class" style="text-align: center;">
              <i class="far fa-heart my-shadow"></i>
              点赞
            </div>
            <div class="col-4 inline-block-class" style="text-align: center;">
              <i class="far fa-star"></i>
              收藏
            </div>
            <div class="col-4 inline-block-class" style="text-align: center;">
              <i class="fas fa-exclamation"></i>
              举报
            </div>
          </div>
        </div>

        <!-- 评论 -->
        <div class="card">
          <div class="card-body">
            <label class="form-label">评论</label>
            <!-- 使用我们的 v-model 将我们的 content 和 textarea内容绑定 -->
            <textarea v-model="comment" class="form-control" rows="3" placeholder="这里写评论..."></textarea>
            <button @click="submit_comment" class="btn btn-primary" style="margin-top: 2px;">提交评论</button>
            <hr>

            <!-- 已经发表的评论 -->
            <div v-for="user in users" :key="user.id">
              <!-- vertical-align: top; 头像和用户名在垂直方向上对齐-->
              <div class="inline-block-class" style="margin-right: 10px; vertical-align: top;">
                <img class="user-photo" :src="user.photo" alt="头像">
              </div>
              <div class="inline-block-class" style="vertical-align: top;">
                <div><a href="#" class="head-and-name">{{ user.username }}</a></div>
                <div style="color: #ADA399; font-size: 8px;">2024-02-18</div>
              </div>
              <div style="margin-left: 58px;">{{ user.followerCount }}</div>
              <hr>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';

import $ from 'jquery';
import { ref } from 'vue';

export default {
  name: "BlogView",
  components: {
    VMarkdownView,
  },
  data() {
    return {
      markdownText: '',
      comment: '',
    }
  },
  methods: {
    // 提交评论
    submit_comment() {
      this.markdownText = this.comment;
      this.comment = '';
    }
  },
  setup() {
    // 获取用户列表
    const users = ref([]);

    $.ajax({
      url: "https://app165.acapp.acwing.com.cn/myspace/userlist/",
      type: "GET",
      data: {

      },
      dataType: "json",
      success(resp) {
        users.value = resp;
      }
    });

    return {
      users,
    }
  }
};
</script>

<style scoped>
hr {
  border: none;
  /* 移除默认的边框 */
  border-top: 1px solid rgb(112, 112, 112);
  /* 设置顶部边框的粗细和颜色 */
}

#title {
  font-size: 35px;
  font-weight: 400;
  white-space: nowrap;
  /* 保证内容在一行内显示 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  text-overflow: ellipsis;
  /* 超出部分显示为省略号 */
}

.font-big {
  font-size: 18px;
}

.head-and-name:visited {
  color: rgb(0, 94, 255);
  /* 设置访问过的链接颜色为链接原本的颜色 */
}

.head-and-name:hover {
  text-decoration: underline;
  /* 鼠标悬浮时添加下划线 */
}

#author-name:hover {
  text-decoration: underline;
  /* 鼠标悬浮时添加下划线 */
}

.inline-block-class {
  display: inline-block;
}

#author-head-image {
  width: 48px;
  height: 48px;
}

#date {
  color: #ADA399;
}

.user-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
</style>