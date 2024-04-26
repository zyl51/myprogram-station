<template>
  <!-- 点赞，收藏，举报， 评论-->
  <div class="card" data-aos="fade-up">

    <div class="card-body">
      <LikeCollect @report="report" />

      <!-- 评论 -->
      <div class="card">
        <div class="card-body">
          <label class="form-label">评论</label>
          <!-- 使用我们的 v-model 将我们的 content 和 textarea内容绑定 -->
          <textarea v-model="comment" class="form-control" rows="3" placeholder="支持 Markdown 语法和 KaTex 数学公式..."></textarea>
          <button @click="submit_comment" class="btn btn-primary" style="margin-top: 2px;">提交评论</button>
          <br>
          <br>
          <!-- <hr> -->

          <!-- 已经发表的评论 -->
          <div v-for="usercomment in user_comments" :key="usercomment.id">
            <!-- vertical-align: top; 头像和用户名在垂直方向上对齐-->
            <div class="inline-block-class" style="margin-right: 10px; vertical-align: top;">
              <router-link :to="{name: 'userProfile', params: {user_id: usercomment.user_id}}">
                <img class="user-photo" :src="usercomment.avatar_url" alt="头像">
              </router-link>
            </div>
            <div class="inline-block-class" style="vertical-align: top;">
              <div class="inline-block-class">
                <router-link :to="{name: 'userProfile', params: {user_id: usercomment.user_id}}" class="head-and-name">{{ usercomment.username }}</router-link>
                <span v-if="usercomment.user_id === post_of_user_id" class="badge badge-pill badge-primary ml-2">作者</span>
              </div>
              <div style="color: #ADA399; font-size: 8px;">{{ usercomment.release_time }}</div>
            </div>
            <!-- 用户为管理员用户为帖子主人，用户为评论主任 -->
            <button v-if="is_admin || user_id === post_of_user_id || user_id === usercomment.user_id"
              @click="delete_comment(usercomment.id)" class="btn btn-sm btn-danger delete-button">删除</button>

            <VMarkdownView style="margin-left: 58px;" :content="usercomment.comment" />
            <!-- <div style="margin-left: 58px;">{{ usercomment.comment }}</div> -->

            <hr class="hr-class">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import $ from 'jquery';
import { useStore } from 'vuex';
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';

import LikeCollect from '@/components/BrowsBlog/LikeCollect.vue';

export default {
  name: "MyExchange",
  components: {
    LikeCollect,
    VMarkdownView,
  },
  props: {
    post_of_user_id: {
      type: Number,
      required: true,
    }
  },
  data() {
  },
  methods: {
  },
  setup(props, context) {

    const report = () => {
      context.emit("report");
    };

    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const post_id = ref(parseInt(route.params.post_id));
    // console.log(post_id.value);
    const user_comments = ref([]);

    // 获得这个帖子的评论
    $.ajax({
      url: "https://127.0.0.1:8082/api/user_comment/" + post_id.value,
      type: "GET",
      data: {

      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        user_comments.value = resp;
      },
      error(textStatus, errorThrown) {
        console.error("get user comments", textStatus, errorThrown);
      }
    });

    // 发布评论
  
    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });
    const is_admin = computed(() => {
      return store.getters['user/getIsAdmin'];
    });
    const comment = ref('');
    const submit_comment = () => {
      const is_login = computed(() => {
        return store.getters['user/getIsLogin'];
      })
      if (!is_login.value) {
        router.push({name: "login"});
      }
      // 获取用户的数据，用于发布评论

      const username = computed(() => {
        return store.getters['user/getUserName'];
      });

      const avatar_url = computed(() => {
        return store.getters['user/getAvatarUrl'];
      });

      const now = new Date();
      const release_time = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      // console.log(formattedDateTime);
      // console.log(typeof post_id);
      $.ajax({
        url: "https://127.0.0.1:8082/api/user_comment/submit",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          post_id: post_id.value,
          user_id: user_id.value,
          username: username.value,
          avatar_url: avatar_url.value,
          release_time: release_time,
          comment: comment.value,
        }),
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          // 成功出表新数据
          // console.log("submit_comment is successful", resp);
          const new_comment = {
            id: resp,
            post_id: post_id.value,
            user_id: user_id.value,
            username: username.value,
            avatar_url: avatar_url.value,
            release_time: release_time,
            comment: comment.value,
          };
          // console.log(comment.value);
          user_comments.value.unshift(new_comment);
          comment.value = '';
        },
        error(textStatus, errorThrown) {
          console.error("submit comment error", textStatus, errorThrown);
        }
      });
    }


    // 删除评论
    const delete_comment = (id) => {
      // console.log(id);
      $.ajax({
        url: "https://127.0.0.1:8082/api/user_comment/delete",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          comment_id: id,
        }),
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          const index = user_comments.value.findIndex(comment => comment.id === id);
          if (index !== -1) {
            user_comments.value.splice(index, 1);
          }
          console.log(resp);
        },
        error(textStatus, errorThrown) {
          console.error("submit comment error", textStatus, errorThrown);
        }
      });
    };

    return {
      report,
      user_comments,
      comment,
      submit_comment,
      delete_comment,
      user_id,
      is_admin,
    }
  }
}
</script>

<style scoped>
.hr-class {
  border-color: #6a6a6a;
  margin-left: 10px;
}

.head-and-name:visited {
  color: rgb(0, 94, 255);
  /* 设置访问过的链接颜色为链接原本的颜色 */
}

.head-and-name:hover {
  text-decoration: underline;
  /* 鼠标悬浮时添加下划线 */
}

.inline-block-class {
  display: inline-block;
}

.user-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.delete-button {
  /* margin-top: 10px; */
  /* margin-left: 2.5rem; */
  /* height: 20%; */
  background-color: #DC3545;
  float: right;
}

</style>