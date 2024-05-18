<template>
  <div class="container" style="margin-top: 1.5rem;">

    <div v-if="is_delete_popup" class="card confirm_delete">
      <div class="card-body">
        <h5 class="card-title" style="text-align: center;font-weight: 900;color: #502C6C;"
          >{{ delete_message }}
        </h5>
        <div class="row">
          <div class="col-4"></div>
          <button @click="delete_popup" class="btn btn-primary col-4 btn-sm" style="background-color: #ef0000;">确定</button>
        </div>
      </div>
    </div>  

    <!-- Start 标签和搜索栏 -->
    <div class="row">

      <div class="col-1"></div>
      <form class="col-4" @submit.prevent="search_post(1)">
        <select class="form-select" id="validationDefault04" required v-model="label_id">
          <option selected value="0">标签</option>
          <option v-for="label in labels" :value="label.id" :key="label.id">
            {{ label.label_name }}
          </option>
        </select>
      </form>

      <div class="col-1"></div>
      <form class="col-5" @submit.prevent="search_post(1)">
        <div class="input-group">
          <!--  -->
          <input style="height: 47px;" v-model="search_query" class="form-control" type="search"
            placeholder="请输入文章标题" />
          <button id="searchButton" class="btn btn-sm btn-primary" type="submit">
            搜索
          </button>
        </div>
      </form>
    </div>
    <!-- End 标签和搜索栏 -->

    <hr class="hr-class">

    <!-- 用户列表 -->
    <div class="row text-center">
      <div class="col-1">封面</div>
      <div class="col-1">id</div>
      <div class="col-2">标题</div>
      <div class="col-1">标签</div>
      <div class="col-1">作者</div>
      <div class="col-2">发布时间</div>
      <div class="col-2">操作</div>
      <div class="col-2">编辑</div>
    </div>
    <hr class="hr-class">

    <div v-for="(post, index) in posts" :key="post.id">
      <!-- 编辑弹窗 -->
      <div v-if="is_popup" class="card my-popup">
        <div class="card-body">

          <div class="col-12" data-aos="fade-left">
            <h5 class="mb-4 text-center">修改帖子信息</h5>
            <div class="">
              <form @submit.prevent="confirm_popup">
                <div class="form-group input-group">
                  <span class="input-group-text">标题</span>
                  <input v-model="update_title" class="form-control" placeholder="标题" required="">
                </div>
                <div class="form-group input-group">
                  <span class="input-group-text">标签</span>
                  <select class="form-select" id="validationDefault05" required v-model="update_label_id">
                    <!-- <option selected disabled value="0">标签</option> -->
                    <option v-for="label in labels" :value="label.id" :key="label.id">
                      {{ label.label_name }}
                    </option>
                  </select>
                </div>

                <div class="row" style="margin-top: 3%;">
                  <div class="col-2"></div>
                  <button @click="colse_popup" class="btn btn-danger col-3 btn-sm">取消</button>
                  <div class="col-2"></div>
                  <button type="submit" class="btn btn-success col-3 btn-sm">确定</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- End 编辑弹窗 -->


      <br>
      <!-- 输出帖子列表 -->
      <div class="row text-center" data-aos="fade-up">
        <div class="col-1">
          <a :href="post.cover_url" target="_blank">
            <img class="user-photo" :src="post.cover_url" alt="封面">
          </a>
        </div>
        <div class="col-1">
          {{ post.id }}
        </div>
        <div class="col-2">
          <!-- <span class="badge badge-pill badge-success">用户</span> -->
          <router-link :to="{ name: 'blog', params: { post_id: post.id } }" class="head-and-name"
            style="font-weight: 600;">{{ post.title }}</router-link>
        </div>
        <div class="col-1">
          <div class="badge badge-pill" :class="color[post.label_id % 8]">
            {{ post.label_name }}
          </div>
        </div>
        <div class="col-1">
          <router-link :to="{ name: 'userProfile', params: { user_id: post.user_id } }" class="head-and-name"
            style="font-weight: 600;">{{ post.user_name }}</router-link>
        </div>
        <div class="col-2">
          {{ post.release_time }}
          <!-- 111 -->
        </div>
        <div class="col-2">
          <button @click="delete_post(post.id, index)" class="btn btn-sm btn-danger">删除</button>
        </div>
        <div class="col-2">
          <button class="btn btn-sm btn-success" @click="popup(index)">编辑</button>

        </div>
      </div>
      <!-- End 结束帖子列表 -->

    </div>

    <!-- End 用户列表 -->
  </div>

  <MyPagination v-if="totalPages > 0" class="my-nav" :currentPage="currentPage" :totalPages="totalPages"
    @changePage="changePage($event)" />
</template>

<script>
import { useStore } from 'vuex';
import { ref, watch } from 'vue';
import $ from 'jquery';

import MyPagination from '@/components/MyPagination.vue';

export default {
  name: "PostManagement",
  components: {
    MyPagination,
  },
  setup() {
    const store = useStore();
    const IP_PORT = store.getters.IP_PORT;
    const currentPage = ref(1);
    const totalPages = ref(1);
    const posts = ref([]);

    const ajax_get_posts_total = () => {
      // 获取帖子总数
      $.ajax({
        url: "https://" + IP_PORT + "/api/post_management/get_user_total",
        type: "GET",
        data: {

        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          totalPages.value = Math.ceil(resp / 20);
        },
        error(textStatus, errorThrown) {
          console.error("get post_management get_post total", textStatus, errorThrown);
        }
      });
    };

    // 获取帖子列表
    const ajax_get_posts = (page) => {
      $.ajax({
        url: "https://" + IP_PORT + "/api/post_management/get_post_list/" + page,
        type: "GET",
        data: {

        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          posts.value = resp;
        },
        error(textStatus, errorThrown) {
          console.error("get post_management get_post list", textStatus, errorThrown);
        }
      });
    };
    const ajax_title_search_posts = (search_query, page) => {
      $.ajax({
        url: "https://" + IP_PORT + "/api/post_management/search",
        type: "GET",
        data: {
          search_query: search_query,
          page: page,
        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          totalPages.value = Math.ceil(resp.total / 20);
          posts.value = resp.posts;
        },
        error(textStatus, errorThrown) {
          console.error("with title get post list", textStatus, errorThrown);
        }
      });
    };

    const ajax_get_labels = () => {
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/label/get_label_list",
        type: "GET",
        data: {

        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          labels.value = resp;
        },
        error(textStatus, errorThrown) {
          console.error("get user_management get_user_labels", textStatus, errorThrown);
        }
      });
    }

    const ajax_label_get_posts = (label_id, page) => {
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/post_management/label_post",
        type: "GET",
        data: {
          label_id: label_id,
          page: page,
        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          totalPages.value = Math.ceil(resp.total / 20);
          posts.value = resp.posts;
        },
        error(textStatus, errorThrown) {
          console.error("with label get posts: ", textStatus, errorThrown);
        }
      });
    };

    const ajax_title_label_posts = (search_query, label_id, page) => {
      $.ajax({
        url: "https://" + IP_PORT + "/api/post_management/title_label_post",
        type: "GET",
        data: {
          search_query: search_query,
          label_id: label_id,
          page: page,
        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          totalPages.value = Math.ceil(resp.total / 20);
          posts.value = resp.posts;
        },
        error(textStatus, errorThrown) {
          console.error("with title and label get posts: ", textStatus, errorThrown);
        }
      });
    }

    const ajax_delete_post = (post_id, index) => {
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
        success() {
          posts.value.splice(index, 1);
        },
        error(textStatus, errorThrown) {
          console.error("delete posts: ", textStatus, errorThrown);
        }
      });
    };


    const ajax_confirm_popup = (index) => {
      const id = posts.value[index].id;
      // console.log(id, update_title.value, update_label_id.value);
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/post_management/update_post_info",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          post_id: id,
          title: update_title.value,
          label_id: update_label_id.value,
        }),
        // dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          console.log(resp);
          posts.value[index].title = update_title.value;
          posts.value[index].label_id = update_label_id.value;
          const label_index = labels.value.findIndex(label => label.id === update_label_id.value);
          posts.value[index].label_name = labels.value[label_index].label_name;
          is_popup.value = false;
          delete_message.value = "修改成功";
          is_delete_popup.value = true;
        },
        error(textStatus, errorThrown) {
          console.error("update post info: ", textStatus, errorThrown);
        }
      });
    };

    ajax_get_posts_total();
    ajax_get_posts(1);
    ajax_get_labels();

    const changePage = (page) => {
      currentPage.value = page;
      if (search_query.value.length != 0 && label_id.value != 0) {
        // console.log("////////");
        ajax_title_label_posts(search_query.value, label_id.value, page);
      } else if (search_query.value.length != 0) {
        ajax_title_search_posts(search_query.value, page);
      } else if (label_id.value != 0) {
        ajax_label_get_posts(label_id.value, page);
      } else {
        // 获取帖子总数
        ajax_get_posts_total();
        // 获取帖子
        ajax_get_posts(page);
      }
    };

    // 通过标题搜索帖子
    const search_query = ref('');
    const search_post = (page) => {
      changePage(page);
    };

    // 通过标签搜索文章
    const labels = ref([]);
    const label_id = ref(0);
    watch(label_id, (newValue, oldValue) => {
      console.log("newValue: ", oldValue, newValue);
      changePage(1);
    });


    // 颜色
    const color = [
      "badge-primary",
      "badge-secondary",
      "badge-success",
      "badge-danger",
      "badge-warning",
      "badge-info",
      "badge-purple",
      "badge-cyan",
    ];

    const delete_message = ref('');
    // 删除帖子
    // 开启删除弹窗
    const is_delete_popup = ref(false);
    const delete_popup = () => {
      delete_message.value = "删除成功";
      is_delete_popup.value = !is_delete_popup.value;
    };

    const delete_post = (post_id, index) => {
      ajax_delete_post(post_id, index);
      is_delete_popup.value = true;
    };


    // 编辑窗口
    const update_label_id = ref(0);
    const update_title = ref('');
    const is_popup = ref(false);
    const post_index = ref(0);
    const popup = (index) => {
      post_index.value = index;
      is_popup.value = !is_popup.value;
      update_title.value = posts.value[index].title;
      update_label_id.value = posts.value[index].label_id;
    };

    const colse_popup = () => {
      is_popup.value = !is_popup.value;
    }

    const confirm_popup = () => {
      const index = post_index.value;
      // console.log(id);
      ajax_confirm_popup(index);
    };

    return {
      changePage,
      currentPage,
      totalPages,
      posts,
      search_query,
      search_post,
      color,
      labels,
      label_id,
      delete_post,
      delete_popup,
      delete_message,
      is_delete_popup,
      update_label_id,
      update_title,
      is_popup,
      popup,
      colse_popup,
      confirm_popup,
    }
  }
}
</script>


<style scoped>
.hr-class {
  border-color: #6a6a6a;
  /* margin-left: 10px; */
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
  width: 64px;
  height: 64px;
  border-radius: 5px;
}

.my-nav {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  /* background-color: #f8f9fa; 可以根据需要设置底部导航的背景颜色 */
  padding: 10px;
  z-index: 10;
}

.ban-button {
  float: right;
}

.my-popup {
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
  width: 40%;
  height: auto;
  z-index: 11;
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
</style>
