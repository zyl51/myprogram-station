<template>
  <!-- 推荐 -->
  <!------------------------------------------
HEADER
------------------------------------------->
  <div class="jumbotron jumbotron-md jumbotron-fluid mb-12 bg-primary position-relative">
    <div class="container text-white h-100 tofront">
      <div class="row align-items-center justify-content-center text-center">
        <div class="col-md-10">
          <h1 class="display-3">
            <strong class="title-gradient">{{ title }}</strong>
          </h1>
        </div>
      </div>
    </div>
  </div>
  <!-- End Header -->


  <section class="pt-5 pb-5" data-aos="fade-down">
    <div class="container">

      <!-- Featured -->
      <div class="row">
        <div v-for="(post, index) in posts" :key="post.id" class="col-lg-12">
          <div class="card flex-md-row mb-4 box-shadow h-xl-400 post-hover">
            <img v-if="index % 2 == 0" class="card-img-right flex-auto d-none d-md-block" :src="post.cover_url">
            <div class="card-body d-flex flex-column align-items-start">
              <strong v-if="index % 2 == 0" class="d-inline-block mb-2 text-purple">{{ post.user_name }}</strong>
              <strong v-if="index % 2 == 1" class="d-inline-block mb-2 text-success">{{ post.user_name }}</strong>
              <h3 class="mb-0">
                <router-link class="text-dark" :to="{name: 'blog', params: {postId: post.id}}">
                  {{ post.title }}
                </router-link>
              </h3>
              <div class="mb-2 text-muted inline-block-class">
                发布时间：{{ post.release_time }}
              </div>
                <!-- <router-link class="card-text mb-auto posts" :to="{name: 'blog'}">
                  <VMarkdownView class="card-text mb-auto posts vmarkdown" :content="post.content"/>
                </router-link> -->
              <VMarkdownView class="card-text mb-auto posts vmarkdown" :content="post.content"/>
              <router-link class="text-gray" :to="{name: 'blog', params: {postId: post.id}}">
                Continue reading
              </router-link>
              <!-- <a class="text-gray" href="http://localhost:8080/blog">Continue reading</a> -->
            </div>
            <img v-if="index % 2 == 1" class="card-img-right flex-auto d-none d-md-block" :src="post.cover_url">
          </div>
        </div>
      </div>
      <!-- End Featured -->
    </div>

    
  </section>
</template>

<script>
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';

export default {
  name: "MyFeatured",
  components: {
    VMarkdownView,
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      
    }
  }
};
</script>
  
<style scoped>
/* 可以在这里添加样式，例如填充颜色等 */

.card-body {
  overflow: hidden;  /* 隐藏溢出的内容 */
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
  width: 100%;  /* 设置宽度为 100% */
  height: auto; /* 设置高度自动，保持原始的长宽比 */
  padding: 0px 0px 0px 10px;
}

</style>
  
  
  
  <!-- RecommendView -->