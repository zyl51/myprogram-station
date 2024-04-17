<template>
  <div class="container" data-aos="fade-up">
    <div class="card" style="margin-bottom: 10px;">
      <div class="card-body">
        <div class="col-4 inline-block-class" style="text-align: center;">
          <i v-if="is_like" @click="like" class="fas fa-heart like"></i>
          <i v-else @click="like" class="far fa-heart like"></i>
          点赞
        </div>
        <div class="col-4 inline-block-class" style="text-align: center;">
          <i v-if="is_collect" @click="collect" class="fas fa-star collect"></i>
          <i v-else @click="collect" class="far fa-star collect"></i>
          收藏
        </div>
        <div class="col-4 inline-block-class" style="text-align: center;">
          <i class="fas fa-exclamation report"></i>
          举报
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import $ from 'jquery';
import { useStore } from 'vuex';

export default {
  name: "LikeCollect",
  components: {

  },
  props: {

  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    // 是否登录
    const is_login = computed(() => {
      return store.getters['user/getIsLogin'];
    });
    const post_id = ref(parseInt(route.params.post_id));
    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });

    // 获取点赞数据
    const is_like = ref(false);
    const is_collect = ref(false);
    $.ajax({
      url: "https://localhost:8082/api/like_collect/get",
      type: "GET",
      data: {
        user_id: user_id.value,
        post_id: post_id.value,
      },
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      dataType: "json",
      success(resp) {
        // 
        is_like.value = resp.like;
        is_collect.value = resp.collect;
      },
      error(textStatus, errorThrown) {
        console.error("get user like and collect", textStatus, errorThrown);
      }
    });

    // 点赞或者取消点赞
    const like = () => {
      if (!is_login.value) {
        router.push({name: "login"});
      }
      // is_like.value = !is_like.value;
      // 如果之前是点赞，那么就是取消点赞
      let func = '';

      if (is_like.value) {
        func = "sub_like";
      } else {
        func = "add_like";
      }

      $.ajax({
        url: "https://localhost:8082/api/like_collect/" + func,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_id: user_id.value,
          post_id: post_id.value,
        }),
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        dataType: "json",
        success() {
          is_like.value = !is_like.value;
        },
        error(textStatus, errorThrown) {
          console.error("add or sub like", textStatus, errorThrown);
        }
      });
    }

    const collect = () => {
      if (!is_login.value) {
        router.push({name: "login"});
      }
      // 如果之前是收藏，那么就是取消收藏
      let func = '';

      if (is_collect.value) {
        func = "sub_collect";
      } else {
        func = "add_collect";
      }

      $.ajax({
        url: "https://localhost:8082/api/like_collect/" + func,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_id: user_id.value,
          post_id: post_id.value,
        }),
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success() {
          is_collect.value = !is_collect.value;
        },
        error(textStatus, errorThrown) {
          console.error("add or sub collect", textStatus, errorThrown);
        }
      });
    }

    return {
      is_like,
      is_collect,
      like,
      collect,
    }
  }
}
</script>

<style scoped>
.inline-block-class {
  display: inline-block;
}

/* 点赞 */
.like {
  color: red;
  /* background-color: red; */
}

/* 收藏 */
.collect {
  color: gold;
}
</style>