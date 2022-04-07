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
        label: "label",
      },
      treeData: [
        {
          label: "Level one 1",
          children: [
            {
              label: "Level two 1-1",
              children: [
                {
                  label: "Level three 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "Level one 2",
          children: [
            {
              label: "Level two 2-1",
              children: [
                {
                  label: "Level three 2-1-1",
                },
              ],
            },
            {
              label: "Level two 2-2",
              children: [
                {
                  label: "Level three 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "Level one 3",
          children: [
            {
              label: "Level two 3-1",
              children: [
                {
                  label: "Level three 3-1-1",
                },
              ],
            },
            {
              label: "Level two 3-2",
              children: [
                {
                  label: "Level three 3-2-1",
                },
              ],
            },
          ],
        },
      ],
    };
  },

  methods: {
    onContextMenu(e) {
      console.log("x");
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: "A menu item",
            onClick: () => {
              alert("You click a menu item");
            },
          },
          {
            label: "A submenu",
            children: [
              { label: "Item1" },
              { label: "Item2" },
              { label: "Item3" },
            ],
          },
        ],
      });
    },
    handleNodeClick(item, node, tree) {
      console.log("node click: " + item.label);
    },
    handleNodeContextMenu(e, item, node, tree) {
      console.log("node right click: " + item.label);

      this.contextMenuVisible = true;

      this.$contextmenu({
        zIndex: 200,
        x: e.clientX,
        y: e.clientY,
        items: [
          {
            label: "A menu item",
            onClick: () => {
              alert("You click a menu item");
            },
          },
          {
            label: "A submenu",
            disabled: true,
            children: [
              { label: "Item1", disabled: true },
              { label: "Item2" },
              { label: "Item3" },
            ],
          },
          {
            label: "A submenu",
            children: [
              { label: "Item1", disabled: true },
              { label: "Item2" },
              { label: "Item3" },
            ],
          },
        ],
      });

      // console.log(`click positon: (${e.clientX}, ${e.clientY})`);

      // this.contextMenuVisible = true;

      // this.$nextTick(() => {
      //   var menu = this.$refs["node-context-menu"];

      //   menu.style.left = e.clientX + "px";
      //   menu.style.top = e.clientY + "px";
      // });
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
