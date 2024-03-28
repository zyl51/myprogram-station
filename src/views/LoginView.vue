<template>
  <!-- Main -->
  <div class="d-md-flex h-md-100 align-items-center">
    <div class="col-md-6 p-0 bg-primary h-md-100">
      <div class="text-white d-md-flex align-items-center h-100 p-5 text-center justify-content-center">
        <div class="logoarea pt-5 pb-5">
          <p>
            <i class="fas fa-star-and-crescent fa-3x"></i>
          </p>
          <!-- <h1 class="mb-0 mt-3 display-4">Anchor</h1> -->
          <h1><strong class="title-gradient mb-0 mt-3">Program Station</strong></h1>
          <h5 class="font-weight-light mb-4" style="font-weight: 900 !important;">
            With this FREE Bootstrap 5.3.2
            <strong> UI Kit</strong>
          </h5>
          <a class="btn btn-outline-white btn-lg btn-round hidden" href="https://v5.bootcss.com/">
            <i class="fab fa-bootstrap"></i> Bootstrap
          </a>
        </div>
      </div>
    </div>
    <!-- class = loginarea -->
    <div class="col-md-6 p-0 bg-white h-md-100">
      <div class="d-md-flex align-items-center h-md-100 p-5 justify-content-center">
        <form class="border rounded p-5">
          <h3 class="mb-4 text-center">Sign In</h3>
          <div class="form-group">
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="邮箱"
              required="">
          </div>
          <div class="form-group">
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="密码" required="">
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label small text-muted" for="exampleCheck1">记住我</label>
          </div>
          <button type="submit" class="btn btn-success btn-round btn-block shadow-sm">登录</button>
          <small class="d-block mt-4 text-center"><a class="text-gray" href="#">忘记密码</a></small>
        </form>
      </div>
    </div>
  </div>
</template>
  
<script>

export default {
  name: 'LoginView',
  components: {
  }
}
</script>
  
<style scoped>
.title-gradient {
  background: linear-gradient(to right, #00ff62, #0091ff);
  background-clip: text;
  color: transparent;
}
</style>
  