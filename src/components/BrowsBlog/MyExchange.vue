<template>
  <!-- 点赞，收藏，举报， 评论-->
  <div class="card">
    <div class="card-body">
      <div class="card" style="margin-bottom: 10px;">
        <div class="card-body">
          <div class="col-4 inline-block-class" style="text-align: center;">
            <!-- <i class="far fa-heart like"></i> -->
            <i class="fas fa-heart like"></i>
            点赞
          </div>
          <div class="col-4 inline-block-class" style="text-align: center;">
            <!-- <i class="far fa-star collect"></i> -->
            <i class="fas fa-star collect"></i>
            收藏
          </div>
          <div class="col-4 inline-block-class" style="text-align: center;">
            <i class="fas fa-exclamation report"></i>
            举报
          </div>
        </div>
      </div>

      <!-- 评论 -->
      <div class="card">
        <div class="card-body">
          <label class="form-label">评论</label>
          <!-- 使用我们的 v-model 将我们的 content 和 textarea内容绑定 -->
          <textarea v-model="comment" class="form-control" rows="3" placeholder="这里写评论..."></textarea>
          <button @click="submit_comment" class="btn btn-primary" style="margin-top: 2px;">提交评论</button>
          <hr>
 
          <!-- 已经发表的评论 -->
          <div v-for="user in users" :key="user.id">
            <!-- vertical-align: top; 头像和用户名在垂直方向上对齐-->
            <div class="inline-block-class" style="margin-right: 10px; vertical-align: top;">
              <img class="user-photo" :src="user.photo" alt="头像">
            </div>
            <div class="inline-block-class" style="vertical-align: top;">
              <div><a href="#" class="head-and-name">{{ user.username }}</a></div>
              <div style="color: #ADA399; font-size: 8px;">2024-02-18</div>
            </div>
            <div style="margin-left: 58px;">{{ user.followerCount }}</div>
            <hr>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import $ from 'jquery';

export default {
  name: "MyExchange",
  components() {

  },
  data() {
    return {
      markdownText: '',
      comment: '',
    }
  },
  methods: {
    // 提交评论
    submit_comment() {
      this.markdownText = this.comment;
      this.comment = '';
    }
  },
  setup() {
    // 获取用户列表
    const route = useRoute();
    const postId = ref(route.params.postId);
    console.log(postId.value);
    const users = ref([]);

    $.ajax({
      url: "https://app165.acapp.acwing.com.cn/myspace/userlist/",
      type: "GET",
      data: {

      },
      dataType: "json",
      success(resp) {
        users.value = resp;
      }
    });

    return {
      users,
    }
  }
}
</script>

<style scoped>
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