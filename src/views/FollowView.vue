<template>
  <MyFeatured v-if="totalPosts > 0" :posts="posts" :title="title" />
  <MyFeatured v-else :posts="posts" title="无关注的帖子" />
  <!-- <div v-else class="span6 container" style="background-color: #FF5916; border-radius: 5px;" data-aos="fade-up">
    <div class="alert">
      <button type="button" class="close" data-dismiss="alert" @click="colse_delete_error">×</button>
      <h3 style="color: white;text-align: center;">
        没有关注的用户
      </h3>
    </div>
  </div> -->

  <!-- 分页组件 -->
  <MyPagination class="my-nav" :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage($event)">
  </MyPagination>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';

import MyFeatured from '@/components/BrowsBloglist/MyFeatured.vue';
import MyPagination from '@/components/MyPagination.vue';

export default {
  name: "FollowView",
  components: {
    MyFeatured,
    MyPagination,
  },
  data() {
    return {
      title: "Follow",
    }
  },
  methods: {
  },
  setup() {
    const store = useStore();
    // console.log("token", store.getters['user/getToken']);
    const router = useRouter();

    // 初始化用户数据
    // store.dispatch("user/initializeData");

    const user_id = ref(null);
    
    console.log(user_id.value);
    // 划到顶部
    const changePage = (page) => {
      store.dispatch('follow/updateCurrentPage', { user_id: user_id.value, page }).then(() => {
        router.push({
          name: 'follow', // 你的组件的路由名称
          query: { user_id: user_id.value, page: page },
        });
      });
    }


    // 调用 follw 中的数据进行初始化
    if (store.getters['follow/getCurrentPage'] === undefined 
      || store.getters['follow/getCurrentPage'] === -1) {
      store.dispatch("follow/initializeData", user_id.value);
      router.push({
        name: 'follow', // 你的组件的路由名称
        query: { user_id: user_id.value, page: 1 },
      });
    }

    const posts = computed(() => {
      return store.getters['follow/getPosts'];
    });
    const currentPage = computed(() => {
      return store.getters['follow/getCurrentPage'];
    });
    const totalPages = computed(() => {
      return store.getters['follow/getTotalPages'];
    });
    const totalPosts = computed(() => {
      return store.getters['follow/getTotalPosts'];
    });

    watch (() => store.getters['user/getUserId'], (newUserId) => {
      user_id.value = newUserId;
      store.dispatch("follow/initializeData", user_id.value);
    });

    // watch(() => store.getters['follow/getTotalPosts'], (newTotalPosts => {
    //   posts.value = store.getters['follow/getPosts'];
    //   currentPage.value = store.getters['follow/getCurrentPage'];
    //   totalPages.value = store.getters['follow/getTotalPages'];
    //   totalPosts.value = newTotalPosts;
    // }));

    return {
      changePage,
      posts,
      currentPage,
      totalPages,
      totalPosts,
    }
  }
};
</script>

<style scoped>
.my-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  /* background-color: #f8f9fa; 可以根据需要设置底部导航的背景颜色 */
  padding: 10px;
}
</style>



<!-- FollowView -->