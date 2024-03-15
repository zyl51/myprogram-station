<template>
  <MyFeatured :posts="posts" :title="title" />

  <MyPagination class="my-nav"
    :current-page="currentPage"
    :total-pages="totalPages"
    @page-change="handlePageChange"
  ></MyPagination>
</template>

<script>
import { ref } from 'vue';
import $ from 'jquery';
import { useRoute } from 'vue-router';

import MyFeatured from '@/components/BrowsBlogs/MyFeatured.vue';
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
      currentPage: 1,
      totalPages: 10,
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
  setup() {
    const posts = ref([]);
    const route = useRoute();
    const user_id = route.query.user_id;
    const page = route.query.page;

    // 通过 ajax 获取后端的一个关注 post 列表
    $.ajax({
      url: "http://localhost:8082/api/follow/postlist",
      type: "GET",
      data: {
        user_id: user_id,
        page: page,
      },
      dataType: "json",
      success (resp) {
        posts.value = resp;
        console.log(posts.value);
      }
    });

    return {
      posts,
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



<!-- RecommendView -->