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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
