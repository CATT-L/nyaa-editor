<template>
  <editor></editor>
</template>

<script>
export default {
  name: "App",
  components: {
    editor: require("@/components/editor").default,
  },
  mounted() {
    console.log(process.env);

    this.$store.dispatch("__autoload");
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.full-height {
  height: 100%;
}

.no-select {
  user-select: none;
}

.el-button[block] {
  display: block;
  width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-message--success {
  --el-message-bg-color: var(--el-color-success-dark-2);
  --el-message-border-color: var(--el-color-success-dark-2);
  --el-message-text-color: var(--el-color-success-light-9);
}

.el-message--error {
  --el-message-bg-color: var(--el-color-error);
  --el-message-border-color: var(--el-color-error-dark-2);
  --el-message-text-color: var(--el-color-error-light-9);
}

.el-message--warning {
  --el-message-bg-color: var(--el-color-warning);
  --el-message-border-color: var(--el-color-warning-dark-2);
  --el-message-text-color: var(--el-color-white);
}
</style>
