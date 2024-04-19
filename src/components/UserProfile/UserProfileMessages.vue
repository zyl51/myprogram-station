<template>
  <section class="container" style="margin-top: 20px;">
    <div v-for="message in messages" :key="message.id">
      <!-- vertical-align: top; 头像和用户名在垂直方向上对齐-->
      <div class="inline-block-class" style="margin-right: 10px; vertical-align: top;">
        <img class="user-photo" :src="message.sender_avatar_url" alt="头像">
      </div>
      
      <div class="inline-block-class" style="vertical-align: top;">
        <!-- <div class="inline-block-class">用户&ensp;</div> -->
        <div class="inline-block-class">
          <router-link style="font-weight: 600;" :to="{name: 'userProfile', params: {user_id: message.sender_id}}" class="head-and-name">{{ message.sender_name }}&ensp;</router-link>
        </div>
        <div></div>
        <div v-if="message.status == 1" class="inline-block-class" style="color: red; font-weight: 900;">点赞了</div>
        <div v-if="message.status == 2" class="inline-block-class" style="color: coral; font-weight: 900;">收藏了</div>
        <div v-if="message.status == 3" class="inline-block-class" style="color: #502C6C; font-weight: 900;">评论了</div>
        <div class="inline-block-class">&ensp;</div>
        <div class="inline-block-class">
          <router-link style="font-weight: 600;" :to="{name: 'blog', params: {post_id: message.post_id}}" class="head-and-name">{{ message.title }}&ensp;</router-link>
        </div>
      </div>
      <!-- 用户为管理员用户为帖子主人，用户为评论主任 -->
      <button
        @click="delete_message(message.id)" class="btn btn-sm btn-danger delete-button">删除
      </button>
      
      <!-- <VMarkdownView style="margin-left: 58px;" :content="message.comment" /> -->
      <!-- <div style="margin-left: 58px;">{{ message.comment }}</div> -->

      <hr class="hr-class">
    </div>
  </section>
</template>


<script>
import $ from 'jquery';
import { ref } from 'vue';
import { useStore } from 'vuex';


export default {
  name: "UserProfileMessages",
  props: {
    user_id: {
      type: Number,
      required: true,
    }
  },
  components: {

  },
  setup(props, context) {
    const store = useStore();
    const messages = ref([]);
    const IP_PORT = store.getters.IP_PORT;

    $.ajax({
      url: "https://" + IP_PORT + "/api/userprofile/message/" + props.user_id,
      type: "GET",
      data: {

      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        console.log("成功：", resp)
        messages.value = resp;
      },
      error(textStatus, errorThrown) {
        console.error("get message", textStatus, errorThrown);
      }
    });

    const delete_message = (message_id) => {
      $.ajax({
        url: "https://" + IP_PORT + "/api/userprofile/update_message/" + message_id,
        type: "POST",
        data: {

        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          messages.value = messages.value.filter(message => message.id !== message_id);
          context.emit("delete_message");
          console.log(resp);
        },
        error(textStatus, errorThrown) {
          console.error("delete message", textStatus, errorThrown);
        }
      });
    };

    return {
      messages,
      delete_message,
    }
  }
}
</script>

<style scoped>
.hr-class {
  border-color: #6a6a6a;
  margin-left: 10px;
}

.head-and-name:visited {
  color: rgb(0, 94, 255);
  /* 设置访问过的链接颜色为链接原本的颜色 */
}

.head-and-name:hover {
  text-decoration: underline;
  /* 鼠标悬浮时添加下划线 */
}

.inline-block-class {
  display: inline-block;
}

.user-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}


.delete-button {
  /* margin-top: 10px; */
  /* margin-left: 2.5rem; */
  /* height: 20%; */
  background-color: #DC3545;
  float: right;
}
</style>