<template>
  <div class="container" style="margin-top: 100px;">
    <div style="font-weight: 900;align-content: center;">
      正常语句想要换行可以输入两个或更多空格之后再回车
    </div>
    <div class="editor-container">
      <br>
      <VMarkdownEditor v-model="content" class="editor" />
    </div>
    <div>
      <button class="btn btn-primary" @click="sumbit">提交</button>
    </div>
  </div>
</template>
  
<script>
import { VMarkdownEditor } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';

export default {
  name: "EditorView",
  components: {
    VMarkdownEditor,
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    sumbit() {
      console.log(this.content);
    }
  }
};
</script>
  
<style scoped>
.editor-container {
  display: flex;
}

.editor {
  width: 100%;
  height: 80vh;
  overflow: auto;
  /* border-right: 1px solid #ccc; */
}
</style>