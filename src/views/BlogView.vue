<template>
  <div class="container" style="margin-top: 100px;">
    <div class="card">
      <div class="card-body">
        <!-- 标题和信息部分 start -->
        <div id="title">{{ post.title }}</div>
        <!-- <div id="title"> 标题 </div> -->
        <!-- 用户信息 -->
        <div id="author">
          <div class="inline-block-class font-big">作者：</div>
          <!-- 头像和用户名 -->
          <a class="head-and-name" href="#">
            <!-- 头像 -->
            <div id="author-head-image" class="inline-block-class">
              <img :src="user.avatar_url" alt="头像" style="border-radius: 50%;">
            </div>
            <div class="inline-block-class" style="margin-right: 7px;"></div>
            <!-- 用户名 -->
            <div id="author-name" class="inline-block-class">{{ user.name }}</div>
          </a>
          <!-- <div class="inline-block-class" style="margin-right: 10px;"></div> -->
          <!-- 日期 -->
          <div class="inline-block-class">
            <div class="inline-block-class font-big">，发布时间：</div>
            <div id="date" class="inline-block-class">{{ post.release_time }}</div>
          </div>
        </div>
        <!-- 标题和信息部分 end -->

        <hr>
        <!-- 文章的正文 -->
        <div style="padding: 20px;">
          <VMarkdownView :content="post.content" />
        </div>
      </div>
    </div>

    <div style="margin-top: 20px;"></div>
    <MyExchange >

    </MyExchange>

  </div>
</template>

<script>
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';
import $ from 'jquery';
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import MyExchange from '@/components/BrowsBlog/MyExchange.vue';

export default {
  name: "BlogView",
  components: {
    VMarkdownView,
    MyExchange,
  },
  props: {
  },
  data() {
    
  },
  methods: {
  },
  setup() {
    const route = useRoute();
    const postId = ref(route.params.postId);
    // 获取单个帖子

    const post = reactive({});
    const user = reactive({});

    // 获取单个帖子和单个用户
    $.ajax({
        url: "https://localhost:8082/api/post/" + postId.value,
        type: "GET",
        data: {
        },
        dataType: "json",
        success(resp) {
          // console.log("success post");
          post.id = resp.id;
          post.title = resp.title;
          post.release_time = resp.release_time;
          post.cover_url = resp.cover_url;
          post.content = resp.content;
          post.user_id = resp.user_id;
          post.user_name = resp.user_name;

          // post.value = { ...resp };

          const user_id = post.user_id;
          $.ajax({
            url: "https://localhost:8082/api/user/" + user_id,
            type: "GET",
            data: {
            },
            dataType: "json",
            success(resp) {
              user.id = resp.id;
              user.name = resp.name;
              user.register_time = resp.register_time;
              user.avatar_url = resp.avatar_url;
            },
            error(textStatus, errorThrown) {
              console.error("get user: ", textStatus, errorThrown);
            }
          });

        },
        error(textStatus, errorThrown) {
          console.error("get post: ", textStatus, errorThrown);
        }
      });

      // console.log(post);

    return {
      post: post,
      user: user,
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