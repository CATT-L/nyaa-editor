<template>
  <el-container class="full-height">
    <el-header class="main-header no-select">
      <div flex>
        <div flex-box="1">
          <div class="header-title">Markdown Editor</div>
          <el-tag type="info" size="small">ver {{ version }}</el-tag>
        </div>
        <div flex-box="0">
          <div class="header-title">
            <el-link href="https://github.com/CATT-L" target="_blank"
              >Powered by CATT-L</el-link
            >
          </div>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="main-aside">
        <directory-tree @item-click="handleItemClick"></directory-tree>
      </el-aside>
      <el-main class="main-content">
        <editor></editor>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {
    "directory-tree": require("@/components/directory-tree").default,
    editor: require("@/components/editor").default,
  },

  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    },
  },

  mounted() {},

  methods: {
    handleItemClick({ item }) {
      console.log(item);
    },
  },
};
</script>

<style scoped>
.header-title {
  display: inline-block;
  font-size: 2rem;
  padding: 10px 0;
  margin-right: 10px;
}
</style>

<style>
.main-header {
  border-bottom: 1px solid var(--el-fill-color-dark);
}

.main-aside {
  width: 300px;
  height: 100%;
  border-right: 1px solid var(--el-fill-color-dark);
  background: var(--el-fill-color-lighter);
}

.main-content {
  padding: 0;
}
</style>
