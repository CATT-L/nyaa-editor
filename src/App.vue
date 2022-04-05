<template>
  <editor></editor>
</template>

<script>
export default {
  name: "App",
  components: {
    editor: require("@/components/editor").default,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
