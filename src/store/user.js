import { reactive } from 'vue';
import $ from 'jquery';

const ModuleUser = {
  namespaced: true,
  state: {
    // 存储所有的数据 
    user: reactive({
      id: 0,
      username: "",
      avatar_url: "",
      follower_count: 0,
      fans: 0,
      token: "is token",
      is_login: false,
      is_admin: false,
    }),
  },
  getters: {
    // 想获取 state 的内容并且需要通过一定计算的时候放进这里面进行获取
    // 只能读取，不能修改
    getUser(state) {
      return state.user;
    },
    getUserId(state) {
      return state.user.id;
    },
    getIsLogin(state) {
      return state.user.is_login;
    },
    getUserName(state) {
      return state.user.username;
    },
    getToken(state) {
      return state.user.token;
    },
    getIsAdmin(state) {
      return state.user.is_admin;
    },
    getAvatarUrl(state) {
      return state.user.avatar_url;
    }
  },
  mutations: {
    // 对 state 数据进行直接修改
    // 无法执行异步操作
    updateUser(state, user) {
      state.user.id = user.id;
      state.user.username = user.username;
      state.user.avatar_url = user.avatar_url;
      state.user.follower_count = user.follower_count;
      state.user.fans = user.fans,
      state.user.token = user.token;
      state.user.is_login = user.is_login;
    },
    updateToken(state, token) {
      state.user.token = token;
    },
    updateIsAdmin(state, is_admin) {
      state.user.is_admin = is_admin;
    },
    updateUserName(state, username) {
      state.user.username = username;
    },
    updateAvatarUrl(state, avatar_url) {
      state.user.avatar_url = avatar_url;
    },
    logout(state) {
      // 登出账号
      state.user.id = 0;
      state.user.username = "";
      state.user.avatar_url = "";
      state.user.follower_count = 0;
      state.user.fans = 0,
      state.user.token = "";
      state.user.is_login = false;
    }
  },
  actions: {

    // 注册完成之后的函数
    updateUser(context, data) {
      const user = reactive({
        id: 3,
        username: "",
        avatar_url: "",
        follower_count: 0,
        fans: 0,
        token: "",
        is_login: true,
      });

      user.id = data.id,
      user.username = data.name,
      user.avatar_url = data.avatar_url,
      user.follower_count = data.follower_count,
      user.fans = data.fans,
      user.token = data.token;
      // 将 token 存储到本地
      localStorage.setItem('token', data.token);
      user.is_login = true;

      console.log(user);
      context.commit("updateUser", user);

      // 周期函数，用来获取新 token 和用户数据
      setInterval(() => {
        $.ajax({
          url: "https://127.0.0.1:8082/api/token_get_userinfo",
          type: "POST",
          data: {
  
          },
          headers: {// jwt 验证方式，直接抄就对了
            "Authorization": "Bearer " + localStorage.getItem('token'),
          },
          dataType: "json",
          success(resp) {
            // 验证成功
            context.commit("updateUser", resp);
          },
          error(textStatus, errorThrown) {
            console.error("updateUser: get user info through token: ", textStatus, errorThrown);
          }
        });
      }, 55 * 60 * 1000);

    },
    updateToken(context, token) {
      context.commit("updateToken", token);
      // Token 验证成功获取登录信息
      $.ajax({
        url: "https://127.0.0.1:8082/api/token_get_userinfo",
        type: "POST",
        data: {

        },
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + token,
        },
        dataType: "json",
        success(resp) {
          // 验证成功
          context.dispatch("updateUser", resp);
          console.log("token_get_userinfo", resp);
        },
        error(textStatus, errorThrown) {
          console.error("get user info through token: ", textStatus, errorThrown);
        }
      });
    },
    logout(context) {
      // 删除本地 token
      localStorage.removeItem('token');
      // 登出账号
      context.commit("logout");
    }
  },
  modules: {
  }
}

export default ModuleUser;