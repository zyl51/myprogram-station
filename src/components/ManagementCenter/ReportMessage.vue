<template>
  <div class="container">
    <div style="margin-top: 20px;"></div>
    <div v-for="user_report in user_reports" :key="user_report.id" data-aos="fade-up">
      <!-- vertical-align: top; 头像和用户名在垂直方向上对齐-->
      <div class="inline-block-class" style="margin-right: 10px; vertical-align: top;">
        <img class="user-photo" :src="user_report.avatar_url" alt="头像">
      </div>
      <div class="inline-block-class" style="vertical-align: top;">
        <div class="inline-block-class">
          用户
          <router-link :to="{ name: 'userProfile', params: { user_id: user_report.user_id } }" href="#"
            class="head-and-name" style="font-weight: 600;">{{ user_report.username }}</router-link>
          举报了文章
          <router-link style="font-weight: 600;" :to="{name: 'blog', params: {post_id: user_report.post_id}}" class="head-and-name">
            {{ user_report.title }}&ensp;
          </router-link>
        </div>
        <div style="color: #ADA399; font-size: 8px;">{{ user_report.release_time }}</div>
      </div>
      <!-- 用户为管理员用户为帖子主人，用户为评论主任 -->
      <button v-if="is_admin"
        @click="delete_report(user_report.id)" class="btn btn-sm btn-danger delete-button">已处理</button>

      <div style="margin-left: 58px;">
        <div class="inline-block-class" style="color: red; font-weight: 900;">举报原因：</div>
        {{ user_report.report_reason }}
      </div>
      <!-- <div style="margin-left: 58px;">{{ usercomment.comment }}</div> -->

      <hr class="hr-class">
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "ReportMessage",
  components: {
  },
  setup(props, context) {
    const store = useStore();
    const is_admin = computed(() => {
      return store.getters['user/getIsAdmin'];
    });
    const user_reports = ref([]);

    $.ajax({
      url: "https://" + store.getters.IP_PORT + "/api/report/get",
      type: "GET",
      data: {

      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        user_reports.value = resp;
        console.log(resp);
      },
      error(textStatus, errorThrown) {
        console.error("get user report", textStatus, errorThrown);
      }
    });

    const delete_report = (report_id) => {
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/report/delete/" + report_id,
        type: "POST",
        data: {

        },
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          user_reports.value = user_reports.value.filter(user_report => user_report.id !== report_id);
          context.emit("delete_report");
          console.log(resp);
        },
        error(textStatus, errorThrown) {
          console.error("delete report", textStatus, errorThrown);
        }
      });
    };


    return {
      is_admin,
      user_reports,
      delete_report,
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
  float: right;
}
</style>