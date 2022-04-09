<template>
  <div style="height: 100%">
    <el-container>
      <el-header class="no-select">
        <div style="font-size: 2rem">Markdown Editor</div>
      </el-header>
      <el-container>
        <el-aside width="280px">
          <directory-tree></directory-tree>
        </el-aside>
        <el-container>
          <el-header class="my-tab" style="height: auto; padding: 0">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              class="demo-tabs no-select"
              closable
              @tab-remove="removeTab"
              @contextmenu.prevent=""
            >
              <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
              </el-tab-pane>
            </el-tabs>
          </el-header>
          <el-main
            style="
              position: relative;
              width: 100%;
              height: 100%;
              padding: 0;
              overflow: hidden;
            "
          >
            <div
              style="
                position: absolute;
                height: 100%;
                width: 50%;
                left: 0;
                top: 0;
              "
            >
              <textarea
                style="
                  display: block;
                  width: 100%;
                  height: 100%;
                  resize: none;
                  outline: none;
                  border: none;
                "
                v-model="source"
              ></textarea>
            </div>

            <div
              style="
                position: absolute;
                height: 100%;
                width: 50%;
                top: 0;
                right: 0;
                overflow-y: auto;
              "
            >
              <div class="result" style="" v-html="html"></div>
            </div>
          </el-main>
          <!-- <el-footer>Footer</el-footer> -->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import "@/assets/themes/github.css";

export default {
  components: {
    "directory-tree": require("@/components/directory-tree").default,
  },
  data() {
    return {
      source: "",
      mdit: new MarkdownIt(),
      timerAutoSave: null,

      editableTabsValue: "1",
      editableTabs: [
        {
          title: "Tab 1",
          name: "1",
          content: "Tab 1 content",
        },
        {
          title: "Tab 2",
          name: "2",
          content: "Tab 2 content",
        },
      ],
    };
  },
  computed: {
    html() {
      return this.mdit.render(this.source);
    },
  },
  mounted() {
    this.handleLoad();

    this.timerAutoSave = setInterval(() => {
      this.handleSave();
    }, 5e3);
  },

  unmounted() {
    clearInterval(this.timerAutoSave);
    this.timerAutoSave = null;
    this.handleSave();
  },
  methods: {
    handleLoad() {
      try {
        var source = JSON.parse(localStorage.source);
      } catch (e) {
        var source = "";
      }

      this.source = source;
    },

    handleSave() {
      localStorage.source = JSON.stringify(this.source);
    },

    removeTab() {
      console.log("editableTabsValue");
    },
  },
};
</script>

<style>
.my-tab .el-tabs__content {
  display: none;
}

.my-tab .el-tabs__header {
  margin: 0;
}

.my-tab .el-tabs__item {
  height: 35px;
  line-height: 35px;
}

.el-container {
  height: 100%;
}

.result {
  background: #fff;
  border-radius: 5px;
  padding: 15px;
}

.result img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.result pre {
  width: 100%;
  background: #f8f8f8;
  padding: 5px 10px;
}

.result pre code {
  background: none;
  border: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  border-left: 1px solid #888;
  border-top: 1px solid #888;
}

th,
td {
  border-right: 1px solid #888;
  border-bottom: 1px solid #888;
  padding: 5px 15px;
}

th {
  font-weight: bold;
}

hr {
  height: 0;
  border-color: #eee;
}
</style>
