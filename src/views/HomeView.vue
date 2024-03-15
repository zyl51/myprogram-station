<template>
  <!-- Start 首页导航 -->
  <div class="jumbotron jumbotron-lg jumbotron-fluid mb-0 pb-3 bg-primary position-relative">
    <div class="container-fluid text-white h-100">
      <div class="d-lg-flex align-items-center justify-content-between text-center pl-lg-5">
        <div class="col pt-4 pb-4">
          <h1 class="display-4" style="font-weight: 900;">
            Welcome to<br>
            the<br>
            <strong class="title-gradient">Program Station</strong>
          </h1>
          <h5 class="font-weight-light mb-4" style="font-weight: 900 !important;">
            With this FREE Bootstrap 5.3.2
            <strong> UI Kit</strong>
          </h5>
          <!-- 从首页点击推荐页面时的页数 -->
          <router-link class="btn btn-lg btn-outline-white btn-round" :to="{ name: 'recommend', params: {page: '1'} }">
            <i class="fab fa-telegram mr-2"></i>
            Start
          </router-link>
        </div>
        <div class="col align-self-bottom align-items-right text-right h-max-380 position-relative z-index-1">
          <img src="../assets/img/demo/dashb.png" class="rounded img-fluid">
        </div>
      </div>
    </div>
  </div>

  <svg viewBox="0 0 1440 176" class="bg-primary">
    <path style="transform: translateY(100px);"
      d="M685.6 38.8 C418.7-11.1 170.2 9.9 0 30 v96 h1440 V30 C1252.7 52.2 1010 99.4 685.6 38.8z" fill="white"
      stroke="white" />
  </svg>
  <!-- End 首页导航 -->


  <!-- Start 结尾的属性 -->
  <div class="container pt-5 pb-5 mt-4" data-aos="fade-up">
    <div class="row gap-y">
      <div class="col-md-6 col-xl-4">
        <div class="media">
          <div class="iconbox iconmedium rounded-circle text-info mr-4">
            <i class="fab fa-rust"></i>
          </div>
          <div class="media-body">
            <h5>Rust</h5>
            <p class="text-muted">
              <!-- The backend language of this project uses Rust. -->
              编程驿站的后端使用 Rust 和 Actix-web 框架.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-4">
        <div class="media">
          <div class="iconbox iconmedium rounded-circle text-purple mr-4">
            <i class="fab fa-vuejs"></i>
          </div>
          <div class="media-body">
            <h5>Vue3</h5>
            <p class="text-muted">
              <!-- The front-end framework of this project uses Vue3.js -->
              编程驿站的前端使用的 vue3 框架.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-4">
        <div class="media">
          <div class="iconbox iconmedium rounded-circle text-info mr-4">
            <i class="fab fa-bootstrap"></i>
          </div>
          <div class="media-body">
            <h5>Bootstrap 5.3.2</h5>
            <p class="text-muted">
              <!-- The front-end UI uses free Bootstrap. -->
              前端 UI 使用的是免费的 Bootstrap.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-4">
        <div class="media">
          <div class="iconbox iconmedium rounded-circle text-warning mr-4">
            <i class="fab fa-html5"></i>
          </div>
          <div class="media-body">
            <h5>Responsive</h5>
            <p class="text-muted">
              编程驿站响应式的适用于：电脑、平板或手机.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-xl-4">
        <div class="media">
          <div class="iconbox iconmedium rounded-circle text-info mr-4">
            <i class="fab fa-gulp"></i>
          </div>
          <div class="media-body">
            <h5>Website Features</h5>
            <p class="text-muted">
              您可以阅读、编辑和编写自己的帖子，或者更改所有内容.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-xl-4">
        <div class="media">
          <div class="iconbox iconmedium rounded-circle text-salmon mr-4">
            <i class="fab fa-markdown"></i>
          </div>
          <div class="media-body">
            <h5>Markdown</h5>
            <p class="text-muted">
              编程驿站的帖子支持使用 markdown 语法
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End 结尾的属性 -->
</template>

<script>

export default {
  name: 'HomeView',
  components: {
  }
}
</script>

<style scoped>
.title-gradient {
  background: linear-gradient(to right, #00ff62, #0091ff);
  background-clip: text;
  color: transparent;
}
</style>
