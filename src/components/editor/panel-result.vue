<template>
  <div class="panel-result">
    <div class="result-html" v-html="html"></div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import "@/assets/themes/github.css";

export default {
  props: {
    markdown: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      mdit: new MarkdownIt(),
      html: "",
    };
  },

  watch: {
    markdown: {
      immediate: true,
      handler(val) {
        this.handleRefresh();
      },
    },
  },

  methods: {
    handleRefresh() {
      this.html = this.mdit.render(this.markdown);
    },
  },
};
</script>

<style scoped>
.panel-result {
  position: absolute;
  height: 100%;
  width: 100%;
  /* background: #6cf; */
  overflow-y: auto;
}

.result-html {
  position: relative;
  margin: 10px;
  background: white;
}

.result-html /deep/ img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.result-html /deep/ pre {
  background: #f8f8f8;
  padding: 5px 10px;
}

.result-html /deep/ pre code {
  background: none;
  border: none;
}
</style>

<style>
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
