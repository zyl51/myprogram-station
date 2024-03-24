<template>
  <MyFeatured :posts="posts" :title="title" />

  <!-- 分页组件 -->
  <MyPagination class="my-nav"
    :currentPage="currentPage"
    :totalPages="totalPages"
    @changePage="changePage($event)"
  ></MyPagination>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

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
    const router = useRouter();

    // 初始化用户数据
    store.dispatch("user/initializeData");

    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });
    // console.log(user_id.value);
    // 划到顶部
    const changePage = (page) => {
      store.dispatch('follow/updateCurrentPage', { user_id:user_id.value, page });
      router.push({
        name: 'follow', // 你的组件的路由名称
        query: { user_id: user_id.value, page: page },
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth" // 平滑滚动到顶部
      });
    }

    // 初始化数据
    if (store.getters['follow/getCurrentPage'] === undefined || store.getters['follow/getCurrentPage'] === -1) {
      // 调用 follw 中的数据进行初始化
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

    return {
      changePage,
      posts,
      currentPage,
      totalPages,
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