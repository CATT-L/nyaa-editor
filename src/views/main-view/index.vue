<template>
  <el-container class="full-height">
    <el-header class="main-header no-select">
      <div flex>
        <div flex-box="1">
          <div class="header-title">Nyaa Editor</div>
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
        <template v-if="currentFile">
          <div class="panel-bar no-select" flex>
            <div style="margin-right: 10px">
              {{ currentFile.name }}
            </div>
            <div flex-box="1" class="panel-tool-box">
              <!-- <el-button @click="handleSave">Save</el-button> -->
            </div>
            <div class="panel-tool-box">
              <el-link @click="handleClose" plain :underline="false">
                <el-icon><el-icon-close-bold /></el-icon>
              </el-link>
            </div>
          </div>
          <div class="panel-editor">
            <editor ref="editor"></editor>
          </div>
        </template>
        <template v-else>
          <div style="padding: 10px">👈 Please open a file from explorer</div>
        </template>
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

  data() {
    return {
      currentFile: null,
    };
  },

  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    },
  },

  mounted() {},

  methods: {
    handleItemClick({ item }) {
      if (item.type !== "file") {
        return false;
      }

      this.currentFile = item;

      this.$nextTick(async () => {
        await this.$refs["editor"].save();
        this.$refs["editor"].openFile(item);
      });
    },

    handleClose() {
      this.$nextTick(async () => {
        await this.$refs["editor"].save();
        this.$refs["editor"].reset();
        this.currentFile = null;
      });
    },

    handleSave() {
      this.$nextTick(() => {
        this.$refs["editor"].save();
      });
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

.main-content > .panel-bar {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  color: var(--el-color-info);
}

.main-content > .panel-editor {
  height: calc(100% - 30px);
}

.main-content .panel-tool-box .el-button {
  padding: 4px 8px;
  height: 24px;
  font-size: var(--el-font-size-extra-small);
}
</style>
