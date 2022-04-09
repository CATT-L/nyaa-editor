<template>
  <div class="container full-height">
    <div class="title no-select">
      <div>Explorer</div>
    </div>

    <div class="content">
      <template v-if="treeData.length <= 0">
        <div class="panel-empty-project">
          <el-button @click="handleCreateProject" type="primary" block
            >Create project</el-button
          >
        </div>
      </template>

      <template v-else>
        <el-tree
          class="directory-tree no-select"
          default-expand-all
          :indent="0"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          @node-contextmenu="handleNodeContextMenu"
        >
          <template #default="{ node, data }">
            <node-item :node="node" :data="data"></node-item>
          </template>
        </el-tree>
      </template>
    </div>

    <div
      class="context-menu-mask"
      v-if="contextMenuVisible"
      @click="contextMenuVisible = false"
      @contextmenu.prevent="contextMenuVisible = false"
    ></div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    "node-item": require("./node-item").default,
  },
  data() {
    return {
      contextMenuVisible: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      // treeData: [],
    };
  },
  computed: {
    ...mapState({
      projects: (state) => state.app.directoryTree.project.list,
    }),

    treeData() {
      return this.projects.map((project) => {
        var item = {
          id: project.id,
          type: "project",
          path: "",
          name: project.name,
          children: [],
        };

        item.children =
          this.$store.getters["app/directoryTree/file/children"](item);

        return item;
      });
    },
  },

  mounted() {},

  methods: {
    async handleCreateProject() {
      this.$prompt("Please input project name", "Create project", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputErrorMessage: "Invalid name",
      }).then(async ({ value }) => {
        await this.$store.dispatch("app/directoryTree/project/create", {
          name: value,
        });
      });
    },

    getPath(node) {
      if (node.parent === null) {
        return "";
      } else {
        return this.getPath(node.parent) + "/" + node.data.name;
      }
    },

    handleNodeClick(item, node, tree) {
      console.log("node click: " + item.name);
    },

    handleNodeContextMenu(e, item, node, tree) {
      console.log("node right click: " + item.name);

      this.contextMenuVisible = true;

      if (item.type === "project") {
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
              label: "Remove project",
              onClick: () => this.handleRemoveProject(e, item, node, tree),
            },
          ],
        });
      } else {
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
      }
    },

    async handleRemoveProject(e, item, node, tree) {
      try {
        await this.$confirm(
          "Are you sure to remove ' " + item.name + " ' ?",
          "Warning",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        );

        await this.$store.dispatch("app/directoryTree/project/delete", {
          item: item,
        });
      } catch (e) {}

      this.contextMenuVisible = false;
    },

    async handleDelete(e, item, node, tree) {
      this.$confirm(
        "Are you sure to delete ' " + item.name + " ' ?",
        "Warning",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(async () => {
        await this.$store.dispatch("app/directoryTree/file/delete", {
          item: item,
        });
      });

      this.contextMenuVisible = false;
    },

    async handleRename(e, item, node, tree) {
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
        .then(async ({ value }) => {
          await this.$store.dispatch("app/directoryTree/file/rename", {
            item: item,
            name: value,
          });
        })
        .catch((e) => {
          if (e.message) {
            this.$message({
              title: "Error",
              message: e.message,
              type: "error",
            });
          }
        });

      this.contextMenuVisible = false;
    },

    async handleCreateFile(e, item, node, tree) {
      this.$prompt("Please input file name", "Create file", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputErrorMessage: "Invalid file name",
      })
        .then(async ({ value }) => {
          node.expand();

          await this.$store.dispatch("app/directoryTree/file/create", {
            parent: item,
            name: value,
            isDir: false,
          });
        })
        .catch((e) => {
          if (e.message) {
            this.$message({
              title: "Error",
              message: e.message,
              type: "error",
            });
          }
        });

      this.contextMenuVisible = false;
    },

    async handleCreateDirectory(e, item, node, tree) {
      this.$prompt("Please input directory name", "Create directory", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputErrorMessage: "Invalid directory name",
      })
        .then(async ({ value }) => {
          node.expand();

          await this.$store.dispatch("app/directoryTree/file/create", {
            parent: item,
            name: value,
            isDir: true,
          });
        })
        .catch((e) => {
          if (e.message) {
            this.$message({
              title: "Error",
              message: e.message,
              type: "error",
            });
          }
        });

      this.contextMenuVisible = false;
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  overflow-y: auto;
}

.title {
  margin: 2px 10px;
  border-bottom: 1px #eee solid;
  font-size: 0.5rem;
  color: #909399;
}

.content {
  padding: 2px 0;
}

.panel-empty-project {
  padding: 20px;
}

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

<style>
.directory-tree .el-tree-node {
  position: relative;
  padding-left: 8px;
}

.directory-tree .el-tree-node__children {
  padding-left: 8px;
}

.directory-tree .el-tree-node:before {
  content: "";
  height: 100%;
  width: 1px;
  position: absolute;
  border-width: 1px;
  border-left: 1px solid #aaa;
  left: 19px;
  top: 20px;
  height: calc(100% - 33px);
}

.directory-tree .el-tree-node:after {
  content: "";
  width: 11px;
  height: 20px;
  position: absolute;
  left: 4px;
  top: 12px;
  border-width: 1px;
  border-top: 1px solid #aaa;
}

.directory-tree > .el-tree-node::after {
  border-top: none;
}
</style>
