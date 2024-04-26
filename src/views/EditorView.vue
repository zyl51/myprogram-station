<template>
  <div class="container" style="margin-top: 100px;">

    <!-- 确认提交的窗口 -->
    <div v-if="show_confirm_window" class="card submit_window">
      <div class="card-body">
        <form @submit.prevent="sumbit">
          <div class="input-group mb-3">
            <label class="input-group-text my_label">标题</label>
            <input type="text" v-model="title" class="form-control" id="inputGroupFile01" required="">
          </div>
          <div class="input-group mb-3">
            <label class="input-group-text my_label">标签</label>
            <select class="form-select" id="validationDefault04" required v-model="label_id">
              <!-- <option selected disabled value="0">标签</option> -->
              <option v-for="label in labels" :value="label.id" :key="label.id">
                {{label.label_name}}
              </option>
            </select>
          </div>
          <div class="input-group mb-3">
            <label class="input-group-text my_label">封面</label>
            <input type="file" @change="onFileChange" class="form-control" id="imageUpload" accept="image/*" required="">
          </div>
          <div class="col-md-6">
            <canvas id="outputImage"></canvas>
          </div>
          <div style="text-align: center;">
            <button type="submit" class="btn btn-primary">确定</button>
          </div>
        </form>
        
      </div>
    </div>

    <!-- 正常的 markdown 组件 -->
    <div style="margin-left: 10px;" data-aos="fade-down">
      <div style="font-weight: 900;">
        正常语句想要换行可以输入两个或更多空格之后再回车
      </div>

      <div style="font-weight: 800;">
        1. 支持
        <a style="font-weight: 900;"
          href="https://www.wiz.cn/wapp/pages/book/80e9e270-64d3-11ea-b713-51a0d6b260b8/22f53cb5-61e3-4220-a691-ed626dc1ce20">
          Markdown
        </a>
        语法和
        <a style="font-weight: 900;"
          href="https://www.wiz.cn/wapp/pages/book/80e9e270-64d3-11ea-b713-51a0d6b260b8/36639711-db00-49c9-b418-ccc6377060ef">
          KaTex
        </a>
        数学公式 &ensp;&ensp;&ensp;
        2. 支持中文和英文 &ensp;&ensp;&ensp;
        3. 黑白主题预览 &ensp;&ensp;&ensp;
        4. 上传图片
      </div>
    </div>

    <div class="editor-container" data-aos="zoom-out">
      <br>
      <VMarkdownEditor class="editor" v-model="content" locale="en" :upload-action="handleUpload" />
    </div>
    <div>
      <button class="btn btn-primary" @click="confirm_window">提交</button>
    </div>
  </div>
</template>

<script>
import { VMarkdownEditor } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';
import { computed, ref } from 'vue';
import $ from 'jquery';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: "EditorView",
  components: {
    VMarkdownEditor,
  },
  data() {
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
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
        let scale = window.innerWidth > 768 ? Math.min(360 / size, 1) : Math.min(200 / size, 1);
        canvas.width = size * scale;
        canvas.height = size * scale;
        ctx.scale(scale, scale);
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
      }
    }
  },
  setup() {
    const content = ref(`# 使用数学公式样例
1. 行内公式
$\\frac{\\partial^2 y}{\\partial x^2}$
2. 块内公式
$$
累加 \\sum_{i=1}^n i\\quad 
累乘 \\prod_{i=1}^n\\quad
极限 \\lim\\limits_{x\\to0}x^2\\quad 
积分 \\int_a^b x^2 dx
$$`);

    const store = useStore();
    // 上传图片
    const handleUpload = (file) => {
      // console.log(file);
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
          url: "https://127.0.0.1:8082/api/markdown/submit_image",
          type: "POST",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          headers: {// jwt 验证方式，直接抄就对了
            "Authorization": "Bearer " + store.getters['user/getToken'],
          },
          success(resp) {
            resolve(resp);
          },
          error(textStatus, errorThrown) {
            console.error("submit image error", textStatus, errorThrown);
            reject(textStatus);
          }
        });
      });

    };


    // 点击按钮之后弹出窗口
    const show_confirm_window = ref(false);
    const confirm_window = () => {
      show_confirm_window.value = !show_confirm_window.value;
    };

    const router = useRouter();
    const title = ref('');
    const user_id = computed(() => {
      return store.getters['user/getUserId'];
    });
    const username = computed(() => {
      return store.getters['user/getUserName'];
    });
    // 确认提交帖子
    const sumbit = () => {
      // console.log(label_id.value);
      let canvas = document.getElementById('outputImage');
      // 将canvas内容转换为Blob对象
      canvas.toBlob(function (blob) {
        // 创建一个FormData对象
        let formData = new FormData();
        // 将Blob对象添加到FormData对象中
        formData.append('file', blob, 'image.jpg');

        // 上传图片封面
        $.ajax({
          url: "https://127.0.0.1:8082/api/cover/submit_cover",
          type: "POST",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          headers: {// jwt 验证方式，直接抄就对了
            "Authorization": "Bearer " + store.getters['user/getToken'],
          },
          success(resp) {
            // 获取到的封面的 url
            let cover_url = resp;
            console.log(cover_url);

            // 成功之后上传帖子
            $.ajax({
              url: "https://127.0.0.1:8082/api/post/submit_post",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                title: title.value,
                cover_url: cover_url,
                content: content.value,
                user_id: user_id.value,
                user_name: username.value,
                label_id: label_id.value,
              }),
              headers: {// jwt 验证方式，直接抄就对了
                "Authorization": "Bearer " + store.getters['user/getToken'],
              },
              dataType: "json",
              success(resp) {
                const post_id = ref(resp);
                $.ajax({
                  url: "https://localhost:8082/api/post/" + post_id.value,
                  type: "GET",
                  data: {
                  },
                  dataType: "json",
                  success(resp) {
                    // console.log(resp);
                    store.dispatch('recommend/addPosts', resp);
                  },
                  error(textStatus, errorThrown) {
                    console.error("get post: ", textStatus, errorThrown);
                  }
                });
                // store.dispatch('recommend/addPosts', asds);
                router.push({ name: "blog", params: { post_id: resp } });
                console.log(resp);
              },
              error(textStatus, errorThrown) {
                console.error("submit post error", textStatus, errorThrown);
              }
            });

          },
          error(textStatus, errorThrown) {
            console.error("submit cover error", textStatus, errorThrown);
          }
        });

      });
    }


    // 获得标签列表
    const labels = ref([]);
    const label_id = ref(0);
    $.ajax({
      url: "https://" + store.getters.IP_PORT + "/api/label/get_label_list",
      type: "GET",
      data: {
        
      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        labels.value = resp;
      },
      error(textStatus, errorThrown) {
					console.error("get user_management get_user_toal", textStatus, errorThrown);
				}
    });

    return {
      content,
      show_confirm_window,
      confirm_window,
      title,
      sumbit,
      handleUpload,
      labels,
      label_id,
    }
  }
};
</script>

<style scoped>
.submit_window {
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
  width: 24rem;
  z-index: 1;
}

.my_label {
  color: #502C6C;
  font-weight: 900;
  background-color: white;
}

.title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #502C6C;
}

@media(max-width: 768px) {
  .submit_window {
    width: 15rem;
  }

  .title {
    font-size: 1rem;
  }
}

.editor-container {
  display: flex;
}

.editor {
  width: 100%;
  height: 80vh;
  overflow: auto;
}
</style>