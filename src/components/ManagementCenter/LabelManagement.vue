<template>
  <div class="container" style="margin-top: 1.5rem;">

    <div v-if="is_confirm_add" class="card add-label-popup">
      <button type="button" class="close" data-dismiss="alert" @click="add_label_popup">×</button>
      <div class="card-body">
        <form @submit.prevent="confirm_add_label">
          <div class="input-group">
            <!--  -->
            <input style="height: 47px;" v-model="add_label_var" class="form-control" type="search"
              placeholder="请输入标签名" />
            <button id="searchButton" class="btn btn-sm btn-primary" type="submit">
              确定
            </button>
          </div>
        </form>
      </div>
    </div>



    <div class="row">
      <div class="col-2">
        <nav id="navbar-example3" class="h-100 flex-column align-items-stretch pe-4 border-end">
          <nav class="nav nav-pills flex-column">
            <a class="nav-link btn btn-sm btn-success mb-3" style="color: white;" :class="{ my_button: is_add_page }"
              @click="add_label">增加</a>
            <a class="nav-link btn btn-sm btn-danger" style="color: white;" :class="{ my_button: is_delete_page }"
              @click="delete_label">删除</a>
          </nav>
        </nav>
      </div>

      <div class="col-10">

        <div v-if="is_delete_page">
          <span v-for="(label, index) in labels" class="badge badge-pill" :class="colors[label.id % 8]" :key="label.id"
            style="font-size: 20px; margin-bottom: 5px;">
            {{ label.label_name }}
            <button class="btn-close btn-close-white" style="height: 9px;width: 5px;"
              @click="confirm_delete_label(index)">
            </button>
          </span>
          <!-- 删除失败弹窗 -->
          <div v-if="is_delete_error" class="span6" style="background-color: #FF5916; border-radius: 5px;"
          data-aos="fade-up">
            <div class="alert">
              <button type="button" class="close" data-dismiss="alert" @click="colse_delete_error">×</button>
              <h3 style="color: white;text-align: center;" >
                有文章正在使用此标签，无法删除！
              </h3>
            </div>
          </div>

        </div>
        <div v-else>
          <span v-for="label in labels" class="badge badge-pill" :class="colors[label.id % 8]" :key="label.id"
            style="font-size: 20px;margin-bottom: 5px;">
            {{ label.label_name }}
          </span>
          <div class="plus-add" @click="add_label_popup"> + </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery';
import { useStore } from 'vuex';
import { ref } from 'vue';

export default {
  name: "LabelManagement",
  components: {
  },
  setup() {
    const store = useStore();
    const labels = ref([]);

    const ajax_get_labels = () => {
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
          console.error("get user_management get_user_labels", textStatus, errorThrown);
        }
      });
    }

    const ajax_add_label = () => {
      console.log(add_label_var.value);
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/management_label/add_label",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          label_name: add_label_var.value,
        }),
        dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          // console.log(resp);
          labels.value.push({ id: resp, label_name: add_label_var.value });
          add_label_var.value = '';
          is_confirm_add.value = false;
        },
        error(textStatus, errorThrown) {
          console.error("add label", textStatus, errorThrown);
        }
      });
    }

    const ajax_delete_label = (index) => {
      const label_id = labels.value[index].id;
      // console.log(add_label_var.value);
      $.ajax({
        url: "https://" + store.getters.IP_PORT + "/api/management_label/delete_label",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          label_id: label_id,
        }),
        // dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
        success(resp) {
          console.log(resp);
          labels.value.splice(index, 1);
        },
        error(textStatus, errorThrown) {
          console.error("delete label", textStatus, errorThrown);
          is_delete_error.value = true;
          setTimeout(() => {
            is_delete_error.value = false;
          }, 3000);
        }
      });
    }

    ajax_get_labels();

    const colors = [
      "badge-primary",
      "badge-secondary",
      "badge-success",
      "badge-danger",
      "badge-warning",
      "badge-info",
      "badge-purple",
      "badge-cyan",
    ];

    // 增加和删除模块
    const is_add_page = ref(true);
    const is_delete_page = ref(false);

    const add_label = () => {
      is_add_page.value = true;
      is_delete_page.value = false;
    };

    const delete_label = () => {
      is_add_page.value = false;
      is_delete_page.value = true;
    };

    // 
    const is_confirm_add = ref(false);

    const add_label_popup = () => {
      is_confirm_add.value = !is_confirm_add.value;
    };

    const add_label_var = ref('');

    const confirm_add_label = () => {
      ajax_add_label();
    };

    const is_delete_error = ref(false);

    const colse_delete_error = () => {
      is_delete_error.value = !is_delete_error.value;
    };

    const confirm_delete_label = (index) => {
      ajax_delete_label(index);
    };

    return {
      labels,
      colors,
      is_add_page,
      is_delete_page,
      add_label,
      delete_label,
      is_confirm_add,
      add_label_popup,
      add_label_var,
      confirm_add_label,
      is_delete_error,
      confirm_delete_label,
      colse_delete_error,
    }
  },
}
</script>


<style scoped>
.my_button {
  box-shadow: 0px 0px 5px rgb(60, 60, 60);
  transform: scale(1.02);
}

.btn-close-white {
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(360deg) brightness(100%) contrast(100%);
}

.plus-add {
  margin-left: 10px;
  background-color: rgb(247, 247, 247);
  display: inline-block;
  text-align: center;
  width: 35px;
  height: auto;
  font-size: 20px;
  border-radius: 5px;
  border: solid;
  border-color: rgb(181, 181, 181);
}

.add-label-popup {
  position: fixed;
  /* 使用固定定位 */
  top: 30%;
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

.container {
  position: relative;
}

.close {
  position: absolute;
  top: 0;
  right: 2px;
}
</style>