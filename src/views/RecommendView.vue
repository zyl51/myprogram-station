<template>
  <!-- 显示帖子列表的组件 -->
  <MyFeatured :posts="posts" :title="title" />

  <!-- 分页组件 -->
  <!--     :current-page="currentPage"
    :total-pages="totalPages" -->
  <MyPagination class="my-nav"
    @page-change="handlePageChange"
  ></MyPagination>
</template>

<script>
import { ref, watchEffect, computed } from 'vue';
import $ from 'jquery';
import { useRoute, useRouter } from 'vue-router';

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
    }
  },
  methods: {
  },
  setup() {
    const posts = ref([]);
    const route = useRoute();
    const router = useRouter();
    // let { currentPage = ref(1) } = toRefs(route.params);
    const currentPage = ref(Number(route.params.page) || 1); // 初始化为路由参数或默认为1
    
    const handlePageChange = (newPage) => {
      currentPage.value = newPage;

      // 解构出路由对象
      // const { $router } = context.root;
      // 使用router.push修改路由
      router.push({
        name: 'recommend', // 你的组件的路由名称
        params: { page: newPage },
      });
    };

    // 它会立即运行，并在每次依赖项改.变时重新运行。
    // watchEffect 中的所有响应式值都会成为其“响应式依赖”。
    // 这意味着，只要 watchEffect 内部的任何响应式值发生变化，它就会重新运行。
    watchEffect(() => {
      // console.log("watchEffect");
      // 通过 ajax 获取后端的一个 post 列，page 表示想获取第几页
      $.ajax({
        url: "http://localhost:8082/api/recommend/postlist/" + currentPage.value,
        type: "GET",
        data: {
          
        },
        dataType: "json",
        success (resp) {
          posts.value = resp;
          // console.log(posts.value);
        },
        error(textStatus, errorThrown) {
          console.error("get recommend postlist: ", textStatus, errorThrown);
        }
      });
    });

    // ************************************************************
    // 帖子的总数量和计算出来的总页数， 
    const totalNumbers = ref(0);
    // computed用于动态计算，主要是用于响应式数据的计算，Math.ceil 用于向上取整
    const totalPages = computed(() => Math.ceil(totalNumbers.value / 10));
    // 通过 ajax 获取页面总数量
    $.ajax({
      url: "http://localhost:8082/api/recommend/totalnumbers",
      type: "GET",
      data: {

      },
      dataType: "json",
      success(resp) {
        totalNumbers.value = resp.number;
        // console.log(totalNumbers);
      },
      error(textStatus, errorThrown) {
        console.error("get recommend total numbers ", textStatus, errorThrown);
      }
    });

    return {
      posts,  // 帖子列表
      totalNumbers, // 帖子的总数量
      currentPage,  // 当前页面
      totalPages, // 页数
      handlePageChange,
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