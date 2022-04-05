<template>
  <hello-world msg="Hello,world!" />
</template>

<script>

export default {
  name: "App",
  components: {
    "hello-world": require("@/components/HelloWorld.vue").default,
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
