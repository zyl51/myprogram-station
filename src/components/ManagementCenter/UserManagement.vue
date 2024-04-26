<template>
  <div class="container" style="margin-top: 1.5rem;">

    <form class="row" @submit.prevent="search_user">
      <div class="col-3"></div>
      <div class="col-6 row">
        <input style="height: 35px;" v-model="search_query" class="form-control col-9" type="search"
          placeholder="请输入用户名" />
        <div class="col-1"></div>
        <button id="searchButton" class="btn btn-sm btn-primary col-2" type="submit">
          搜索
        </button>
      </div>

    </form>
    <hr class="hr-class">

    <!-- 用户列表 -->
    <div class="row text-center">
      <div class="col-1">头像</div>
      <div class="col-1">id</div>
      <div class="col-1">身份</div>
      <div class="col-1">用户名</div>
      <div class="col-2">邮箱</div>
      <div class="col-2">注册时间</div>
      <div class="col-2">操作</div>
      <div class="col-2">编辑</div>
    </div>
    <hr class="hr-class">

    <div v-for="(user, index) in users" :key="user.id" >
      <!-- 编辑弹窗 -->
      <div v-if="is_popup" class="card my-popup">
        <div class="card-body">

          <div class="col-12" data-aos="fade-left">
            <h5 class="mb-4 text-center">修改用户信息</h5>
            <div class="">
              <form @submit.prevent="confirm_popup(index)">
                <div class="form-group input-group">
                  <span class="input-group-text">用户名</span>
                  <input v-model="update_username" class="form-control" placeholder="用户名" required="">
                </div>
                <div class="form-group input-group">
                  <span class="input-group-text">邮箱</span>
                  <input v-model="update_email" class="form-control" placeholder="邮箱" @input="validateEmail"
                    required="">
                </div>

                <!-- 单选框 -->
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                    v-model="update_is_admin" :checked="update_is_admin == 'admin'" value="admin">
                  <label class="form-check-label" for="flexRadioDefault1">
                    管理员
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                    v-model="update_is_admin" :checked="update_is_admin == 'user'" value="user">
                  <label class="form-check-label" for="flexRadioDefault2">
                    普通用户
                  </label>
                </div>
                <!-- End 单选框 -->

                <div class="row" style="margin-top: 3%;">
                  <div class="col-2"></div>
                  <button @click="colse_popup" class="btn btn-danger col-3 btn-sm">取消</button>
                  <div class="col-2"></div>
                  <button type="submit" :disabled="!isValidEmail" class="btn btn-success col-3 btn-sm">确定</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- End 编辑弹窗 -->


      <br v-if="user_id != user.user_id">
      <div v-if="user_id != user.user_id" class="row text-center" data-aos="fade-up">
        <div class="col-1">
          <a :href="user.avatar_url" target="_blank">
            <img class="user-photo" :src="user.avatar_url" alt="头像">
          </a>
        </div>
        <div class="col-1">
          {{ user.user_id }}
        </div>
        <div v-if="user.is_admin" class="col-1">
          <span class="badge badge-pill badge-danger">管理员</span>
        </div>
        <div v-else class="col-1">
          <span class="badge badge-pill badge-success">用户</span>
        </div>
        <div class="col-1">
          <router-link :to="{ name: 'userProfile', params: { user_id: user.user_id } }" class="head-and-name"
            style="font-weight: 600;">{{ user.username }}</router-link>
        </div>
        <div class="col-2">
          {{ user.email }}
          <!-- 111 -->
        </div>
        <div class="col-2">
          {{ user.register_time }}
        </div>
        <div class="col-2">
          <button v-if="is_admin && !user.is_ban" @click="ban_user(user.user_id, index)"
            class="btn btn-sm btn-danger">封禁</button>

          <button v-if="is_admin && user.is_ban" @click="ban_user(user.user_id, index)"
            class="btn btn-sm btn-primary">解禁</button>
        </div>
        <div class="col-2">
          <button class="btn btn-sm btn-success" @click="popup(index)">编辑</button>

        </div>
        <!-- <hr class="hr-class"> -->
      </div>
    </div>

    <!-- End 用户列表 -->
  </div>

  <MyPagination v-if="totalPages > 0" class="my-nav" :currentPage="currentPage" :totalPages="totalPages"
    @changePage="changePage($event)" />
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import $ from 'jquery';

import MyPagination from '@/components/MyPagination.vue';

export default {
  name: "UserManagement",
  components: {
    MyPagination,
  },
  setup() {
    const store = useStore();
    const is_admin = computed(() => {
      return store.getters['user/getIsAdmin'];
    });
    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });
    const users = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const changePage = (page) => {
      currentPage.value = page;
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/user_management/get_user_list/" + page,
        type: "GET",
        data: {

        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          users.value = resp;
        },
        error(textStatus, errorThrown) {
          console.error("changePage: get user_management get_user_list", textStatus, errorThrown);
        }
      });
    };

    // 获取用户总数
    $.ajax({
      url: "https://" + store.getters.IP_PORT + "/api/user_management/get_user_total",
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
        console.error("get user_management get_user_toal", textStatus, errorThrown);
      }
    });

    // 获取第一页的用户列表
    $.ajax({
      url: "https://" + store.getters.IP_PORT + "/api/user_management/get_user_list/" + 1,
      type: "GET",
      data: {

      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        users.value = resp;
      },
      error(textStatus, errorThrown) {
        console.error("get user_management get_user_list", textStatus, errorThrown);
      }
    });

    // 封禁或者解禁用户
    const ban_user = (user_id, index) => {
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/user_management/ban_user/" + user_id,
        type: "POST",
        data: {

        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          users.value[index].is_ban = !users.value[index].is_ban;
          console.log(resp);
        },
        error(textStatus, errorThrown) {
          console.error("get user_management ban_user", textStatus, errorThrown);
        }
      });
    };

    const isValidEmail = ref(true);

    // 判断邮箱格式释放正确
    const validateEmail = () => {
      // 正则表达式验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValidEmail.value = emailRegex.test(update_email.value);
    }

    // 编辑弹窗
    const is_popup = ref(false);
    const update_user_id = ref(0);
    const update_username = ref('');
    const update_email = ref('');
    const update_is_admin = ref('');
    const popup = (index) => {
      update_username.value = users.value[index].username;
      update_email.value = users.value[index].email;
      update_user_id.value = users.value[index].user_id;
      if (users.value[index].is_admin) {
        update_is_admin.value = 'admin';
      } else {
        update_is_admin.value = 'user';
      }

      is_popup.value = !is_popup.value;
    };
    const colse_popup = () => {
      is_popup.value = !is_popup.value;
    };

    const confirm_popup = () => {
      console.log(update_is_admin.value);
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/user_management/update_userinfo",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_id: update_user_id.value,
          username: update_username.value,
          email: update_email.value,
          is_admin: update_is_admin.value == 'admin',
        }),
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success() {
          const index = users.value.findIndex(user => user.user_id === update_user_id.value);
          users.value[index].username = update_username.value;
          users.value[index].email = update_email.value;
          users.value[index].is_admin = update_is_admin.value == 'admin';
          is_popup.value = false;
        },
        error(textStatus, errorThrown) {
          console.error("admin update user info error", textStatus, errorThrown);
        }
      });
    };

    // 搜索
    const search_query = ref('');
    const search_user = () => {
      if (search_query.value.length != 0) {
        $.ajax({
          url: "https://" + store.getters.IP_PORT + "/api/user_management/search/" + search_query.value,
          type: "GET",
          data: {

          },
          dataType: "json",
          headers: {// jwt 验证方式，直接抄就对了
            "Authorization": "Bearer " + store.getters['user/getToken'],
          },
          success(resp) {
            totalPages.value = 1;
            users.value = resp;
          },
          error(textStatus, errorThrown) {
            console.error("with name get user info error", textStatus, errorThrown);
          }
        });
      } else {
        changePage(currentPage.value);
      }
    };

    return {
      is_admin,
      currentPage,
      totalPages,
      changePage,
      users,
      ban_user,
      user_id,
      isValidEmail,
      validateEmail,
      is_popup,
      colse_popup,
      update_username,
      update_email,
      update_is_admin,
      popup,
      confirm_popup,
      search_query,
      search_user,
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
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
</style>