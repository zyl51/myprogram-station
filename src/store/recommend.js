import { reactive } from 'vue';
import $ from 'jquery';

const ModuleRecommend = {
  state: {
    // 存储所有的数据 
    recommend: reactive({
      posts: [],
      currentPage: -1,
      totalPages: 1,
      totalPosts: 1,
    }),
  },
  getters: {
    // 想获取 state 的内容并且需要通过一定计算的时候放进这里面进行获取
    // 只能读取，不能修改
    getCurrentPage(state) {
      return state.recommend.currentPage;
    },
    getPosts(state) {
      return state.recommend.posts;
    },
    getTotalPages(state) {
      return state.recommend.totalPages;
    },
  },
  mutations: {
    // 对 state 数据进行直接修改
    // 无法执行异步操作
    updateRecommend(state, recommend) {
      // 修改整个推荐页的信息
      state.recommend.posts = recommend.posts;
      state.recommend.currentPage = recommend.currentPage;
      state.recommend.totalPages = recommend.totalPages;
      state.recommend.totalPosts = recommend.totalPosts;
    },
    updatePosts(state, posts) {
      // 修改新的列表信息
      state.recommend.posts = posts;
    },
    updateCurrentPage(state, currentPage) {
      // 修改当前页是什么
      state.recommend.currentPage = currentPage;
    },
    updateTotalPosts(state, totalPosts) {
      // 修改总列表数
      state.recommend.totalPosts = totalPosts;
      state.recommend.totalPages = Math.ceil(state.recommend.totalPosts / 10);
    },
    addTotalPosts(state) {
      // 增加列表数
      state.recommend.totalPosts ++ ;
      state.recommend.totalPages = Math.ceil(state.recommend.totalPosts / 10);
    },
    sunTotalPosts(state) {
      state.recommend.totalPosts -- ;
      state.recommend.totalPages = Math.ceil(state.recommend.totalPosts / 10);
    }
  },
  actions: {
    // 用于初始化数据
    initializeData(context) {
      // 
      const recommend = reactive({
        posts: [],
        currentPage: 1,
        totalPages: 1,
        totalPosts: 1,
      });

      // 申请列表的数据
      // 请求数据
      $.ajax({
        url: "http://localhost:8082/api/recommend/totalnumbers",
        type: "GET",
        data: {

        },
        success(resp) {
          // 总帖子数和总页数
          recommend.totalPosts = resp.number;
          recommend.totalPages = Math.ceil(recommend.totalPosts / 10);
          
          // 申请帖子列表
          $.ajax({
            url: "http://localhost:8082/api/recommend/postlist/" + recommend.currentPage,
            type: "GET",
            data: {
              
            },
            dataType: "json",
            success (resp) {
              // console.log("success");
              recommend.posts = resp;
              context.commit("updateRecommend", recommend);
            },
            error(textStatus, errorThrown) {
              console.error("get recommend postlist: ", textStatus, errorThrown);
            }
          });
        },
        error(textStatus, errorThrown) {
          console.error("get recommend total numbers: ", textStatus, errorThrown);
        }
      });
    },

// *************************************************************************
    // 修改 currrntPage 页数
    updateCurrentPage(context, data) {
      // console.log("actions updateCurrentPage ", data.page);
      $.ajax({
        url: "http://localhost:8082/api/recommend/postlist/" + data.page,
        type: "GET",
        data: {

        },
        dataType: "json",
        success(resp) {
          context.commit("updatePosts", resp);
          context.commit("updateCurrentPage", data.page);
          // console.log(resp);
        },
        error(textStatus, errorThrown) {
          console.error("get recommend posts: ", context.state.recommend.currentPage, textStatus, errorThrown);
        }
      });
      context.commit("updateCurrentPage", data.page);

    }
  },
  modules: {
  }
}

export default ModuleRecommend;