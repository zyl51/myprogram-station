<template>
  <!-- 显示帖子列表的组件 -->
  <!-- <MyFeatured :posts="posts" :title="title" /> -->

  <section class="pt-5 pb-5" data-aos="fade-down" style="margin-top: 50px;">
    <div class="container">

      <!-- Featured -->
      <div class="row gap-y">
        <div v-for="(post, index) in posts" :key="post.id" class="col-lg-6">
          <div class="card flex-md-row mb-4 box-shadow h-xl-300 post-hover">
            <!-- <img v-if="index % 2 == 0" class="card-img-right flex-auto d-none d-md-block" :src="post.cover_url"> -->
            <div class="card-body d-flex flex-column align-items-start">
              <strong v-if="index % 2 == 0" class="d-inline-block mb-2 text-purple">{{ post.user_name
                }}</strong>
              <strong v-if="index % 2 == 1" class="d-inline-block mb-2 text-success">{{ post.user_name
                }}</strong>
              <h3 class="mb-0">
                <router-link class="text-dark" :to="{ name: 'blog', params: { postId: post.id } }">
                  {{ post.title }}
                </router-link>
              </h3>
              <div class="mb-2 text-muted inline-block-class">
                发布时间：{{ post.release_time }}
              </div>
              <!-- <router-link class="card-text mb-auto posts" :to="{name: 'blog'}">
                  <VMarkdownView class="card-text mb-auto posts vmarkdown" :content="post.content"/>
                </router-link> -->
              <VMarkdownView class="card-text mb-auto posts vmarkdown" :content="post.content"
                style="font-size: 17px;" />
              <router-link class="text-gray" :to="{ name: 'blog', params: { postId: post.id } }">
                Continue reading
              </router-link>
              <!-- <a class="text-gray" href="http://localhost:8080/blog">Continue reading</a> -->
            </div>
            <img class="card-img-right flex-auto d-none d-md-block" :src="post.cover_url">
          </div>
        </div>
      </div>
      <!-- End Featured -->

      <div class="row gap-y">
        <div v-for="(post) in posts" :key="post.id" class="col-md-6 col-lg-4">
          <div class="card">
            <img class="img-card-top" :src="post.cover_url">
            <div class="card-body">
              <a href="#">
                <h5 class="card-title text-dark">{{ post.title  }}</h5>
                <span class="card-text text-muted">{{ post.release_time }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>

  </section>
  <div class="container">
    <div class="row gap-y">

      <div class="col-md-6 col-lg-4">
        <div class="card">
          <img class="img-card-top" src="../assets/img/demo/blog3.jpg">
          <div class="card-body">
            <a href="#">
              <h5 class="card-title text-dark">10 Steps for a Successful Business without Investing Money</h5>
              <span class="card-text text-muted">
                Posted on May 24, 2019 by Dalida </span>
            </a>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card">
          <img class="img-card-top" src="../assets/img/demo/blog4.jpg">
          <div class="card-body">
            <a href="#">
              <h5 class="card-title text-dark">Happy wife is happy life says life experts</h5>
              <span class="card-text text-muted">
                Posted on May 24, 2019 by Sandra </span>
            </a>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <img class="img-card-top" src="../assets/img/demo/blog5.jpg">
          <div class="card-body">
            <a href="#">
              <h5 class="card-title text-dark">Pack your bags and see the world today</h5>
              <span class="card-text text-muted">
                Posted on May 24, 2019 by Mike </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 分页组件 -->
  <MyPagination class="my-nav" :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage($event)">
  </MyPagination>
</template>

<script>
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';

import { computed, ref, reactive, onMounted } from 'vue'; // 更改引入的 Vue 相关模块

import { useStore } from 'vuex';
import $ from 'jquery';

import MyPagination from '@/components/MyPagination.vue';

export default {
  name: "SearchView",
  components: {
    VMarkdownView,
    MyPagination,
  },
  setup() {
    const store = useStore();

    const searchQuery = computed(() => {
      return store.getters['search/getSearchQuery'];
    });

    const currentPage = ref(1);
    const totalPages = ref(1);
    const posts = reactive([]);

    const changePage = (page) => {
      console.log("page: {}", page);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    onMounted(() => {
      $.ajax({
        url: "https://localhost:8082/api/search",
        type: "GET",
        data: {
          search_query: searchQuery.value, // 获取计算属性的值
          page: 1,
        },
        dataType: "json",
        success(resp) {
          // console.log(resp);
          posts.length = 0;
          posts.push(...resp);
        },
        error(textStatus, errorThrown) {
          console.error("get search: ", textStatus, errorThrown);
        }
      });
    });

    return {
      changePage,
      posts,
      currentPage,
      totalPages,
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

/* 可以在这里添加样式，例如填充颜色等 */

.card-body {
  overflow: hidden;
  /* 隐藏溢出的内容 */
}

.title-gradient {
  background: linear-gradient(to right, #00ff62, #0091ff);
  background-clip: text;
  color: transparent;
  font-weight: 900;
}

.posts {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.inline-block-class {
  display: inline-block;
}

.post-hover:hover {
  box-shadow: 2px 2px 10px 4px rgb(203, 203, 203);
  /* text-shadow: 10px 10px 10px 10px black; */
  transform: scale(1.005);
  transition: 100ms;
}

.vmarkdown {
  box-sizing: border-box;
  width: 100%;
  /* 设置宽度为 100% */
  height: auto;
  /* 设置高度自动，保持原始的长宽比 */
  padding: 0px 0px 0px 10px;
}
</style>



<!-- RecommendView -->