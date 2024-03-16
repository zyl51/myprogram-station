<template>
  <!-- 显示帖子列表的组件 -->
  <MyFeatured :posts="posts" :title="title" />

  <!-- 分页组件 -->
  <MyPagination class="my-nav"
    @scrollToTop="scrollToTop($event)"
  ></MyPagination>
</template>

<script>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';

import MyFeatured from '@/components/BrowsBlogs/MyFeatured.vue';
import MyPagination from '@/components/MyPagination.vue';


export default {
  name: "RecommendView",
  components: {
    MyFeatured, // 显示帖子列表的组件
    MyPagination, // 分页的按钮
  },
  data() {
    return {
      title: "Recommend",
      router: useRouter(),
    }
  },
  methods: {
    // 划到顶部
    scrollToTop(page) {
      this.router.push({
        name: 'recommend', // 你的组件的路由名称
        params: { page: page },
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth" // 平滑滚动到顶部
      });
      
      // console.log("scrollToTop");
    }
  },
  setup() {
    
    // const router = useRouter();
    // const handlePageChange = (newPage) => {
    //   router.push({
    //     name: 'recommend', // 你的组件的路由名称
    //     params: { page: newPage },
    //   });
    // };

    const store = useStore();
    // 初始化数据
    if (store.getters.getCurrentPage === undefined || store.getters.getCurrentPage === -1) {
      store.dispatch("initializeData");
    }
    const posts = computed(() => {
      return store.getters.getPosts;
    });

    return {
      posts,
    }
  },
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



<!-- RecommendView -->