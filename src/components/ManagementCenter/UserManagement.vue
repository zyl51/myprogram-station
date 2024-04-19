<template>
  <div class="container" style="margin-top: 1.5rem;">
    <div v-for="(user, index) in users" :key="user.id">
      <!-- vertical-align: top; 头像和用户名在垂直方向上对齐-->
      <div class="inline-block-class" style="margin-right: 10px; vertical-align: top;">
        <img class="user-photo" :src="user.avatar_url" alt="头像">
      </div>
      <div class="inline-block-class" style="vertical-align: top;">
        <div class="inline-block-class">
          <router-link :to="{ name: 'userProfile', params: { user_id: user.user_id } }" href="#"
            class="head-and-name">{{ user.username }}</router-link>
        </div>
        <div style="color: #ADA399; font-size: 8px;">{{ user.register_time }}</div>
      </div>
      <!-- 用户为管理员用户为帖子主人，用户为评论主任 -->
      <button v-if="is_admin && !user.is_ban"
        @click="ban_user(user.user_id, index)" class="btn btn-sm btn-danger ban-button">封禁</button>

      <button v-if="is_admin && user.is_ban"
        @click="ban_user(user.user_id, index)" class="btn btn-sm btn-primary ban-button">解禁</button>
      <hr class="hr-class">
    </div>
  </div>

  <MyPagination v-if="totalPages > 0" class="my-nav" :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage($event)" />
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

    return {
      is_admin,
      currentPage,
      totalPages,
      changePage,
      users,
      ban_user,
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

.my-nav {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  /* background-color: #f8f9fa; 可以根据需要设置底部导航的背景颜色 */
  padding: 10px;
}

.ban-button {
  /* margin-top: 10px; */
  /* margin-left: 2.5rem; */
  /* height: 20%; */
  /* background-color: #DC3545; */
  float: right;
}
</style>