<template>
  <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/favicon.ico">
  <link rel="icon" type="image/png" href="./assets/img/favicon.ico">

  <title>Bootstrap</title>

  <!-- Google Font -->
  <link href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,600,800" rel="stylesheet">

  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
    integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">

  <link href="https://kit-free.fontawesome.com/releases/latest/css/free.min.css" rel="stylesheet">

  <!-- 导航栏 -->
  <div>
    <MyNavbar />
    <!-- :key="$route.fullPath" 表示根据完整路径跳转 -->
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.min.js';
// <!-- Main CSS -->
import '@/assets/css/main.css';
// <!-- Animation CSS -->
// import AOS from 'aos';
// import 'aos/dist/aos.css';

import MyNavbar from './components/MyNavbar.vue';

export default {
  name: "App",
  components: {
    MyNavbar,
  },
  setup() {
  }
}
</script>

<style scoped>
*[data-aos] {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}
</style>
