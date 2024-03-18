import { reactive } from 'vue';
import $ from 'jquery';

const ModuleFollow = {
  namespaced: true,
  state: {
    // 存储所有的数据 
    follow: reactive({
      posts: [],
      currentPage: -1,
      totalPages: 1,
      totalPosts: 1,
    }),
  },
  getters: {
    // 想获取 state 的内容并且需要通过一定计算的时候放进这里面进行获取
    // 只能读取，不能修改
    getPosts(state) {
      return state.follow.posts;
    },
    getCurrentPage(state) {
      return state.follow.currentPage;
    },
    getTotalPages(state) {
      return state.follow.totalPages;
    },
  },
  mutations: {
    // 对 state 数据进行直接修改
    // 无法执行异步操作
    updateFollow(state, follow) {
      // 修改整个推荐页的信息
      state.follow.posts = follow.posts;
      state.follow.currentPage = follow.currentPage;
      state.follow.totalPages = follow.totalPages;
      state.follow.totalPosts = follow.totalPosts;
    },
    updatePosts(state, posts) {
      // 修改新的列表信息
      state.follow.posts = posts;
    },
    updateCurrentPage(state, currentPage) {
      // 修改当前页是什么
      state.follow.currentPage = currentPage;
    },
    updateTotalPosts(state, totalPosts) {
      // 修改总列表数
      state.follow.totalPosts = totalPosts;
      state.follow.totalPages = Math.ceil(state.follow.totalPosts / 10);
    },
    addTotalPosts(state) {
      // 增加列表数
      state.follow.totalPosts ++ ;
      state.follow.totalPages = Math.ceil(state.follow.totalPosts / 10);
    },
    sunTotalPosts(state) {
      state.follow.totalPosts -- ;
      state.follow.totalPages = Math.ceil(state.follow.totalPosts / 10);
    }
  },
  actions: {
    // 用于初始化数据
    initializeData(context, user_id) {
      // 关注的帖子
      const follow = reactive({
        posts: [],
        currentPage: 1,
        totalPages: 1,
        totalPosts: 1,
      });

      // 申请列表的数据
      // 请求数据
      $.ajax({
        url: "https://localhost:8082/api/follow/totalnumbers/" + user_id,
        type: "GET",
        data: {

        },
        dataType: "json", 
        success(resp) {
          // 总帖子数和总页数
          follow.totalPosts = resp.number;
          follow.totalPages = Math.ceil(follow.totalPosts / 10);
          
          // 申请帖子列表
          $.ajax({
            url: "https://localhost:8082/api/follow/postlist",
            type: "GET",
            data: {
              user_id: user_id,
              page: follow.currentPage,
            },
            dataType: "json",
            success (resp) {

              follow.posts = resp;
              context.commit("updateFollow", follow);
            },
            error(textStatus, errorThrown) {
              console.error("get follow postlist: ", textStatus, errorThrown);
            }
          });
        },
        error(textStatus, errorThrown) {
          console.error("get follow total numbers: ", textStatus, errorThrown);
        }
      });
    },

// *************************************************************************
    // 修改 currrntPage 页数
    updateCurrentPage(context, data) {
      // console.log("actions updateCurrentPage ", data.page);
      $.ajax({
        url: "https://localhost:8082/api/follow/postlist",
        type: "GET",
        data: {
          user_id: data.user_id,
          page: data.page,
        },
        dataType: "json",
        success(resp) {
          context.commit("updatePosts", resp);
          context.commit("updateCurrentPage", data.page);
          // console.log(resp);
        },
        error(textStatus, errorThrown) {
          console.error("get follow posts: ", context.state.follow.currentPage, textStatus, errorThrown);
        }
      });

    }
  },
  modules: {
  }
}

export default ModuleFollow;