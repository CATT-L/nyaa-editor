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
          draggable
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          @node-contextmenu="handleNodeContextMenu"
        >
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
      return this.projects.map((project) => ({
        id: project.id,
        type: "project",
        path: "",
        name: project.name,
        children: [],
      }));
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

      switch (item.type) {
        case "project":
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
          break;
        case "dir":
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
          break;
        case "file":
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
          break;
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
          name: item.name,
        });
      } catch (e) {}

      this.contextMenuVisible = false;
    },

    async handleDelete(e, item, node, tree) {
      try {
        await this.$confirm(
          "Are you sure to delete ' " + item.name + " ' ?",
          "Warning",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        );

        await this.$store.dispatch("app/directoryTree/io/remove", {
          path: this.getPath(node),
          name: item.name,
        });

        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d) => d.name === item.name);

        children.splice(index, 1);
      } catch (e) {}

      this.contextMenuVisible = false;
    },

    async handleRename(e, item, node, tree) {
      try {
        var { value } = await this.$prompt(
          `Please input ${item.isDir ? "directory" : "file"} name`,
          "Rename",
          {
            inputValue: item.name,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            inputErrorMessage: "Invalid name",
          }
        );

        var { name } = await this.$store.dispatch(
          "app/directoryTree/io/rename",
          {
            path: this.getPath(node),
            name: item.name,
            newName: value,
          }
        );

        item.name = name;
      } catch (e) {}

      this.contextMenuVisible = false;
    },

    async handleCreateFile(e, item, node, tree) {
      try {
        var { value } = await this.$prompt(
          "Please input file name",
          "Create file",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            inputErrorMessage: "Invalid file name",
          }
        );

        var fileItem = await this.$store.dispatch(
          "app/directoryTree/io/createFile",
          {
            path: this.getPath(node),
            name: value,
          }
        );

        item.children.push(fileItem);

        node.expand();
      } catch (e) {}

      this.contextMenuVisible = false;
    },

    async handleCreateDirectory(e, item, node, tree) {
      try {
        var { value } = await this.$prompt(
          "Please input directory name",
          "Create directory",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            inputErrorMessage: "Invalid directory name",
          }
        );

        var fileItem = await this.$store.dispatch(
          "app/directoryTree/io/createDirectory",
          {
            path: this.getPath(node),
            name: value,
          }
        );

        item.children.push(fileItem);

        node.expand();
      } catch (e) {}

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
