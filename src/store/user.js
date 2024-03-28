import { reactive } from 'vue';

const ModuleUser = {
  namespaced: true,
  state: {
    // 存储所有的数据 
    user: reactive({
      id: 1,
      username: "",
      avatar: "",
      follower_count: 0,
      access: "",
      refresh: "",
      is_login: false,
    }),
  },
  getters: {
    // 想获取 state 的内容并且需要通过一定计算的时候放进这里面进行获取
    // 只能读取，不能修改
    getUserId(state) {
      return state.user.id;
    },
  },
  mutations: {
    // 对 state 数据进行直接修改
    // 无法执行异步操作
    updateUser(state, user) {
      state.id = user.id;
      state.username = user.username;
      state.avatar = user.avatar;
      state.follower_count = user.follower_count;
      state.access = user.access;
      state.refresh = user.refresh;
      state.is_login = user.is_login;
    },
  },
  actions: {
    initializeData(context) {
      const user = reactive({
        id: 1,
        username: "",
        avatar: "",
        follower_count: 0,
        access: "",
        refresh: "",
        is_login: false,
      });

      context.commit('updateUser', user);
    }
  },
  modules: {
  }
}

export default ModuleUser;