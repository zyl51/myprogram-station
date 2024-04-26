<template>
  <div class="container" id="searchPopup" data-aos="zoom-out">
    <div class="card">
      <div class="card-body">
        <!-- @submit 是 Vue.js 的事件监听简写，用于监听表单的提交事件 -->
        <!-- .prevent 是事件修饰符，用于阻止事件的默认行为，执行 submitSearch 方法 -->
        <form class="row" role="search" id="searchForm" @submit.prevent="submitSearch">
          <!-- 这里的 ref 是一个变量，通过父类调用 focusInput 函数修改这个 ref 使他的变量使他聚焦 -->
          <!-- v-model="searchQuery" 这个v-model 用于将 html 的元素和 vue 变量双向绑定 -->
          <!-- 指定搜索框类型为 type = "search" 这个是指定类型，浏览器会有对应的行为 -->
          <input ref="input" v-model="searchQuery" id="searchInput" class="form-control" type="search"
            placeholder="搜索"  />
          <!-- type="submit" -->
          <button id="searchButton" class="btn btn-primary" type="submit" >
            搜索
          </button>
        </form>
        <ul class="list-group row">
          <li class="list-group-item" v-for="(record, index) in searchHistory" :key="index"
            @click="fillSearchQuery(record)">
            {{ record }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import { useStore } from 'vuex';

export default {
  name: "SearchPopup",
  data() {
    return {
      searchQuery: "", // 搜索框里面内容
      searchHistory: [],  // 历史记录
    };
  },
  mounted() {
    // 当组件加载时，从localStorage中加载搜索记录
    this.loadSearchHistory();
  },
  methods: {

    focusInput() {
      this.$refs.input.focus();
    },

    submitSearch() {

      // 去除重复记录
      this.searchHistory = this.searchHistory.filter(
        (item, index) => this.searchHistory.indexOf(item) === index
      );

      // 判断输入的搜索内容是否已存在于搜索历史中
      const existingIndex = this.searchHistory.findIndex(
        (item) => item === this.searchQuery
      );

      // 如果输入的搜索内容已存在于搜索历史中，则将其移动到搜索历史数组的最前面
      if (existingIndex !== -1) {
        this.searchHistory.splice(existingIndex, 1);
      }

      // 将搜索记录添加到数组中
      this.searchHistory.unshift(this.searchQuery);

      // 最多保持8条记录
      if (this.searchHistory.length > 8) {
        this.searchHistory.splice(8);
      }

      // 保存搜索记录到localStorage
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));

      // 先将数据更新到 store 上
      // this.$store.dispatch("search/updateSearchQuery", this.searchQuery);

      // 使用router进行跳转，并带上查询参数
      // console.log(this.searchQuery);
      const timestamp = Date.now();
      this.$router.push({
        name: 'search', // 你的组件的路由名称
        params: {
          timestamp: timestamp
        }
      }).then(() => {
        window.location.reload();
      });

      // window.location.reload();
      
      // this.$router.push({ name: 'search' });
      // 清空搜索框
      this.searchQuery = "";
      // 调用父类函数，关闭搜索框
      this.$emit('hideSearchPopup');
    },

    loadSearchHistory() {
      // 从localStorage中加载搜索记录
      const history = localStorage.getItem("searchHistory");
      if (history) {
        this.searchHistory = JSON.parse(history);
      }
    },

    fillSearchQuery(query) {
      // 点击历史记录时，将记录的内容填写到搜索框中
      this.searchQuery = query;
      // 将该记录移动到搜索历史数组的第一位
      this.searchHistory = this.searchHistory.filter((item) => item !== query);
      this.searchHistory.unshift(query);
      // 保存搜索记录到localStorage
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
      this.focusInput();
    },
  },
};
</script>

<style scoped>
.card-body {
  padding: 40px;
}

#searchForm {
  display: flex;
}

#searchInput {
  margin-right: 2%;
  width: 80%;
}

#searchButton {
  width: 18%;
}

.list-group {
  margin-top: 4px;
}

.list-group-item:hover {
  background-color: #eeeeee;
}

#searchPopup {
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -190px);
  width: 50%;
  z-index: 1000;
}

@media (max-width: 1154px) {
  #searchPopup {
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -190px);
    width: 90%;
    z-index: 1000;
  }

  #searchInput {
    margin-right: 2%;
    width: 73%;
  }

  #searchButton {
    width: 25%;
    /* font-size: 10px; */
  }
}

@media (max-width: 767px) {
  #searchPopup {
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -190px);
    width: 90%;
    z-index: 1000;
  }

  #searchInput {
    margin-right: 2%;
    width: 63%;
  }

  #searchButton {
    width: 35%;
    /* font-size: 10px; */
  }
}
</style>
