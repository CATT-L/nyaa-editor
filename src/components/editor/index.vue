<template>
  <div style="height: 100%">
    <el-container>
      <el-header>
        <div style="font-size: 2rem">Markdown Editor</div>
      </el-header>
      <el-container>
        <el-aside width="280px">
          <div style="background: #eee; height: 100%">
            <project-tree></project-tree>
          </div>
        </el-aside>
        <el-container>
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
    "project-tree": require("./project-tree").default,
  },
  data() {
    return {
      source: "",
      mdit: new MarkdownIt(),
      timerAutoSave: null,
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
  },
};
</script>

<style>
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
</style>
