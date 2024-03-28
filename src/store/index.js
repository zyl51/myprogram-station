import { createStore } from 'vuex'
import ModuleRecommend from './recommend'
import ModuleFollow from './follow'
import ModuleUser from './user'
import ModuleSearch from './search'

export default createStore({
  state: {
    // 存储所有的数据
  },
  getters: {
    // 想获取 state 的内容并且需要通过一定计算的时候放进这里面进行获取
    // 只能读取，不能修改
  },
  mutations: {
    // 对 state 数据进行直接修改
    // 无法执行异步操作
  },
  actions: {
    // 定义所有的修改 state 信息的方式，但是确切的修改需要在 mutations 进行
  },
  modules: {
    // 为了将 modules 进行分割
    recommend: ModuleRecommend,
    follow: ModuleFollow,
    user: ModuleUser,
    search: ModuleSearch,
  }
})
