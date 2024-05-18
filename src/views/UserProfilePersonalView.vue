<template>
  <section class="container" style="height: 100%;">
    <div class="container" style="padding-top: 3.5rem;">

      <div v-if="show_updated" class="card prompt-success" style="width: 18rem;z-index: 1;">
        <div class="card-body">
          <h5 class="card-title" style="text-align: center;font-weight: 900;color: #502C6C;"> 修改成功
          </h5>
          <div class="row">
            <div class="col-4"></div>
            <button @click="confirm" class="btn btn-primary col-4 btn-sm">确定</button>
            <div class="col-4"></div>
          </div>
        </div>
      </div>
      <!-- <div>个人中心</div> -->
      <div class="row">
        <div class="col-2">
          <div class="card" data-aos="fade-right">
            <div class="card-body" style="padding: 0.7rem;">
              <a :href="user.avatar_url" target="_blank">
                <img :src="user.avatar_url" style="width: 100%;" class="img-fluid" alt="头像">
              </a>
            </div>
          </div>
        </div>

        <!-- 修改用户的信息 -->
        <div class="col-10">
          <div class="card">
            <div class="card-body row">
              <div class="card col-6">
                <div class="card-body">
                  <h4 class="mb-4 text-center">修改个人信息</h4>
                <!-- 修改用户名 -->
                <div class="input-group mb-3">
                  <label class="input-group-text my_label">用户名</label>
                  <input type="text" v-model="username" class="form-control" id="inputGroupFile01" required="">
                  <button class="btn btn-primary" @click="sumbit_username" :disabled="!username">确定</button>
                </div>
                <!-- End 修改用户名 -->

                <!-- 修改用户的头像 -->
                <div class="input-group mb-3">
                  <label class="input-group-text my_label">头像</label>
                  <input type="file" @change="onFileChange" class="form-control" id="imageUpload" accept="image/*">
                  <button class="btn btn-primary" @click="sumbit_avatar" :disabled="!have_file">确定</button>
                </div>
                <!-- End 修改用户的头像 -->

                <!-- 用户头像预览 -->
                <div class="row">
                  <div class="col-1"></div>
                  <div class="col-11">
                    <canvas id="outputImage"></canvas>
                  </div>
                </div>
                <!-- End 用户头像预览 -->
              </div>

              </div>

              <div class="col-1">

              </div>
              
              <div class="card col-5">
                <div class="card-body">
                <!-- 修改用户密码 -->
                <form class="row" action="" @submit.prevent="update_password">
                  <h4 class="mb-4 text-center">修改密码</h4>
                  <div class="input-group mb-3 col-12">
                    <label class="input-group-text my_label">旧密码</label>
                    <input type="password" v-model="old_password" class="form-control" id="inputGroupFile01" required="">
                  </div>
                  <div class="input-group mb-3 col-12">
                    <label class="input-group-text my_label">新密码</label>
                    <input type="password" v-model="new_password" class="form-control" id="inputGroupFile01" required="">
                  </div>
                  <div class="input-group col-12">
                    <label class="input-group-text my_label">确认密码</label>
                    <input type="password" v-model="confirm_pasword" class="form-control" id="inputGroupFile01" required="">
                  </div>
                  <div class="col-12 mb-3" style="font-weight: 900;color: red;margin-left: 4px;">
                    {{ update_password_error }}
                  </div>
                  <div class="col-4"></div>
                  <button class="btn btn-primary col-4" type="submit" :disabled="!username">确定</button>
                </form>
                <!-- End 修改用户的密码 -->
              </div>
              </div>
              


            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>


<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import $ from 'jquery';
import { useRouter } from 'vue-router';
// import { useRouter } from 'vue-router';

export default {
  name: "UserProfilePersonalView",
  components: {

  },
  data() {
    return {
      have_file: null, // 选择的文件（头像）
    }
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.have_file = files[0];
      this.createImage(files[0]);
    },
    createImage(file) {
      let reader = new FileReader();
      let vm = this;
      reader.onload = (e) => {
        vm.image = e.target.result;
        vm.cropImage();
      };
      reader.readAsDataURL(file);
    },
    cropImage() {
      let img = new Image();
      img.src = this.image;
      img.onload = function () {
        let canvas = document.getElementById('outputImage');
        let ctx = canvas.getContext('2d');
        let size = Math.min(img.width, img.height);
        let scale = window.innerWidth > 768 ? Math.min(300 / size, 1) : Math.min(200 / size, 1);
        canvas.width = size * scale;
        canvas.height = size * scale;
        ctx.scale(scale, scale);
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
      }
    }
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    // const router = useRouter();
    const user = computed(() => {
      return store.getters['user/getUser'];
    });
    console.log(user.value.avatar_url);
    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });
    const IP_PORT = store.getters.IP_PORT;

    const username = ref(store.getters['user/getUserName']);
    // 监听变化
    watch(() => store.getters['user/getUserName'], (newValue) => {
      username.value = newValue;
    });

    const show_updated = ref(false);
    const sumbit_username = () => {
      $.ajax({
        url: "https://" + IP_PORT + "/api/userprofile/update_username",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_id: user_id.value,
          username: username.value,
        }),
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        dataType: "json",
        success(resp) {
          // console.log(resp);
          show_updated.value = true;
          store.commit("user/updateUserName", resp);
          // username.value = resp;
          // username.value = resp;
        },
        error(textStatus, errorThrown) {
          console.error("update user name error", textStatus, errorThrown);
        }
      });
    };

    // 上传封面
    const sumbit_avatar = () => {
      // 获取输出图片
      let canvas = document.getElementById('outputImage');
      // 将canvas内容转换为Blob对象
      canvas.toBlob(function (blob) {
        // 创建一个FormData对象
        let formData = new FormData();
        // 将Blob对象添加到FormData对象中
        formData.append('file', blob, 'image.jpg');
        // 上传
        $.ajax({
          url: "https://" + IP_PORT + "/api/userprofile/update_avatar/" + user_id.value,
          type: "POST",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          headers: {// jwt 验证方式，直接抄就对了
            "Authorization": "Bearer " + store.getters['user/getToken'],
          },
          dataType: "json",
          success(resp) {
            console.log(resp);
            const avatar_url = ref('');
            avatar_url.value = resp;

            // 修改图片路径 
            $.ajax({
              url: "https://" + IP_PORT + "/api/userprofile/update_avatar_url",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                user_id: user_id.value,
                avatar_url: avatar_url.value,
              }),
              headers: {// jwt 验证方式，直接抄就对了
                "Authorization": "Bearer " + store.getters['user/getToken'],
              },
              dataType: "json",
              success(resp) {
                // console.log(resp, avatar_url);
                store.commit('user/updateAvatarUrl', avatar_url);
                // user.value.avatar_url = avatar_url;
                console.log(resp, user.value.avatar_url);
                // router.push({name: "userProfilePersonal"});
              },
              error(textStatus, errorThrown) {
                console.error("update user avatar_url error", textStatus, errorThrown);
              }
            })

          },
          error(textStatus, errorThrown) {
            console.error("update user avatar error", textStatus, errorThrown);
          }
        });

      });
    };

    const confirm = () => {
      show_updated.value = !show_updated.value;
    };


    const ajax_update_password = () => {
      $.ajax({
        url: "https://" + IP_PORT + "/api/userprofile/update_password",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_id: user_id.value,
          old_password: old_password.value,
          new_password: new_password.value,
        }),
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        dataType: "json",
        success(resp) {
          show_updated.value = !show_updated.value;
          router.push({name: "login"}).then(() => {
            store.dispatch('user/logout');
          });
          console.log(resp);
        },
        error(xhr, textStatus, errorThrown) {
          update_password_error.value = xhr.responseJSON;
          console.log(xhr.responseJSON);
          console.error("update password error", textStatus, errorThrown);
        }
      })
    };

    const old_password = ref('');
    const new_password = ref('');
    const confirm_pasword = ref('');
    const update_password_error = ref('');
    const update_password = () => {
      // show_updated.value = !show_updated.value;
      if (new_password.value != confirm_pasword.value) {
        update_password_error.value = "两次输入的密码不一致";
      } else {
        // update_password_error.value = "一致";
        ajax_update_password();
      }
    };

    return {
      show_updated,
      confirm,
      user,
      user_id,
      username,
      sumbit_username,
      sumbit_avatar,
      old_password,
      new_password,
      confirm_pasword,
      update_password,
      update_password_error,
    }
  }
}
</script>

<style scoped>
.prompt-success {
  position: fixed;
  /* 使用固定定位 */
  top: 50%;
  /* 将顶部定位在屏幕的中间 */
  left: 50%;
  /* 将左侧定位在屏幕的中间 */
  transform: translate(-50%, -50%);
  /* 使用 transform 将元素向左上方移动其自身宽高的一半，使其完全位于屏幕中间 */
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ccc;
  width: 18rem;
  z-index: 1;
}

.follow-button {
  border-radius: 5px;
}
</style>