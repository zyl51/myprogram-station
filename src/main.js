import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import AOS from 'aos';
import 'aos/dist/aos.css';

// 初始化 AOS
AOS.init({
  duration: 700,
  disable: function () {
    var maxWidth = 1200;
    return window.innerWidth < maxWidth;
  }
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  // setTimeout(() => {
  //   next(); // 跳转到下一个路由
  // }, 0); // 设置一个适当的延迟时间, 100ms 之后
  next();
});

// 从本地存储中获取 token 数据
const userToken = localStorage.getItem('token');
store.dispatch('user/updateToken', userToken).then(() => {
  createApp(App).use(store).use(router).mount('#app')
});
