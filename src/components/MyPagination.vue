<template>
  <nav aria-label="Page navigation">

    <ul class="pagination">
      <!-- 向左的按钮，当页数等于 1 的时候不能点击 -->
      <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
        <a class="page-link" @click="changePage(currentPage - 1)" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- 总数量小于等于 7 页的时候 -->
      <div v-if="totalPages <= 7">
        <li v-for="pageNumber in totalPages" :key="pageNumber" class="page-item"
          :class="{ 'active': pageNumber === currentPage }">
          <a class="page-link" @click="changePage(pageNumber)">{{ pageNumber }}</a>
        </li>
      </div>

      <!-- 总数量大于 7 并且当前页数小于 3 的时候 -->
      <div v-else-if="totalPages > 7 && currentPage <= 3">
        <!-- 显示 1 到 5 的数据 -->
        <li v-for="pageNumber in 5" :key="pageNumber" class="page-item"
          :class="{ 'active': pageNumber === currentPage }">
          <a class="page-link" @click="changePage(pageNumber)">{{ pageNumber }}</a>
        </li>
        <!-- 省略号 -->
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
        <!-- 显示最后一个页码 -->
        <li class="page-item">
          <a class="page-link" @click="changePage(totalPages)">{{ totalPages }}</a>
        </li>
      </div>
      
      <!-- 总数量大于 7 并且当前页数在最后 3 个的时候 -->
      <div v-else-if="totalPages > 7 && currentPage >= totalPages - 2">
        <!-- 显示第一个页码 -->
        <li class="page-item">
          <a class="page-link" @click="changePage(1)"> 1 </a>
        </li>
        <!-- 省略号 -->
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
        <!-- 显示 1 到 5 的数据 -->
        <li v-for="pageNumber in range(totalPages - 4, totalPages)" :key="pageNumber" class="page-item"
          :class="{ 'active': pageNumber === currentPage }">
          <a class="page-link" @click="changePage(pageNumber)">{{ pageNumber }}</a>
        </li>
      </div>

      <!-- 当前页数在中间的时候 -->
      <div v-else>
        <!-- 显示第一个页码 -->
        <li class="page-item">
          <a class="page-link" @click="changePage(1)"> 1 </a>
        </li>
        <!-- 省略号 -->
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>

        <!-- 输出中间的三个页码 -->
        <li  class="page-item">
          <a class="page-link" @click="changePage(currentPage - 1)">{{ currentPage - 1 }}</a>
        </li>
        <li  class="page-item active">
          <a class="page-link" @click="changePage(currentPage)" >
            {{ currentPage }}</a>
        </li>
        <li  class="page-item">
          <a class="page-link" @click="changePage(currentPage + 1)">{{ currentPage + 1 }}</a>
        </li>

        <!-- 省略号 -->
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
        <!-- 显示最后一个页码 -->
        <li class="page-item">
          <a class="page-link" @click="changePage(totalPages)">{{ totalPages }}</a>
        </li>
      </div>

      <!-- 向右的按钮，当页数等于总页数的时候不能点击 -->
      <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
        <a class="page-link" @click="changePage(currentPage + 1)" aria-label="Previous">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "MyPagination",
  props: {
  },
  methods: {
  },
  setup(props, context) {
    const store = useStore();
    const currentPage = computed(() => {0
      return store.getters.getCurrentPage;
      // return store.getters['MoudleRecpmmend/getCurrentPage'];
    });
    const totalPages = computed(() => {
      return store.getters.getTotalPages;
    });

    // 切换页数的函数
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        store.dispatch('updateCurrentPage', { page });
        // console.log("changePage");
        context.emit("scrollToTop", page);
      }
    }

    // 返回一个 strat ~ end 的数组
    const range = (start, end) => {
      return Array.from({ length: end - start + 1 }, (v, k) => k + start);
    }

    return {
      currentPage,
      totalPages,
      changePage,
      range,
    }
  }
};
</script>

<style scoped>
.page-item {
  display: inline-block;
  margin-right: 2px;
  /* 可以根据需要调整间距 */
  font-size: 0.1rem;
}

@media (max-width: 767px) {
  .page-link {
    /* 在这里设置你希望在小屏幕上应用的样式，例如降低字体大小 */
    /* font-size: 0.1rem; */
    padding: 0.3rem 0.5rem;
  }
}
</style>
