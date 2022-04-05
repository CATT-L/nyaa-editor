<template>
  <div ref="editor" class="editor" contenteditable="true">
    <div>Hello,world</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    console.log(this.$refs["editor"]);
  },
  unmounted() {},
};
</script>


<style scoped>

.editor {

  border: solid 1px red;
  
  outline: none;
  margin: 0 auto;
  padding: 50px 10px;
  width: 1000px;
}

</style>