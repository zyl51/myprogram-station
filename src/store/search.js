const ModuleSearch = {
  namespaced: true,
  state: {
    // 存储所有的数据 
    searchQuery: '',
  },
  getters: {
    // 想获取 state 的内容并且需要通过一定计算的时候放进这里面进行获取
    // 只能读取，不能修改
    getSearchQuery(state) {
      return state.searchQuery;
    },
  },
  mutations: {
    // 对 state 数据进行直接修改
    // 无法执行异步操作
    updateSearchQuery(state, searchQuery) {
      state.searchQuery = searchQuery;
    }
  },
  actions: {
    updateSearchQuery(context, searchQuery) {
      context.commit('updateSearchQuery', searchQuery);
    }
  },
  modules: {
  }
}

export default ModuleSearch;