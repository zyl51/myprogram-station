<template>
  <div class="container" style="padding-top: 3.5rem;">

    <div v-if="show_updated" class="card prompt-success" style="width: 18rem;z-index: 1;">
      <div class="card-body">
        <h5 class="card-title" style="text-align: center;font-weight: 900;color: #502C6C;"
          > 修改成功
        </h5>
        <div class="row">
          <div class="col-4"></div>
          <button @click="confirm" class="btn btn-primary col-4 btn-sm">确定</button>
          <div class="col-4"></div>
        </div>
      </div>
    </div>

    <!-- 修改用户密码 -->
    <form class="row" action="">
      <div class="col-2"></div>
      <div class="input-group mb-3 col-8">
        <label class="input-group-text my_label">旧密码</label>
        <input type="text" v-model="old_password" class="form-control" id="inputGroupFile01" required="">
      </div>
      <div class="col-2"></div>
      <div class="col-2"></div>
      <div class="input-group mb-3 col-8">
        <label class="input-group-text my_label">新密码</label>
        <input type="text" v-model="new_password" class="form-control" id="inputGroupFile01" required="">
      </div>
      <div class="col-2"></div>
      <div class="col-2"></div>
      <div class="input-group mb-3 col-8">
        <label class="input-group-text my_label">确认新密码</label>
        <input type="text" v-model="confirm_pasword" class="form-control" id="inputGroupFile01" required="">
      </div>
      <div class="col-5"></div>
      <button class="btn btn-primary col-2" @click="sumbit_username" :disabled="!username">确定</button>
    </form>
    <!-- End 修改用户的密码 -->
  </div>

</template>

<script>

export default {
  name: "UpdatePasswordView",
  components: {

  },
  setup() {
    const show_updated = ref(false);
    const confirm = () => {
      show_updated.value = !show_updated.value;
    }

    const old_password = ref('');
    const new_password = ref('');
    const confirm_pasword = ref('');
    const update_password = () => {
      show_updated.value = !show_updated.value;
    };

    return {
      show_updated,
      confirm,
      old_password,
      new_password,
      confirm_pasword,
      update_password,
    }
  }
}
</script>


<style scoped></style>