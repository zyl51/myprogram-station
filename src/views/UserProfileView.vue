<template>
  <div style="height: 100%;">
    <div class="container" style="padding-top: 3.5rem;">
      <div class="row">
        <!-- 用户的头像，名字，粉丝数等等 -->
        <div class="col-3">
          <div class="card" data-aos="fade-right">
            <div class="card-body" style="padding: 0.7rem;">
              <a :href="user.avatar_url" target="_blank">
                <img :src="user.avatar_url" style="width: 100%;" class="img-fluid" alt="头像">
              </a>
              <hr>
              <div style="font-weight: 800;text-align: center;font-size: 1rem;">{{ user.name }}</div>
              <hr>
              <!--  -->
              <div class="row">
                <div class="col-6 follow-fans" style="text-align: center;">关注数</div>
                <div class="col-6 follow-fans" style="text-align: center;">粉丝数</div>
              </div>
              <div class="row">
                <div class="col-6" style="text-align: center;font-weight: 400;">{{ user.follower_count }}</div>
                <div class="col-6" style="text-align: center;font-weight: 400;">{{ user.fans }}</div>
              </div>
              <div v-if="!is_me" style="text-align: center;">
                <router-link v-if="!is_login" class="follow-button btn-primary col-4"
                 :to="{name: 'login'}">
                 +关注
                </router-link>
                <button v-else-if="!is_follow" @click="follow(1)" type="button"
                  class="follow-button btn-primary col-4">+关注</button>
                <button v-else @click="follow(-1)" type="button" class="follow-button btn-primary col-6">取消关注</button>
              </div>

            </div>
          </div>
        </div>

        <div class="col-9">
          <div class="card">
            <div class="card-body">
              <ul class="nav nav-tabs">
                <div v-for="(item, index) in tabs" :key="index">
                  <li v-if="item.name == '文章' || is_me" class="nav-item" style="font-weight: 900;">
                    <a class="nav-link" style="color: #502C6C;" :class="{ 'active': currentTab === item.component }"
                      @click="currentTab = item.component" href="#">
                      {{ item.name }}
                      <span v-if="item.name == '消息' && message_total != 0" class="badge badge-warning ml-2">
                        {{ message_total }}
                      </span>
                    </a>
                  </li>
                </div>
              </ul>

              <component :is="currentTab" :user_id="user_id" @delete_message="delete_message"></component>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
// import { ref } from 'vue';
import UserProfilePosts from '@/components/UserProfile/UserProfilePosts.vue';
import UserProfileMessages from '@/components/UserProfile/UserProfileMessages.vue';
import UserProfileCollects from '@/components/UserProfile/UserProfileCollects.vue';

import { computed, reactive, ref, watch  } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import $ from 'jquery';

export default {
  name: "UserProfileView",
  components: {
    UserProfilePosts,
    UserProfileMessages,
    UserProfileCollects,
  },
  data() {
    return {
      currentTab: UserProfilePosts,
      tabs: [
        { name: '文章', component: UserProfilePosts },
        { name: '消息', component: UserProfileMessages },
        { name: '收藏', component: UserProfileCollects },
      ]
    }
  },
  methods: {
  },
  setup() {
    const ajax_follow_relationships = () => {
      $.ajax({
        url: "https://localhost:8082/api/follow/relationships",
        type: "GET",
        data: {
          follower_id: user_profile_id.value,
          following_id: user_id
        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          // console.log(user_id, user_profile_id.value);
          is_follow.value = resp;
          console.log("is_follow：", resp, is_follow.value);
        },
        error(textStatus, errorThrown) {
          // console.log(store.getters['user/getToken']);
          console.error("get user follow relationships", textStatus, errorThrown);
        }
      });
    };

    const route = useRoute();
    const store = useStore();

    // console.log("toekn is: ", token.value);
    const user_id = parseInt(route.params.user_id);
    const user_profile_id = ref(null);
    // const user_profile_id = computed(() => {
    //   return store.getters['user/getUserId'];
    // });
    const is_me = ref(false);
    watch(() => store.getters['user/getUserId'], (newUserId) => {
        user_profile_id.value = newUserId;
        is_me.value = user_id === user_profile_id.value;
        ajax_follow_relationships();
      },
      { immediate: true } // 立即执行一次
    );
    // 是不是自己
    // 数值匹配就可以了
    // const is_me = ref(user_id === user_profile_id.value);
    console.log("user_id: ", user_id, "user_profile_id: ", user_profile_id.value);
    // console.log("is_me: ", is_me);
    const user = reactive({});

    // 更新用户的数据
    $.ajax({
      url: "https://localhost:8082/api/userprofile/user/" + user_id,
      type: "GET",
      data: {

      },
      dataType: "json",
      success(resp) {
        user.id = resp.id;
        user.name = resp.name;
        user.avatar_url = resp.avatar_url;
        user.follower_count = resp.follower_count;
        user.fans = resp.fans;

        // console.log(user.avatar_url);
      },
      error(textStatus, errorThrown) {
        console.error("get user profile user info", textStatus, errorThrown);
      }
    });

    // 看看是否已经关注  
    const is_follow = ref(true);
    

    ajax_follow_relationships();
    

    // 关注函数
    const follow = (count) => {
      console.log("count", count, 1 === count);
      $.ajax({
        url: "https://localhost:8082/api/user_stats/addremove",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          follower_id: user_profile_id.value,
          following_id: user_id,
          count: count,
        }),
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        dataType: "json",
        success(resp) {
          is_follow.value = !is_follow.value;
          user.fans = user.fans + count;
          store.dispatch("follow/initializeData", user_id);
          console.log(resp);
        },
        error(textStatus, errorThrown) {
          console.error("get add or remove follow", textStatus, errorThrown);
        }
      });
    };

    const message_total = ref(0);
    $.ajax({
      url: "https://" + store.getters.IP_PORT + "/api/userprofile/message_total/" + user_id,
      type: "GET",
      data: {

      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        console.log("成功：", resp)
        message_total.value = resp;
      },
      error(textStatus, errorThrown) {
        console.error("get message", textStatus, errorThrown);
      }
    });

    const delete_message = () => {
      message_total.value = message_total.value - 1;
      // console.log("111");
    };

    const is_login = computed(() => {
      return store.getters['user/getIsLogin'];
    });

    return {
      user_id,
      is_me,
      user,
      is_follow,
      follow,
      message_total,
      delete_message,
      is_login,
    }
  }
}
</script>


<style scoped>
hr {
  border-color: rgb(127, 127, 127);
}

.follow-fans {
  text-overflow: clip;
  overflow: hidden;
  /* white-space: nowrap; */
  font-size: 13px;
  color: gray;
}

.follow-button {
  border-radius: 5px;
}
</style>