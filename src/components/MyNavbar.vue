<template>
  <nav class="topnav navbar navbar-expand-lg navbar-dark bg-primary fixed-top py-0"
    :class="{ 'bg-white': scrolled, 'navbar-light': scrolled, 'shadow-sm': scrolled }">
    <div class="container-fluid">
      <a class="navbar-brand" href="https://v5.bootcss.com/">
        <i class="fas fa-star-and-crescent"></i>
        <strong>
          Program Station
        </strong>
      </a>

      <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02"
        aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse collapse" id="navbarColor02" style="">
        <ul class="navbar-nav mr-auto d-flex align-items-center me-auto">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ 'router-link-active-scrolled': scrolled }"
              :to="{ name: 'home' }">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ 'router-link-active-scrolled': scrolled }"
              :to="{ name: 'recommend', params: { page: currentPage } }">推荐</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ 'router-link-active-scrolled': scrolled }"
              :to="{ name: 'follow', query: { user_id: user_id, page: page } }">关注</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link" :class="{ 'router-link-active-scrolled': scrolled }"
              :to="{ name: 'blog' }">blog</router-link>
          </li> -->
        </ul>

        <div v-if="isShowSearchPopup" @click="hideSearchPopup" class="overlay"></div>
        <!-- 通过变量 SearchPopupRef 调用子组件 SearchPopup.focusInput 的函数 -->
        <SearchPopup ref="SearchPopupRef" v-if="isShowSearchPopup" />


        <ul class="navbar-nav ml-auto d-flex align-items-center">
          <li>
            <!-- 搜索框 -->
            <form class="navbar-brand" role="search" id="searchFrom">
              <input @click="showSearchPopup" class="form-control me-2" id="searchInput" type="search" placeholder="搜索"
                aria-label="Search">
            </form>
          </li>
          <li class="nav-item">
            <!-- 搜索按钮 -->
            <div class="nav-link search-button" :class="{ 'router-link-active-scrolled': scrolled }" id="searchButton"
              @click="showSearchPopup">搜索</div>
          </li>
          <li class="nav-item">
            <router-link class="nav-link login" :class="{ 'router-link-active-scrolled': scrolled }"
              :to="{ name: 'login' }">登录</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link register" style="margin-right: 14px;" :class="{ 'router-link-active-scrolled': scrolled }"
              :to="{ name: 'register' }">注册</router-link>
          </li>
          <!-- 发布按钮 -->
          <li class="nav-item">
            <router-link class="btn btn-info btn-round btn-plus" :class="{ 'router-link-active-scrolled': scrolled }"
              :to="{ name: 'editor' }">
              <i class="fas fa-plus"></i>
              发帖
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, onMounted, onUnmounted } from 'vue';

import SearchPopup from '@/components/MyNavbarComponents/SearchPopup.vue';

export default {
  name: "MyNavbar",
  components: {
    SearchPopup
  },
  data() {
    // data 用于定义所需要使用到的数据 
    return {
      isShowSearchPopup: false,
    }
  },
  methods: {
    // 定义函数，methods 可以使用 this
    // 可以展示显示组件 SearchPopup
    showSearchPopup() {
      this.isShowSearchPopup = true;
      // 修改聚焦到组件 SearchPopup 上
      this.$nextTick(() => {
        this.$refs.SearchPopupRef.focusInput();
      });
    },
    // 隐藏组件 SearchPopup
    hideSearchPopup() {
      this.isShowSearchPopup = false;
    },
  },
  setup() {
    const scrolled = ref(false);

    const handleScroll = () => {
      scrolled.value = window.scrollY > 50;
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    // 获取当前页数
    const store = useStore();
    const currentPage = computed(() => {
      return store.getters['recommend/getCurrentPage'];
    });

    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });

    const page = computed(() => {
      return store.getters['follow/getCurrentPage'];
    });

    return { 
      scrolled,
      currentPage,
      user_id,
      page,
    };
  },
}
</script>


<style scoped>
/* router-link 被点击自动生成的 */
.router-link-active {
  color: white !important;
  transform: scale(1.2);
  transition: 100;
}


.router-link-active-scrolled {
  color: black !important;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: transparent; */
  background-color: #d1cfcfb3;
  z-index: 999;
  /* 使遮罩在其他内容上方 */
}

#searchFrom {
  padding-top: 0%;
  padding-bottom: 0%;
}

#searchInput {
  width: 220px;
  height: 35px;
}

#searchInput::placeholder {
  font-size: 16px;
}

#searchButton {
  display: none;
}

.btn-plus {
  font-size: 16px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 4px 24px 4px 24px;
  transform: scale(1.0);
}

@media(max-width: 991px) {
  #searchFrom {
    display: none;
  }

  #searchButton {
    display: block;
  }
}
</style>
