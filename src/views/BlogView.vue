<template>
  <div class="container" style="margin-top: 100px;">

    <div v-if="is_report" class="card my-report">
      <div class="card-body">
        <textarea v-model="report_reason" class="form-control" rows="3" placeholder="说明举报的原因" required=""></textarea>
        <div class="row" style="margin-top: 3%;">
          <div class="col-2"></div>
          <button @click="report" class="btn btn-danger col-3 btn-sm">取消</button>
          <div class="col-2"></div>
          <button @click="confirm_report" class="btn btn-primary col-3 btn-sm">确定</button>
        </div>
      </div>
    </div>

    <!-- confirm_delete -->
    <!-- 删除帖子 -->
    <div v-if="is_confirm_delete_post" class="card confirm_delete">
      <div class="card-body">
        <h5 class="card-title" style="text-align: center;font-weight: 900;color: #502C6C;"
          >确认删除该帖子吗？
        </h5>
        <div class="row">
          <div class="col-1"></div>
          <button @click="delete_post(post.id)" class="btn btn-primary col-4 btn-sm" style="background-color: #ef0000;">确定</button>
          <div class="col-2"></div>
          <button @click="confirm_delete_post" class="btn btn-primary col-4 btn-sm">取消</button>
        </div>
      </div>
    </div>

    <!-- 已经删除 -->
    <div v-if="show_id_deleted" class="card confirm_delete" style="width: 18rem;z-index: 1;">
      <div class="card-body">
        <h5 class="card-title" style="text-align: center;font-weight: 900;color: #502C6C;"
          >{{ deleted_message }}
        </h5>
        <div class="row">
          <div class="col-4"></div>
          <button @click="confirm" class="btn btn-primary col-4 btn-sm">确定</button>
          <div class="col-4"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body"  data-aos="fade-up">
        <!-- 标题和信息部分 start -->
        <div class="row">
          <div id="title" class="col-10">{{ post.title }}</div>
          <div v-if="is_me || is_admin" class="col-2">
            <button type="button" @click="confirm_delete_post" class="btn btn-sm btn-primary"
              style="background-color: #DC3545;">删除</button>
          </div>
        </div>
        <!-- <div id="title"> 标题 </div> -->
        <!-- 用户信息 -->
        <div id="author">
          <div class="inline-block-class font-big">作者：</div>
          <!-- 头像和用户名 -->
          <a class="head-and-name" href="#">
            <!-- 头像 -->
            <div id="author-head-image" class="inline-block-class">
              <router-link :to="{ name: 'userProfile', params: {user_id: user.id ? user.id : -1} }">
                <img :src="user.avatar_url" alt="头像" style="border-radius: 50%;">
              </router-link>
            </div>
            <div class="inline-block-class" style="margin-right: 7px;"></div>
            <!-- 用户名 -->
            <router-link id="author-name" class="inline-block-class"
            :to="{ name: 'userProfile', params: {user_id: user.id ? user.id : -1} }"
            >{{ user.name }}</router-link>
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
    <MyExchange :post_of_user_id="post.user_id" @report="report" />

  </div>
</template>

<script>
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';
import $ from 'jquery';
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

import MyExchange from '@/components/BrowsBlog/MyExchange.vue';

export default {
  name: "BlogView",
  components: {
    VMarkdownView,
    MyExchange,
  },
  data() {

  },
  methods: {
  },
  setup() {
    const route = useRoute();
    const post_id = ref(route.params.post_id);
    // 获取单个帖子
    const store = useStore();
    const is_admin = computed(() => {
      return store.getters['user/getIsAdmin'];
    });
    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });
    const is_me = ref(false);

    const post = reactive({});
    const user = reactive({});

    // 获取单个帖子和单个用户
    $.ajax({
      url: "https://localhost:8082/api/post/" + post_id.value,
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

        is_me.value = (post.user_id === user_id.value);
        // console.log(is_me.value);
        $.ajax({
          url: "https://localhost:8082/api/user/" + post.user_id,
          type: "GET",
          data: {
          },
          dataType: "json",
          success(resp) {
            user.id = resp.id;
            user.name = resp.name;
            // user.register_time = resp.register_time;
            user.avatar_url = resp.avatar_url;
            console.log(resp.avatar_url);
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

    // console.log(user_id.value, post.user_id);
    
    const is_confirm_delete_post = ref(false);
    // 确认删除吗
    const confirm_delete_post = (() => {
      is_confirm_delete_post.value = !is_confirm_delete_post.value;
    });

    const router = useRouter();
    const show_id_deleted = ref(false);
    const is_deleted = ref(false);
    const deleted_message = ref('');

    // 删除帖子函数
    const delete_post = ((post_id) => {
      // console.log("Start delete_post");
      $.ajax({
        url: "https://localhost:8082/api/delete_post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          post_id: post_id,
        }),
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          // router.push({name: "blog", params: {post_id: 0}});
          // 隐藏是否确认删除
          is_confirm_delete_post.value = false;
          is_deleted.value = true;
          // 显示弹窗
          show_id_deleted.value = true;
          deleted_message.value = "删除成功";

          store.commit('recommend/deletePosts', post_id);
          store.commit('recommend/subTotalPosts');
          console.log("delete_post successful: ", resp);
        },
        error(textStatus, errorThrown) {

          is_confirm_delete_post.value = false;
          // 显示弹窗
          show_id_deleted.value = true;
          is_deleted.value = false;
          deleted_message.value = "删除失败";
          console.error("delete post: ", textStatus, errorThrown);
        }
      });
    });

    // 删除成功调用函数
    const confirm = (() => {
      show_id_deleted.value = false;
      if (is_deleted.value == true) {
        router.push({name: "blog", params: {post_id: 0}});
      }
    });


    // 举报模块
    const is_report = ref(false);
    const report_reason = ref('');
    const report = () => {
      is_report.value = !is_report.value;
    };

    // 确认举报
    const confirm_report = () => {
      // console.log(user_id.value, post_id.value, report_reason.value);
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/report/submit",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_id: user_id.value,
          post_id: parseInt(post_id.value),
          report_reason: report_reason.value,
        }),
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success() {
          is_report.value = false;
          show_id_deleted.value = true;
          deleted_message.value = "举报成功";
        },
        error(textStatus, errorThrown) {
          show_id_deleted.value = true;
          deleted_message.value = "举报失败，稍后重试";
          console.error("submit report error", textStatus, errorThrown);
        }
      });
    };

    return {
      post,
      user,
      is_admin,
      is_me,
      is_confirm_delete_post,
      confirm_delete_post,
      delete_post,
      show_id_deleted,
      deleted_message,
      confirm,
      is_report,
      report_reason,
      report,
      confirm_report,
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

.confirm_delete {
  position: fixed;
  /* 使用固定定位 */
  top: 50%;
  /* 将顶部定位在屏幕的中间 */
  left: 50%;
  /* 将左侧定位在屏幕的中间 */
  transform: translate(-50%, -50%);
  /* 使用 transform 将元素向左上方移动其自身宽高的一半，使其完全位于屏幕中间 */
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ccc;
  width: 18rem;z-index: 1;
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
  /* color: #f60e0e; */
}

.user-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.my-report {
  position: fixed;
  /* 使用固定定位 */
  top: 50%;
  /* 将顶部定位在屏幕的中间 */
  left: 50%;
  /* 将左侧定位在屏幕的中间 */
  transform: translate(-50%, -50%);
  /* 使用 transform 将元素向左上方移动其自身宽高的一半，使其完全位于屏幕中间 */
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ccc;
  width: 50%;
  height: auto;
  z-index: 1;
}

</style>