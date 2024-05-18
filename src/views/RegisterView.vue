<template>
  <!-- Main -->
  <div class="d-md-flex h-md-100 align-items-center">
    <div class="col-md-6 p-0 bg-indigo h-md-100" data-aos="fade-right">
      <div class="text-white d-md-flex align-items-center h-100 p-5 text-center justify-content-center">
        <div class="logoarea pt-5 pb-5">
          <p>
            <i class="fas fa-star-and-crescent fa-3x"></i>
          </p>
          <!-- <h1 class="mb-0 mt-3 display-4">Anchor</h1> -->
          <h1><strong class="title-gradient mb-0 mt-3">Program Station</strong></h1>
          <h5 class="font-weight-light mb-4" style="font-weight: 900 !important;">
            前端使用的免费的 Bootstrap 5.3.2
            <strong> UI Kit</strong>
          </h5>
          <a class="btn btn-outline-white btn-lg btn-round hidden" href="https://v5.bootcss.com/">
            <i class="fab fa-bootstrap"></i> Bootstrap
          </a>
        </div>
      </div>
    </div>
    <!-- class = loginarea -->
    <div class="container col-md-6 p-0 bg-white h-md-100" data-aos="fade-left">
      <div class=" d-md-flex align-items-center h-md-100 p-5 justify-content-center">
        <div class="col-md-9">
          <form class="border rounded p-5 " @submit.prevent="register">
            <h3 class="mb-4 text-center">注册</h3>
            <div class="form-group">
              <input type="text" v-model="username" class="form-control" id="exampleInputUsername1" placeholder="用户名"
                required="请输入用户名">
            </div>

            <div class="form-group">
              <input type="email" class="form-control" v-model="email" id="exampleInputEmail1" @input="validateEmail"
                aria-describedby="emailHelp" placeholder="邮箱" required="请输入邮箱">
              <div style="margin-left: 2px;color: red;font-weight: 900;">{{ email_status }}</div>
            </div>

            <div class="form-group input-group">
              <input type="text" v-model="verification_code" class="form-control" placeholder="验证码" required="请输入验证码">
              <button class="btn btn-outline-primary" type="button" id="button-addon3"
                :disabled="!isValidEmail || countdown > 0" @click="send_verification">获取
              </button>
            </div>
            <div class="form-group">
              <input type="password" v-model="password" class="form-control" id="exampleInputPassword1" placeholder="密码"
                required="">
            </div>
            <div class="form-group">
              <input type="password" v-model="confirm_password" class="form-control" id="exampleInputPassword1"
                placeholder="确认密码" required="">
            </div>
            <div style="margin-bottom: 1rem;margin-left: 2px;color: red;font-weight: 900;">{{ password_status }}</div>

            <button type="submit" class="btn btn-success btn-round btn-block shadow-sm">注册</button>

          </form>
        </div>


      </div>
    </div>


  </div>
</template>

<script>
import $ from 'jquery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'RegisterView',
  components: {
  },
  data() {
  },
  methods: {
  },
  setup() {
    // 用户名
    const username = ref('');
    // 定义邮箱的输入，双向绑定
    const email = ref('');
    // 验证码
    const verification_code = ref('');
    // 邮箱格式正确按钮可点击
    const isValidEmail = ref(false);

    // 判断邮箱格式释放正确
    const validateEmail = () => {
      // 正则表达式验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValidEmail.value = emailRegex.test(email.value);
    }

    // 查看验证码发送后的状态
    const email_status = ref('');
    const send_verification = () => {
      startCountdown();
      // console.log("send_verification", email.value);
      $.ajax({
        url: "https://localhost:8082/api/send/verification",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          email: email.value,
        }),
        dataType: "json",
        success(resp) {
          email_status.value = "";
          console.log(resp);
        },
        error(xhr, textStatus, errorThrown) {
          // email_status.value = "邮箱已有账号";
          countdown.value = 0;
          email_status.value = xhr.responseJSON;
          console.error("post send_verification: ", textStatus, errorThrown);
        }
      });
    };


    // 发送验证码后等待60秒
    const countdown = ref(0);
    // 开始倒计时函数
    const startCountdown = () => {
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value > 0) {
          // 更新按钮文本显示剩余秒数
          $('#button-addon3').text(`${countdown.value} 秒`);
        } else {
          // 取消倒计时函数
          clearInterval(timer);
          // 倒计时结束后，重置按钮状态
          $('#button-addon3').text('获取');
        }
      }, 1000);
    };


    // 密码，确认密码和密码状态
    const store = useStore();
    const router = useRouter();
    const password = ref('');
    const confirm_password = ref('');
    const password_status = ref('');

    const register = () => {
      if (password.value !== confirm_password.value) {
        password_status.value = "两次密码不一致";
      } else {
        // console.log("register --------: ");
        password_status.value = '';
        $.ajax({
          url: "https://localhost:8082/api/verify/verification",
          // url: "https://localhost:8082/api/verify/verification",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            name: username.value,
            email_receiver: email.value,
            verification_code: parseInt(verification_code.value),
            password: password.value,
          }),
          dataType: "json",
          success(resp) {
            // 说明注册成功
            password_status.value = "";
            store.dispatch("user/updateUser", resp);
            console.log(resp);
            router.push({name: "home"});
          },
          error(xhr, textStatus, errorThrown) {
            // email_status.value = "邮箱已有账号";
            password_status.value = xhr.responseJSON;
            console.error("post verify_verification_code: ", textStatus, errorThrown);
          }
        });

      }
    };

    return {
      username, // 用户名
      email,    // 邮箱
      isValidEmail,
      validateEmail,
      send_verification,
      countdown,
      verification_code,  // 验证码
      email_status,
      password,   // 密码
      confirm_password,
      password_status,
      register,
    }
  },
}
</script>

<style scoped>
.title-gradient {
  background: linear-gradient(to right, #00ff62, #0091ff);
  background-clip: text;
  color: transparent;
}
</style>
