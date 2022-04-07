<template>
  <el-tree
    class="directory-tree no-select"
    draggable
    :data="treeData"
    :props="defaultProps"
    @node-click="handleNodeClick"
    @node-contextmenu="handleNodeContextMenu"
  >
  </el-tree>

  <div
    class="context-menu-mask"
    v-if="contextMenuVisible"
    @click="contextMenuVisible = false"
    @contextmenu.prevent="contextMenuVisible = false"
  ></div>
</template>

<script>
export default {
  data() {
    return {
      contextMenuVisible: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeData: [
        {
          name: "public",
          isDir: true,
          children: [
            {
              name: "favicon.ico",
              isDir: false,
            },
            {
              name: "index.html",
              isDir: false,
            },
          ],
        },
        {
          name: "src",
          isDir: true,
          children: [
            {
              name: "assets",
              isDir: true,
              children: [
                {
                  name: "logo.png",
                  isDir: false,
                },
              ],
            },
            {
              name: "App.vue",
              isDir: false,
            },
            {
              name: "main.js",
              isDir: false,
            },
          ],
        },
        {
          name: "package.json",
          isDir: false,
        },
        {
          name: "README.md",
          isDir: false,
        },
        {
          name: "vue.config.js",
          isDir: false,
        },
      ],
    };
  },

  methods: {
    handleNodeClick(item, node, tree) {
      console.log("node click: " + item.name);
    },

    handleNodeContextMenu(e, item, node, tree) {
      console.log("node right click: " + item.name);

      this.contextMenuVisible = true;

      if (item.isDir) {
        this.$contextmenu({
          zIndex: 200,
          x: e.clientX,
          y: e.clientY,
          items: [
            {
              label: "New file",
              onClick: () => this.handleCreateFile(e, item, node, tree),
            },
            {
              label: "New directory",
              onClick: () => this.handleCreateDirectory(e, item, node, tree),
            },
            {
              label: "Rename",
              onClick: () => this.handleRename(e, item, node, tree),
            },
            {
              label: "Delete",
              onClick: () => this.handleDelete(e, item, node, tree),
            },
          ],
        });
      } else {
        this.$contextmenu({
          zIndex: 200,
          x: e.clientX,
          y: e.clientY,
          items: [
            {
              label: "Rename",
              onClick: () => this.handleRename(e, item, node, tree),
            },
            {
              label: "Delete",
              onClick: () => this.handleDelete(e, item, node, tree),
            },
          ],
        });
      }
    },

    handleDelete(e, item, node, tree) {
      this.$confirm(
        "Are you sure to delete ' " + item.name + " ' ?",
        "Warning",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex((d) => d.name === item.name);

          children.splice(index, 1);
        })
        .catch(() => {});

      this.contextMenuVisible = false;
    },

    handleRename(e, item, node, tree) {
      // todo verify the name is duplicated or not

      this.$prompt(
        `Please input ${item.isDir ? "directory" : "file"} name`,
        "Rename",
        {
          inputValue: item.name,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          inputErrorMessage: "Invalid name",
        }
      )
        .then(({ value }) => {
          item.name = value;
        })
        .catch(() => {});
    },

    handleCreateFile(e, item, node, tree) {
      // todo verify name is duplicated or not

      // reload children sort

      this.$prompt("Please input file name", "Create file", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputErrorMessage: "Invalid file name",
      })
        .then(({ value }) => {
          var fileItem = {
            name: value,
            isDir: false,
          };

          node.expand();

          item.children.push(fileItem);
        })
        .catch(() => {});
    },

    handleCreateDirectory(e, item, node, tree) {
      // todo verify name is duplicated or not

      // todo reload children sort

      this.$prompt("Please input directory name", "Create directory", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputErrorMessage: "Invalid directory name",
      })
        .then(({ value }) => {
          var fileItem = {
            name: value,
            isDir: true,
            children: [],
          };

          node.expand();

          item.children.push(fileItem);
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.context-menu-mask {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 0, 0, 0);
}
</style>
