<template>
  <div class="container" id="searchPopup">
    <div class="card">
      <div class="card-body">
        <form class="row" role="search" id="searchForm">
          <!-- 这里的 ref 是一个变量，用过外部调用这个 focusInput 函数修改他的变量使他聚焦 -->
          <input ref="input" id="searchInput" class="form-control" type="search" placeholder="搜索">
          <button id="searchButton" class="btn btn-primary" type="submit">搜索</button>
        </form>
        <ul class="list-group row">
          <li class="list-group-item">An item</li>
          <li class="list-group-item">A second item</li>
          <li class="list-group-item">A third item</li>
          <li class="list-group-item">A fourth item</li>
          <li class="list-group-item">And a fifth one</li>
          <li class="list-group-item">And a fifth one</li>
          <li class="list-group-item">And a fifth one</li>
          <li class="list-group-item">And a fifth one</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "SearchPopup",
  methods: {
    focusInput() {
      this.$refs.input.focus();
    },
  },
}
</script>

<style scoped>
.card-body {
  padding: 40px;
}

#searchForm {
  display: flex;
}

#searchInput {
  margin-right: 2%;
  width: 80%;
}

#searchButton {
  width: 18%;
}

.list-group {
  margin-top: 4px;
}

.list-group-item:hover {
  background-color: #EEEEEE;
}

#searchPopup {
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -190px);
  width: 50%;
  z-index: 1000;
}


@media(max-width: 1154px) {
  #searchPopup {
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -190px);
    width: 90%;
    z-index: 1000;
  }

  #searchInput {
    margin-right: 2%;
    width: 73%;
  }

  #searchButton {
    width: 25%;
    /* font-size: 10px; */
  }
}

@media(max-width: 767px) {
  #searchPopup {
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -190px);
    width: 90%;
    z-index: 1000;
  }

  #searchInput {
    margin-right: 2%;
    width: 63%;
  }

  #searchButton {
    width: 35%;
    /* font-size: 10px; */
  }
}
</style>